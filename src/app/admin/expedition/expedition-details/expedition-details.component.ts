import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-details',
  templateUrl: './expedition-details.component.html',
  styleUrls: ['./expedition-details.component.css']
})
export class ExpeditionDetailsComponent implements OnInit{
  expedition!: {};
  expeditionId !: number;
  merchandises: any[] = [];


  constructor (
    private dataService: DataService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.expeditionId = this.route.snapshot.params['id']
    this.loadExpeditionData();
  }

  loadExpeditionData(): void {
    this.dataService.getExpedition(this.expeditionId).subscribe(
      (response) => {
        this.expedition= response.data;
      },

      (error) => {
        console.error (error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    )
  }

  merchandisesList() : void {
    this.dataService.ReservationTransport(this.expeditionId).subscribe(
      (response: any)  => {
        this.merchandises = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des marchandises:', error);
      }
    )
  }

}
