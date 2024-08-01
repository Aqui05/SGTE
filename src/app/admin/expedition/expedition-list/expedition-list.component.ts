import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-list',
  templateUrl: './expedition-list.component.html',
  styleUrls: ['./expedition-list.component.css']
})
export class ExpeditionListComponent {


  expeditions: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadExpeditions();
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
    return this.expeditions.filter(m => m.status !== 'delivré' && m.status !== 'annulé');
  }



  loadExpeditions(): void {
    this.dataService.getExpeditionsList().subscribe(
      (data) => {
        this.expeditions = data.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des expeditions:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/expedition/details/${id}`]);
  }

  // shipped(id: number): void {
  //   this.router.navigate([`admin/expeditions/details/${id}`]);
  // }

  edit(id: number): void {
    this.router.navigate([`admin/expedition/edit/${id}`]);
  }


  cancel(id: number): void {
    this.dataService.deleteExpedition(id,this.expeditions).subscribe(
      (response) => {
        this.loadExpeditions();
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }

}
