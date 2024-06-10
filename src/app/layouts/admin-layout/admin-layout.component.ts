import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  isCollapsed = false;

  userRole: string = '';

  user: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.UserInfo();
  }

  UserInfo(): void {
    this.dataService.getUserInfo().subscribe(
      (response) => {
        this.user= response;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    )
  }

  logout():void {
    this.dataService.logout();
    console.log('Déconnexion réussie');
    window.location.href = '';
  }

}
