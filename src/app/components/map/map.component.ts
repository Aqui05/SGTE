import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Feature, Geometry } from 'geojson';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Détails d'un point
interface DataPoint {
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  id: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private dataPoints: DataPoint[] = [];
  private readonly beninGeoJson: string = 'assets/BEN.geo.json';   // Fichier geo.json du Benin téléchargé
  private departmentCounts: { [key: string]: number } = {};

  TransportId!: number;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    // Transport id from the router
    this.TransportId = Number(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {
    this.initMap();
    this.loadGeoJson();
    this.loadDataPoints();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [9.3077, 2.3158],
      zoom: 7
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadGeoJson(): void {
    fetch(this.beninGeoJson)
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#0000FF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature: Feature<Geometry, { NAME_1: string }>, layer: L.Layer) => {
            if (feature.properties) {
              const departmentName = feature.properties.NAME_1;
              layer.bindPopup(departmentName);
              this.departmentCounts[departmentName] = 0;
            }
          }
        }).addTo(this.map);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }

  private loadDataPoints(): void {
    this.dataService.getPolylines(this.TransportId).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.dataPoints = response.data.flatMap((polyline: any) => {
            const startCoordinates = JSON.parse(polyline.start_coordinate).coordinates;
            const endCoordinates = JSON.parse(polyline.end_coordinate).coordinates;

            return [
              {
                latitude: startCoordinates[1],
                longitude: startCoordinates[0],
                name: `Start Point ${polyline.id}`,
                description: `Distance: ${polyline.distance} km`,
                id: polyline.id
              },
              {
                latitude: endCoordinates[1],
                longitude: endCoordinates[0],
                name: `End Point ${polyline.id}`,
                description: `Distance: ${polyline.distance} km`,
                id: polyline.id
              }
            ];
          });
          this.addDataPointsToMap();
        } else {
          console.error('Invalid response format from getPolylines():', response);
        }
      },
      error: (error) => {
        console.error('Error fetching polylines:', error);
      }
    });
  }


  private addDataPointsToMap(): void {
    const markers = new L.MarkerClusterGroup();

    this.dataPoints.forEach(point => {
      const marker = L.marker([point.latitude, point.longitude]);
      marker.bindPopup(`<b>${point.name}</b><br>${point.description}`);
      markers.addLayer(marker);

      this.updateDepartmentCount(point);
    });

    this.map.addLayer(markers);
    this.addDepartmentLabels();
  }

  private updateDepartmentCount(point: DataPoint): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) {
        const geoJsonLayer = layer as L.GeoJSON;
        if (geoJsonLayer.feature && this.isPointInPolygon(L.latLng(point.latitude, point.longitude), geoJsonLayer)) {
          if ('properties' in geoJsonLayer.feature && geoJsonLayer.feature.properties) {
            const departmentName = geoJsonLayer.feature.properties.NAME_1;
            this.departmentCounts[departmentName]++;
          }
        }
      }
    });
  }

  private addDepartmentLabels(): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) {
        const geoJsonLayer = layer as L.GeoJSON;
        if (geoJsonLayer.feature && 'properties' in geoJsonLayer.feature && geoJsonLayer.feature.properties) {
          const departmentName = geoJsonLayer.feature.properties.NAME_1;
          const count = this.departmentCounts[departmentName];
          if (count > 0 && 'geometry' in geoJsonLayer.feature && geoJsonLayer.feature.geometry) {
            const centroid = this.getCentroid(geoJsonLayer.feature.geometry.coordinates as any);
            L.marker(centroid, {
              icon: L.divIcon({
                className: 'label',
                html: `<div style="background-color: rgba(255, 255, 255, 0.7); border-radius: 3px; padding: 2px;">${count}</div>`,
                iconSize: [30, 30]
              })
            }).addTo(this.map);
          }
        }
      }
    });
  }

  private getCentroid(coords: any): L.LatLngExpression {
    if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // Point
      return [coords[1], coords[0]];
    } else if (coords.length >= 1 && Array.isArray(coords[0])) {
      // Polygon ou LineString
      let latSum = 0, lngSum = 0, numPoints = 0;
      const processCoord = (coord: number[]) => {
        if (coord.length === 2) {
          latSum += coord[1];
          lngSum += coord[0];
          numPoints++;
        }
      };

      if (Array.isArray(coords[0][0])) {
        // Polygon
        (coords as number[][][]).forEach(ring => ring.forEach(processCoord));
      } else {
        // LineString
        (coords as number[][]).forEach(processCoord);
      }

      return numPoints > 0 ? [latSum / numPoints, lngSum / numPoints] : [0, 0];
    }

    console.error('Invalid coordinates format', coords);
    return [0, 0]; // Retourner un point par défaut en cas d'erreur :: pour éviter des erreurs évidentes
  }

  private isPointInPolygon(point: L.LatLng, layer: L.GeoJSON): boolean {
    const polygonBounds = layer.getBounds();
    return polygonBounds.contains(point);
  }
}
