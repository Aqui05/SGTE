import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { error } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'root';
}
