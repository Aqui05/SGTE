import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-details',
  templateUrl: './expedition-details.component.html',
  styleUrls: ['./expedition-details.component.css']
})
export class ExpeditionDetailsComponent implements OnInit {
  expedition: any = {};
  expeditionId!: number;
  merchandises: any[] = [];
  showMerchandises = false;

  constructor (
    private dataService: DataService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.expeditionId = this.route.snapshot.params['id'];
    this.loadExpeditionData();
    this.merchandisesList();
  }

  loadExpeditionData(): void {
    this.dataService.getExpedition(this.expeditionId).subscribe(
      (response) => {
        this.expedition = response.data;
      },
      (error) => {
        console.error(error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    );
  }

  merchandisesList(): void {
    this.dataService.getMerchandisesExpeditions(this.expeditionId).subscribe(
      (response: any) => {
        this.merchandises = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des marchandises:', error);
      }
    );
  }

  toggleMerchandises(): void { 
    this.showMerchandises = !this.showMerchandises; 
    if (this.showMerchandises && this.merchandises.length === 0) { 
      this.merchandisesList(); 
    } 
  } 
  getStatusType(status: string): string {
    switch (status) {
      case 'confirmé':
        return 'success';
      case 'planification':
        return 'yellow';
      case 'en transit':
        return 'processing';
      case 'delivré':
        return 'purple';
      case 'annulé':
        return 'error';
      default:
        return 'default';
    }
  }
}
