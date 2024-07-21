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

}
