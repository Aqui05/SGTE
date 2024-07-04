import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.css']
})

export class ReservationAddComponent implements OnInit {
  reservationForm: FormGroup;
  transports: any[] = [];
  selectedTransportId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservationForm = this.fb.group({
      transport_id: [''],
      number_of_seats: ['', Validators.required],
      total_price: ['', Validators.required],
      status: ['', Validators.required],
      destination_waypoint: ['', Validators.required],
      additional_info: [''],
      departure_waypoint: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedTransportId = params['transportId'] ? +params['transportId'] : null;
      this.loadTransports();
    });
  }


  loadTransports(): void {
    this.dataService.getTransports().subscribe(
      (data) => {
        this.transports = data.data;
        if (this.selectedTransportId) {
          this.reservationForm.patchValue({ transport_id: this.selectedTransportId });
        }
        console.log(this.selectedTransportId);
        console.log(this.transports)
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      const transportId = this.selectedTransportId ? this.selectedTransportId : reservationData.transport_id;

      if (transportId) {
        this.dataService.addReservation(transportId, reservationData).subscribe(
          response => {
            console.log('Reservation created successfully:', response);
            this.router.navigate(['/reservations']);
          },
          error => {
            console.error('Error creating reservation:', error);
          }
        );
      } else {
        console.error('No transport ID provided');
      }
    }
  }
}
