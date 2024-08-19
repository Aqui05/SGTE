import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentMerchandiseComponent } from 'src/app/pages/payment-merchandise/payment-merchandise.component';

@Component({
  selector: 'app-merchandise-add',
  templateUrl: './merchandise-add.component.html',
  styleUrls: ['./merchandise-add.component.css']
})
export class MerchandiseAddComponent implements OnInit {
  merchandiseForm: FormGroup;
  merchandises: any[] = [];
  merchandiseId!: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService
  ) {
    this.merchandiseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [''],
      quantity: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      volume: [0, [Validators.required, Validators.min(0)]],
      numero_suivi: ['', Validators.required],
      depart: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }


  ngOnInit(): void {

  }


  generateTrackingNumber(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  setTrackingNumber(): void {
    const trackingNumber = this.generateTrackingNumber();
    this.merchandiseForm.patchValue({ numero_suivi: trackingNumber });
  }



  onSubmit(): void {
    if (this.merchandiseForm.valid) {
      const merchandiseData = this.merchandiseForm.value;
        this.dataService.addMerchandise(merchandiseData).subscribe(
          response => {
            console.log('Merchandise has been added successfully:', response);
            this.merchandiseId = response.data.id;
            console.log(this.merchandiseId)
            this.router.navigate(['/user/merchandise/list']);
            this.showModal();
          },
          error => {
            console.error('Error adding merchandise:', error);
          }
        );
    }
  }

  showModal(): void {
    console.log(this.merchandiseId);
    this.modal.create({
      nzTitle: 'Formulaire de payement',
      nzContent: PaymentMerchandiseComponent,
      nzData: {
        merchandiseId: this.merchandiseId,
      },
      nzFooter: null
    });
  }
}
