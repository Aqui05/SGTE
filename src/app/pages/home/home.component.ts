import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responseData: any;

  constructor(private route: ActivatedRoute, private router: Router) {}


  currentTime: string = '';
  images: string[] = [
    'assets/img/port.jpg',
    'assets/img/home1.png',
    'assets/img/home2.png',
    'assets/img/home3.png',
    'assets/img/home4.png',
    'assets/img/home5.png'
  ];

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }



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






