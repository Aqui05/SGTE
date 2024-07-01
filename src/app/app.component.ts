import { Component, inject } from '@angular/core';
import { DataService } from './services/data.service';
import { error } from 'jquery';
import { PageTitleService } from 'src/app/services/title-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'root';

  pageTitleService : PageTitleService= inject(PageTitleService);
}
