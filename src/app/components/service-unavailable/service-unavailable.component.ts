import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.css']
})
export class ServiceUnavailableComponent {
  constructor(private location: Location) {}
  goBack(): void {
    this.location.back();
  }

}
