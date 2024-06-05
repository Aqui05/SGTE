import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent /*implements OnInit*/ {
  // @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  // @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  // zoom = 2;
  // center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'hybrid',
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   maxZoom: 15,
  //   minZoom: 8,
  // };
  // markers: Array<{ position: google.maps.LatLngLiteral; label?: string }> = [];
  // infoContent = '';

  // ngOnInit() {
  //   // Coordonnées de deux points spécifiques
  //   const pointA = { lat: 20.5937, lng: 78.9629 };
  //   const pointB = { lat: 21.5937, lng: 79.9629 };

  //   // Ajouter les marqueurs à la liste des marqueurs
  //   this.markers.push({ position: pointA, label: 'A' });
  //   this.markers.push({ position: pointB, label: 'B' });

  //   // Centrer la carte sur le premier point
  //   this.center = pointA;

  //   // Calculer la route entre les deux points
  //   const directionsService = new google.maps.DirectionsService();
  //   const directionsRenderer = new google.maps.DirectionsRenderer();

  //   // Use setTimeout to ensure the map is loaded before setting the directions
  //   setTimeout(() => {
  //     directionsRenderer.setMap(this.map.googleMap!);
  //     directionsService.route(
  //       {
  //         origin: pointA,
  //         destination: pointB,
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       },
  //       (response, status) => {
  //         if (status === 'OK') {
  //           directionsRenderer.setDirections(response);
  //         } else {
  //           window.alert('Directions request failed due to ' + status);
  //         }
  //       }
  //     );
  //   });
  // }

  // moveMap(event: google.maps.MapMouseEvent) {
  //   if (event.latLng) {
  //     this.center = event.latLng.toJSON();
  //   }
  // }

  // addMarker(event: google.maps.MapMouseEvent) {
  //   if (event.latLng) {
  //     this.markers.push({
  //       position: event.latLng.toJSON(),
  //     });
  //   }
  // }

  // openInfo(marker: MapMarker, content: any) {
  //   this.infoContent = content;
  //   this.infoWindow.open(marker);
  // }
}
