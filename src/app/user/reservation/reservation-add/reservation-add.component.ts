import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  selectedTransport: any | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservationForm = this.fb.group({
      transport_id: [''],
      // number_of_seats: ['', [Validators.required, Validators.min(0)]],
      // total_price: [{ value: '', disabled: true }, Validators.required],
      // status: ['', Validators.required],
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

    // this.reservationForm.get('number_of_seats')?.valueChanges.subscribe(value => {
    //   this.calculateTotalPrice();
    // });
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
          this.updateSeatValidator();
          // this.calculateTotalPrice();
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
      this.updateSeatValidator();
      // this.calculateTotalPrice();
    }
  }

  updateSeatValidator(): void {
    const seatsControl = this.reservationForm.get('number_of_seats');
    if (this.selectedTransport && seatsControl) {
      seatsControl.setValidators([
        Validators.required,
        Validators.min(0),
        this.maxSeatsValidator(this.selectedTransport.seats)
      ]);
      seatsControl.updateValueAndValidity();
    }
  }

  maxSeatsValidator(maxSeats: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const seats = control.value;
      return seats > maxSeats ? { maxSeats: { value: seats, maxSeats: maxSeats } } : null;
    };
  }

  // calculateTotalPrice(): void {
  //   const numberOfSeats = this.reservationForm.get('number_of_seats')?.value;
  //   if (this.selectedTransport && numberOfSeats >= 0) {
  //     const totalPrice = numberOfSeats * this.selectedTransport.price;
  //     this.reservationForm.patchValue({ total_price: totalPrice });
  //   }
  // }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.getRawValue();
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
