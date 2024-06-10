import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responseData: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  title = 'Home';

  isVisible = false;
  isOkLoading = false;

  showLogin(): void {
    this.router.navigate(['/login'], { queryParams: { isSignIn: true } });
  }

  showRegister(): void {
    this.router.navigate(['/login'], { queryParams: { isSignIn: false } });
  }
}
