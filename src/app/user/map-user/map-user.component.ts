import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-routing-machine';
import { Feature, Geometry } from 'geojson';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { error } from 'jquery';

// Détails d'un point
interface DataPoint {
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  id: number;
}

@Component({
  selector: 'app-map-user',
  templateUrl: './map-user.component.html',
  styleUrls: ['./map-user.component.css']
})
export class MapUserComponent implements OnInit {
  private map!: L.Map;
  private dataPoints: DataPoint[] = [];
  private readonly beninGeoJson: string = 'assets/BEN.geo.json';   // Fichier geo.json du Benin téléchargé
  private departmentCounts: { [key: string]: number } = {};

  TransportId!: number;
  transport: any;
  type!: string;

  searchQuery: string = '';
  private searchMarker: L.Marker | null = null;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private http: HttpClient
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
        console.log(response);
        if (Array.isArray(response)) {
          this.processPolylines(response);
        } else if (response.data && Array.isArray(response.data)) {
          this.processPolylines(response.data);
        } else {
          console.error('Invalid response format from getPolylines():', response);
        }
      },
      error: (error) => {
        console.error('Error fetching polylines:', error);
      }
    });
  }

  private loadRoutes(): void {
    this.dataService.getRoute(this.TransportId).subscribe({
      next: (response: any) => {
        console.log(response.data);
        const route = response.data;

        if (route) {
          const waypoints = [
            L.latLng(route.start_latitude, route.start_longitude),
            L.latLng(route.end_latitude, route.end_longitude)
          ];

          // Ajouter les waypoints intermédiaires si disponibles
          if (route.route_waypoints) {
            const waypointsData = JSON.parse(route.route_waypoints).coordinates;
            for (const coord of waypointsData) {
              waypoints.push(L.latLng(coord[1], coord[0]));
            }
          }

          // Ajouter la route à la carte
          L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true
          }).addTo(this.map);

          // Zoomer sur la route
          const bounds = L.latLngBounds(waypoints);
          this.map.fitBounds(bounds);
        }
      },
      error: (error) => {
        console.error('Error fetching routes:', error);
      }
    });
  }


  private processPolylines(polylines: any[]): void {
    this.dataPoints = polylines.flatMap((polyline: any) => {
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
  }

  private addDataPointsToMap(): void {
    const markers = new L.MarkerClusterGroup();

    this.dataPoints.forEach(point => {
      const marker = L.marker([point.latitude, point.longitude]);
      marker.bindPopup(`<b>${point.name}</b><br>${point.description}`);
      markers.addLayer(marker);
    });

    this.map.addLayer(markers);
  }


  private centerMapOnLocation(lat: number, lon: number): void {
    this.map.setView([lat, lon], 13);

    if (this.searchMarker) {
      this.map.removeLayer(this.searchMarker);
    }

    this.searchMarker = L.marker([lat, lon]).addTo(this.map);
    this.searchMarker.bindPopup(this.searchQuery).openPopup();
  }

}
