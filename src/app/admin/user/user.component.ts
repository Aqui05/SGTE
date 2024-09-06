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
  created_at: Date;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: UserData[] = [];
  searchTerm: string = '';
  reservationCountsByMonth: number[] = Array(12).fill(0); // 12 mois initialisés à 0
  merchandiseCountsByMonth: number[] = Array(12).fill(0);
  userCountsByMonth: number[] = Array(12).fill(0);
  chart: Chart | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(
      (data) => {
        this.users = data.data;
        this.countUsersByMonth();
        this.createChart(); // Créer le graphique après avoir récupéré les utilisateurs
      },
      (error) => {
        console.log(error);
      }
    );

    this.dataService.getMerchandisesList().subscribe(
      (data) => {
        this.countMerchandisesByMonth(data.data);
      },
      (error) => {
        console.error(error);
      }
    );

    this.dataService.getReservationsList().subscribe(
      (data) => {
        this.countReservationsByMonth(data.data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Compter les utilisateurs par mois
  countUsersByMonth(): void {
    this.users.forEach((user) => {
      const month = new Date(user.created_at).getMonth(); // Obtenir le mois de création
      this.userCountsByMonth[month]++;
    });
  }

  // Compter les marchandises par mois
  countMerchandisesByMonth(merchandises: any[]): void {
    merchandises.forEach((merchandise) => {
      const month = new Date(merchandise.created_at).getMonth();
      this.merchandiseCountsByMonth[month]++;
    });
  }

  // Compter les réservations par mois
  countReservationsByMonth(reservations: any[]): void {
    reservations.forEach((reservation) => {
      const month = new Date(reservation.created_at).getMonth();
      this.reservationCountsByMonth[month]++;
    });
  }

  // Fonctions de tri
  sortFnName: NzTableSortFn<UserData> = (a, b) => a.name.localeCompare(b.name);
  sortFnReservations_count: NzTableSortFn<UserData> = (a, b) =>
    a.reservations_count - b.reservations_count;
  sortFnMerchandises_count: NzTableSortFn<UserData> = (a, b) =>
    a.merchandises_count - b.merchandises_count;

  // Créer un graphique à barres
  createChart(): void {
    const ctx = (
      document.getElementById('myChart') as HTMLCanvasElement
    ).getContext('2d');
    if (!ctx) return;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: "Nombre d'utilisateurs",
            data: this.userCountsByMonth,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Nombre de réservations',
            data: this.reservationCountsByMonth,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Nombre de marchandises',
            data: this.merchandiseCountsByMonth,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
