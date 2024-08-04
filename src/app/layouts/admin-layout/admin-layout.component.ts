import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

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

  notifications: Notification[] = [];

  notificationRead !: number;



  constructor(
    private dataService: DataService,
    private router: Router,
    public pageTitleService: PageTitleService
  ) {
    this.title = this.pageTitleService.getTitle();
  }
  ngOnInit(): void {
    this.pageTitleService.titleChange.subscribe(title => {
      this.title = title;
    });
    this.UserInfo();
    //this.openNotifications();
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
    document.body.classList.toggle('dark-theme', this.theme === 'dark');
  }

  darkTheme(): void {
    this.pageTitleService.updateDarkMode();
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
    this.router.navigate(['/admin/profile']);
  }


  openNotifications(): void {
    this.isDrawerVisible = true;
    this.dataService.getNotifications().subscribe(
      (data: any) => {
        if (data && data.notification && Array.isArray(data.notification)) {
          this.notifications = data.notification;
          //stocker le nombre de notification non lu dans la variable notificationRead
          this.notificationRead = this.notifications.filter(notification => notification.read_at === null).length;
          console.log('Nombre de notifications non lues :', this.notificationRead);
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

  showNotification(notification: Notification): void {
    this.dataService.getNotification(notification.id, notification).subscribe(
      (data) => {
        console.log('Notification marquée comme lue:', data);
        // Mettre à jour le compteur de notifications non lues
        this.openNotifications();
      },
      (error) => {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    );
  }
}

