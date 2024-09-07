import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NzTableSortFn } from 'ng-zorro-antd/table';
import { Chart } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

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
  merchandises: any[] = [];
  reservations: any[] = [];
  searchTerm: string = '';
  reservationCountsByMonth: number[] = Array(12).fill(0);
  merchandiseCountsByMonth: number[] = Array(12).fill(0);
  userCountsByMonth: number[] = Array(12).fill(0);
  chart: Chart | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    forkJoin({
      users: this.dataService.getUsers(),
      merchandises: this.dataService.getMerchandisesList(),
      reservations: this.dataService.getReservationsList(),
    }).subscribe(
      ({ users, merchandises, reservations }) => {
        this.users = users.data;
        this.reservations = reservations.data;
        this.merchandises = merchandises.data;
        console.log(this.merchandises);
        this.countUsersByMonth();
        this.countMerchandisesByMonth();
        this.countReservationsByMonth();
        this.createChart();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  countUsersByMonth(): void {
    this.users.forEach((user) => {
      const month = new Date(user.created_at).getMonth();
      this.userCountsByMonth[month]++;
    });
  }

  countMerchandisesByMonth(): void {
    this.merchandises.forEach((merchandise) => {
      const month = new Date(merchandise.created_at).getMonth();
      this.merchandiseCountsByMonth[month]++;
    });
  }

  countReservationsByMonth(): void {
    this.reservations.forEach((reservation) => {
      const month = new Date(reservation.created_at).getMonth();
      this.reservationCountsByMonth[month]++;
    });
  }

  sortFnName: NzTableSortFn<UserData> = (a, b) => a.name.localeCompare(b.name);
  sortFnReservations_count: NzTableSortFn<UserData> = (a, b) =>
    a.reservations_count - b.reservations_count;
  sortFnMerchandises_count: NzTableSortFn<UserData> = (a, b) =>
    a.merchandises_count - b.merchandises_count;

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Cannot find chart canvas element');
      return;
    }

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
            backgroundColor: '#2196f3',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Nombre de réservations',
            data: this.reservationCountsByMonth,
            backgroundColor: '#f44336',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Nombre de marchandises',
            data: this.merchandiseCountsByMonth,
            backgroundColor: '#ff9800',
            borderColor: '#ff6000',
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
