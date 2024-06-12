import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PageTitleService } from 'src/app/services/title-service.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  isCollapsed = false;
  userRole: string = '';
  userLogo: string = '';
  isAdmin: boolean = false;
  user: any = {};
  theme: 'light' | 'dark' = 'light';
  title: string;

  constructor(
    private dataService: DataService,
    private router: Router,
    private pageTitleService: PageTitleService
  ) {
    this.title = this.pageTitleService.getTitle();
  }

  ngOnInit(): void {
    this.pageTitleService.titleChange.subscribe(title => {
      this.title = title;
    });
    this.UserInfo();
  }

  UserInfo(): void {
    this.dataService.getUserInfo().subscribe(
      (response) => {

        this.user = response;
        console.log('User:', this.user);
        this.userRole = response.role.toLowerCase();
        this.isAdmin = this.userRole === 'admin';
        console.log('User Role:', this.userRole);

        this.userLogo = response.avatar;
        console.log(this.userLogo)
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  logout(): void {
    this.dataService.logout().subscribe(
      response => {
        console.log('Logout successful:', response);
        this.router.navigate(['/login']);
        this.dataService.clearToken()
      },
      error => {
        console.error('Logout error:', error);
      }
    )
  }

  profile(): void {
    this.router.navigate(['/profil']);
  }

}
