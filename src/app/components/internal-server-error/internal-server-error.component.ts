import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.css']
})
export class InternalServerErrorComponent {

  constructor(private location: Location) {}
  goBack(): void {
    this.location.back();
  }

}
