import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit{


  Reservation : any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoReservation();
  }


  InfoReservation(): void {
    this.dataService.getReservations().subscribe(
      (response) => {
        this.Reservation = response.data;
        console.log('Reservations:', response.data);
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }


  viewDetails(id: number): void {
    this.router.navigate([`/user/reservation/details/${id}`]);
  }


  editReservation(id: number): void {
    this.router.navigate([`/user/reservation/edit/${id}`]);
  }


  deleteReservation(id: number): void {
    this.dataService.deleteReservation(id, this.Reservation).subscribe(
      (response) => {
        this.InfoReservation();
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'used':
        return 'processing';
      case 'delayed':
        return 'yellow';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }


}
