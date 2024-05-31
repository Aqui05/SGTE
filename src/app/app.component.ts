import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { error } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  userRole: string = '';

  constructor(private dataService: DataService) { }

  isAdmin: boolean = false;
  // ...

  ngOnInit(): void {
    this.UserInfo();
    this.UserRole();
  }

  UserRole(): void {
    this.dataService.getUserInfo().subscribe(
      (userInfo) => {
        this.userRole = userInfo.role.toLowerCase();
        this.isAdmin = this.userRole === 'admin'; // Définir isAdmin en fonction du rôle
        if(this.userRole === 'admin') {
          this.isAdmin = true;
        }
        console.log('User Role:', this.userRole);
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  UserInfo(): void {
    this.dataService.getUserInfo().subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    )
  }
}
