import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableSortFn } from 'ng-zorro-antd/table';
import { Chart } from 'chart.js/auto';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: number;
  address: string;
  city: string;
  state: string;
  country: boolean;
  zip: boolean;
  avatar: boolean;
  merchandises_count: number;
  reservations_count: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: UserData[] = [];
  searchTerm: string = '';
  reservationCount: number = 0;
  merchandiseCount: number = 0;
  chart: Chart | undefined;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(
      (data) => {
        this.users = data.data;
        this.createChart(); // Créer le graphique après avoir récupéré les utilisateurs
      },
      (error) => {
        console.log(error);
      }
    );

    this.dataService.getMerchandisesList().subscribe(
      (data) => {
        //compter les marchandises par le mois dans merchandise.created_at
        this.merchandiseCount = data.data.count();
      },
      (error) => {
        console.error(error);
      }
    );

    this.dataService.getReservationsList().subscribe(
      (data) => {},
      (error) => {
        console.error(error);
      }
    );
  }

  // Fonctions de tri
  sortFnName: NzTableSortFn<UserData> = (a, b) => a.name.localeCompare(b.name);
  sortFnReservations_count: NzTableSortFn<UserData> = (a, b) => a.reservations_count - b.reservations_count;
  sortFnMerchandises_count: NzTableSortFn<UserData> = (a, b) => a.merchandises_count - b.merchandises_count;

  // Créer un graphique à barres
  createChart(): void {
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Dummy data - Remplacer par le nombre d'utilisateurs et de réservations réels par mois
    const userCounts = [5, 7, 3, 8, 10, 6, 12, 9, 4, 11, 13, 2]; // Exemples de données
    const reservationCounts = [2, 5, 7, 6, 9, 4, 10, 8, 3, 7, 11, 1];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Nombre d\'utilisateurs',
            data: userCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Nombre de réservations',
            data: reservationCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
