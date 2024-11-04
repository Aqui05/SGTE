import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {
  
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

}
