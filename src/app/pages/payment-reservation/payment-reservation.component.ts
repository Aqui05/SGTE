import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-payment-reservation',
  templateUrl: './payment-reservation.component.html',
  styleUrls: ['./payment-reservation.component.css']
})
export class PaymentReservationComponent implements OnInit {

  paymentForm!: FormGroup;
  paymentMethods = [
    { label: 'Carte de Crédit', value: 'creditCard' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Numéro de téléphone', value: 'phone' },
  ];

  reservationId!: number;

  user: any = {};

  price = 0.00;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.reservationId = this.modal.getConfig().nzData.reservationId;
    this.loadReservation();
    this.loadUser();
    if (this.user && this.user.phone) {
      this.paymentForm.patchValue({
        phoneNumber: this.user.phone
      });
    }
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: ['creditCard', Validators.required],
      cardNumber: [''],
      cardExpiry: [''],
      cardCVC: [''],
      paypalEmail: [''],
      phoneNumber: [''] // Ajoutez cette ligne si elle n'existe pas déjà
    });
    this.onPaymentMethodChange();
  }

  onPaymentMethodChange(): void {
    const paymentMethod = this.paymentForm.get('paymentMethod')?.value;
    this.paymentForm.get('cardNumber')?.clearValidators();
    this.paymentForm.get('cardExpiry')?.clearValidators();
    this.paymentForm.get('cardCVC')?.clearValidators();
    this.paymentForm.get('paypalEmail')?.clearValidators();
    this.paymentForm.get('phoneNumber')?.clearValidators();

    switch (paymentMethod) {
      case 'creditCard':
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required]);
        this.paymentForm.get('cardExpiry')?.setValidators([Validators.required]);
        this.paymentForm.get('cardCVC')?.setValidators([Validators.required]);
        break;
      case 'paypal':
        this.paymentForm.get('paypalEmail')?.setValidators([Validators.required, Validators.email]);
        break;
      case 'phone':
        this.paymentForm.get('phoneNumber')?.setValidators([Validators.required]);
        break;
    }

    this.paymentForm.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        method: this.paymentForm.get('paymentMethod')?.value,
        ...this.paymentForm.value
      };

      this.dataService.makeReservationPayment(this.reservationId, paymentData).subscribe(
        (response: any) => {
          this.msg.success('Paiement effectué avec succès');
          console.log('Paiement:', response.data);
          this.modal.close(true);
          this.router.navigate([`/user/reservation/details/${this.reservationId}`]);
        },
        (error: any) => {
          this.msg.error('Erreur lors du paiement');
          console.error('Erreur lors du paiement:', error);
        }
      );
    }
  }

  loadReservation(): void {
    this.dataService.getReservation(this.reservationId).subscribe(
      (data) => {
        console.log('Expedition:', data.data);
        this.price = data.data.total_price;
        console.log(this.price);
      },
      (error) => {
        console.error('Erreur de création de l\'expédition:', error);
      }
    );
  }

  loadUser(): void {
    this.dataService.getUserInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Erreur de la récupération du profil:', error);
      }
    );
  }
}
