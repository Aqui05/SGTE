import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css']
})
export class ReservationEditComponent implements OnInit {

  reservationId!: number;
  reservation: any = {}; // Ensure reservation is an object
  selectedTransportId!: number;
  selectedTransport: any | null = null;

  reservationForm!: FormGroup;

  transports: any[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {
    this.reservationForm = this.fb.group({
      transport_id: [''],
      destination_waypoint: ['', Validators.required],
      additional_info: [''],
      departure_waypoint: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.params['id'];
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.dataService.getReservation(this.reservationId).subscribe(
      (response) => {
        this.reservation = response.data;
        this.selectedTransportId = response.data.transport_id;
        this.loadTransports();
      },
      (error) => {
        console.error(error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    );
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.getRawValue();
      const transportId = this.selectedTransportId ? this.selectedTransportId : reservationData.transport_id;

      if (transportId) {
        this.dataService.updateReservation(transportId, reservationData).subscribe(
          response => {
            console.log('Reservation updated successfully:', response);
            this.router.navigate(['/user/reservation']);
          },
          error => {
            console.error('Error updating reservation:', error);
          }
        );
      } else {
        console.error('No transport ID provided');
      }
    }
  }

  loadTransports(): void {
    this.dataService.getTransports().subscribe(
      (data) => {
        this.transports = data.data;
        if (this.selectedTransportId) {
          this.selectedTransport = this.transports.find(t => t.id === this.selectedTransportId);
          this.reservationForm.patchValue({
            transport_id: this.selectedTransportId,
            departure_waypoint: this.selectedTransport.departure_location,
            destination_waypoint: this.selectedTransport.destination_location
          });
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  onTransportChange(event: Event): void {
    const selectedTransportId = (event.target as HTMLSelectElement).value;
    this.selectedTransport = this.transports.find(t => t.id === +selectedTransportId);
    if (this.selectedTransport) {
      this.reservationForm.patchValue({
        departure_waypoint: this.selectedTransport.departure_location,
        destination_waypoint: this.selectedTransport.destination_location
      });
    }
  }

}
