import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {

  paymentForm!: FormGroup;
  paymentMethods = [
    { label: 'Carte de Crédit', value: 'creditCard' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Numéro de téléphone', value: 'phone' },
  ];

  reservationId!: number;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dataService: DataService,
    private router: Router
  ) {
    console.log(this.reservationId)
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      // Ajoutez d'autres contrôles pour les détails de paiement ici
    });
  }

  ngOnInit(): void {
    this.paymentForm.get('paymentMethod')?.setValue(this.paymentMethods[0].value);

    this.reservationId = this.modal.getConfig().nzData.reservationId;
    console.log('Reservation ID:', this.reservationId);
  }

  onPaymentMethodChange(event: Event): void {
    const paymentMethod = (event.target as HTMLSelectElement).value;
    this.paymentForm.get('cardNumber')?.disable();
    this.paymentForm.get('cardExpiry')?.disable();
    this.paymentForm.get('cardCVC')?.disable();
    this.paymentForm.get('paypalEmail')?.disable();
    this.paymentForm.get('phoneNumber')?.disable();
    if (paymentMethod === 'creditCard') {
      this.paymentForm.get('cardNumber')?.enable();
      this.paymentForm.get('cardExpiry')?.enable();
      this.paymentForm.get('cardCVC')?.enable();
    } else if (paymentMethod === 'paypal') {
      this.paymentForm.get('paypalEmail')?.enable();
    } else if (paymentMethod === 'phone') {
      this.paymentForm.get('phoneNumber')?.enable();
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.dataService.makeReservationPayment(this.reservationId, this.paymentForm.value).subscribe(
        (response: any) => {
          this.msg.success('Paiement effectué avec succès');
          this.router.navigate(['/reservations']);
        },
        (error: any) => {
          this.msg.error('Erreur lors du paiement');
          console.error('Erreur lors du paiement:', error);
        }
      );
    }
  }




}
