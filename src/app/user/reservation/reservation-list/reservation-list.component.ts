import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

interface ReservationData {
  id: number;
  transport_id: number;
  reservation_datetime: string;
  departure_waypoint: string;
  destination_waypoint: string;
  status: string;
  paid: boolean;
}

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  Reservation: ReservationData[] = [];
  searchTerm: string = '';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.InfoReservation();
  }

  InfoReservation(): void {
    this.dataService.getReservations().subscribe(
      (response) => {
        this.Reservation = response.data;
        console.log('Reservations:', response.data);
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
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
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    );
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'used': return 'processing';
      case 'delayed': return 'yellow';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }

  addReservation(): void {
    this.router.navigate([`/user/reservation/add`]);
  }

  // Fonctions de tri
  sortFnTransportId: NzTableSortFn<ReservationData> = (a, b) => a.transport_id - b.transport_id;
  sortFnReservationDate: NzTableSortFn<ReservationData> = (a, b) => a.reservation_datetime.localeCompare(b.reservation_datetime);

  // Fonctions de filtrage
  filterFnStatus: NzTableFilterFn<ReservationData> = (list: string[], item: ReservationData) => list.includes(item.status);
  filterFnPaid: NzTableFilterFn<ReservationData> = (list: boolean[], item: ReservationData) => list.includes(item.paid);

  // Listes de filtres
  listOfStatusFilter: NzTableFilterList = [
    { text: 'Confirmé', value: 'confirmed' },
    { text: 'Utilisé', value: 'used' },
    { text: 'Retardé', value: 'delayed' },
    { text: 'Annulé', value: 'cancelled' }
  ];

  listOfPaidFilter: NzTableFilterList = [
    { text: 'Payé', value: 1 },
    { text: 'Non payé', value: 0 }
  ];

  getFilteredReservations() {
    return this.Reservation.filter(reservation =>
      reservation.transport_id.toString().includes(this.searchTerm) ||
      reservation.departure_waypoint.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      reservation.destination_waypoint.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      reservation.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
