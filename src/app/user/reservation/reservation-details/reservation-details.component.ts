import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';
import { PaymentModalComponent } from 'src/app/pages/payment-modal/payment-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: any = {}; // Ensure reservation is an object with properties
  reservationId!: number;
  isPaymentModalVisible = false;


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.params['id'];
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.dataService.getReservation(this.reservationId).subscribe(
      (response) => {
        this.reservation = response.data;
      },
      (error) => {
        console.error(error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    );
  }

  downloadTicket(): void {
    if (this.reservation.paid) {
      this.dataService.getTicket(this.reservationId, { responseType: 'blob' }).subscribe(
        (response: Blob) => {
          const file = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `Ticket_${this.reservationId}.pdf`;  // Sets a name for the downloaded file
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        (error) => {
          console.error(error);
          this.msg.error('Erreur lors de la récupération du ticket');
        }
      );
    } else {
      this.msg.warning('You must proceed with the payment first');
    }
  }
  


  proceedToPayment(): void {
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
