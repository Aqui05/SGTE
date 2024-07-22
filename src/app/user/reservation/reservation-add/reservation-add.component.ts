import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentModalComponent } from 'src/app/pages/payment-modal/payment-modal.component';
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

  isPaymentModalVisible = false;
  reservationId!: number;


  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService
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


  onSubmit() {
    if (this.reservationForm.valid) {
      this.saveReservation();
    }
  }
  saveReservation(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.getRawValue();
      const transportId = this.selectedTransportId ? this.selectedTransportId : reservationData.transport_id;

      if (transportId) {
        this.dataService.addReservation(transportId, reservationData).subscribe(
          response => {
            console.log('Reservation created successfully:', response);
            console.log('Reservation ID:', response.data.id);
            this.reservationId = response.data.id;
            //this.router.navigate(['/user/reservation/list']);
            this.showModal();
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

  showModal(): void {
    console.log(this.reservationId);
    this.modal.create({
      nzTitle: 'Formulaire de payement',
      nzContent: PaymentModalComponent,
      nzData: {
        reservationId: this.reservationId,
      },
      nzFooter: null
    });
  }

}
