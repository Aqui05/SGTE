import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PageTitleService } from 'src/app/services/title-service.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  isCollapsed = false;
  userRole: string = '';
  userLogo: string = '';
  isAdmin: boolean = false;
  user: any = {};
  theme: 'light' | 'dark' = 'light';
  title: string;


  query: string = '';
  results: any = null;

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
        this.router.navigate(['/']);
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



  //search function
  performSearch() {
    this.dataService.search(this.query).subscribe(
      data => this.results = data,
      error => console.error(error)
    );
  }
}
