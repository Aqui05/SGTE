import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentMerchandiseComponent } from 'src/app/pages/payment-merchandise/payment-merchandise.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-details',
  templateUrl: './merchandise-details.component.html',
  styleUrls: ['./merchandise-details.component.css']
})
export class MerchandiseDetailsComponent implements OnInit{
  Merchandise :any = {};
  merchandiseId !: number;

  constructor (
    private dataService: DataService,
    private route: ActivatedRoute,
    private modal: NzModalService
  )
  {}

  ngOnInit(): void {
    this.merchandiseId= this.route.snapshot.params['id'];
    this.loadMerchandiseData();
  }

  loadMerchandiseData():void {
    this.dataService.getMerchandise(this.merchandiseId).subscribe(
      (response) =>  {
        this.Merchandise = response.data;
      },
      (error) =>  {
        console.error('error loading merchandises :', error)
      }

    )
  }

  proceedToPayment(): void {
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

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmé':
        return 'success';
      case 'planification':
        return 'processing';
      case 'en transit':
        return 'default';
      case 'delivré':
        return 'default';
      case 'annulé':
        return 'error';
      default:
        return 'default';
    }
  }

}
