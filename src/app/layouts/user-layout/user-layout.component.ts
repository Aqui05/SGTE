import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { DataService } from 'src/app/services/data.service';
import { PageTitleService } from 'src/app/services/title-service.service';

interface Notification {
  id: string;
  type: string;
  created_at: string;
  read_at: string | null;
  data: any;
}
@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})

export class UserLayoutComponent implements OnInit {

  isDrawerVisible = false;

  isCollapsed = false;
  userRole: string = '';
  userLogo: string = '';
  isAdmin: boolean = false;
  user: any = {};
  theme: 'light' | 'dark' = 'light';
  title: string;


  query: string = '';
  results: any = null;

  //notifications: any[] = [];

  notifications: Notification[] = [];

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
    this.router.navigate(['/user/profile']);
  }



  //search function
  performSearch() {
    this.dataService.search(this.query).subscribe(
      data => this.results = data,
      error => console.error(error)
    );
  }

  openNotifications(): void {
    this.isDrawerVisible = true;
    this.dataService.getNotifications().subscribe(
      (data: any) => {
        if (data && data.notification && Array.isArray(data.notification)) {
          this.notifications = data.notification;
        } else {
          this.notifications = [];
          console.error('Format de données inattendu:', data);
        }
        console.log(this.notifications);
      },
      (error) => {
        console.error('Erreur lors de la recherche :', error);
        this.notifications = [];
      }
    );
  }

  // openNotifications(): void {
  //   this.isDrawerVisible = true;
  //   this.dataService.getNotifications().subscribe(
  //     (data: Notification[]) => {
  //       this.notifications = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la recherche :', error);
  //     }
  //   );
  // }

  closeDrawer(): void {
    this.isDrawerVisible = false;
  }

  getNotificationMessage(notification: Notification): string {
    const createdAt = new Date(notification.created_at).toLocaleString();
    switch(notification.type) {
      case 'App\\Notifications\\ReservationAdd':
        return `Vous avez enregistré une nouvelle réservation le ${createdAt} pour le ${notification.data.reservationDatetime} de ${notification.data.departureWaypoint} à ${notification.data.destinationWaypoint}.`;
      case 'App\\Notifications\\ExpeditionMerchandiseAdd':
        return `L'expédition de votre marchandise a été planifiée le ${createdAt}.`;
      // Ajoutez d'autres cas ici
      default:
        return `Nouvelle notification reçue le ${createdAt}.`;
    }
  }

  showNotification(notificationId: number): void {
    this.dataService.getNotification(notificationId).subscribe(
      (data) => {
        // Handle notification detail display
      },
      (error) => {
        console.error('Erreur lors de la recherche :', error);
      }
    );
  }
}

