import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-history',
  templateUrl: './expedition-history.component.html',
  styleUrls: ['./expedition-history.component.css']
})
export class ExpeditionHistoryComponent {

  Expedition : any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoExpedition();
  }


  InfoExpedition(): void {
    this.dataService.getUserExpeditions().subscribe(
      (response) => {
        this.Expedition = response.data;
        console.log('Expedition:', response.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des expéditions:', error);
      }
    );
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

  getFilteredExpeditions() {
    return this.Expedition.filter(m => m.status !== 'delivré' && m.status !== 'annulé');
  }


  viewDetails(id: number): void {
    this.router.navigate([`${id}`]);
  }

}
