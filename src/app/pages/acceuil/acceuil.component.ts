import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js/auto';

Chart.register(...registerables);


@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit{
  Reservation : any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoReservation();
  }




  cards = [
    {
      title: "Today's Money",
      value: "$53k",
      change: "+55%",
      changeType: "success",
      comparison: "last week",
      icon: "attach_money", // Updated icon
      color: "dark"
    },
    {
      title: "Users",
      value: "23",
      change: "+3%",
      changeType: "success",
      comparison: "last month",
      icon: "person", // Updated icon
      color: "primary"
    },
    {
      title: "Transports",
      value: "3,462",
      change: "-2%",
      changeType: "danger",
      comparison: "yesterday",
      icon: "local_shipping", // Updated icon
      color: "success"
    },
    {
      title: "Expeditions",
      value: "430",
      change: "+5%",
      changeType: "success",
      comparison: "yesterday",
      icon: "flight_takeoff", // Updated icon
      color: "info"
    }
  ];


  InfoReservation(): void {
    this.dataService.getReservations().subscribe(
      (response) => {
        this.Reservation = response.data;
        console.log('Reservations:', response.data);
        this.createReservationChart();
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }



  countReservationStatus(): { [key: string]: number } {
    const statusCounts: { [key: string]: number } = {
      confirmed: 0,
      inProgress: 0,
      finished: 0,
      canceled: 0
    };

    this.Reservation.forEach(reservation => {
      if (reservation.status in statusCounts) {
        statusCounts[reservation.status]++;
      }
    });

    return statusCounts;
  }

  createReservationChart(): void {
    const statusCounts = this.countReservationStatus();

    const data = {
      labels: ['Confirmed', 'Used', 'Delayed', 'Canceled'],
      datasets: [{
        label: 'Transport',
        data: [
          statusCounts['confirmed'],
          statusCounts['Used'],
          statusCounts['Delayed'],
          statusCounts['canceled']
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336']
      }]
    };

    const config = {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    new Chart('ReservationStatusChart', config);
  }





}
