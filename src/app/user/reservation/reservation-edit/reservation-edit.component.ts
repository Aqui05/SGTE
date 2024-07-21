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

  reservationId !:number;
  reservation !:{};
  selectedTransportId: number | null = null;
  selectedTransport: any | null = null;

  reservationForm !:FormGroup;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {
      this.reservationForm = this.fb.group ({
        transport_id: [''],
        number_of_seats: ['', [Validators.required, Validators.min(0)]],
        total_price: [{ value: '', disabled: true }, Validators.required],
        status: ['', Validators.required],
        destination_waypoint: ['', Validators.required],
        additional_info: [''],
        departure_waypoint: ['', Validators.required]
      })
  }

  ngOnInit(): void {
    this.reservationId= this.route.snapshot.params['id'];
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.dataService.getReservation(this.reservationId).subscribe(
      (response) => {
        this.reservation = response.data;
      },

      (error) => {
        console.error (error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    )
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

}
