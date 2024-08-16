import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.css']
})
export class MerchandiseListComponent  implements OnInit{


  // Transport: any[] = [];
  // Reservation : any[] = [];
  Merchandise : any[] = [];
  // Expedition : any[] = [];
  // CompletedDelivery : any[] = [];

  searchTerm: string = '';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoMerchandise();
  }



  InfoMerchandise(): void {
    this.dataService.getMerchandises().subscribe(
      (response) => {
        this.Merchandise = response.data;
        console.log('Merchandise:', response.data);
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
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

  getFilteredMerchandises() {
    return this.Merchandise
      .filter(m =>
        m.status !== 'delivré' &&
        m.status !== 'annulé' &&
        (m.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.depart.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.destination.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      .sort((a, b) => this.getStatusPriority(a.status) - this.getStatusPriority(b.status));
  }

  getStatusPriority(status: string): number {
    switch (status) {
      case 'confirmé':
        return 1;
      case 'planification':
        return 2;
      case 'en transit':
        return 3;
      case 'delivré':
        return 4;
      case 'annulé':
        return 5;
      default:
        return 6;
    }
  }

  viewDetails(id: number): void {
    this.router.navigate([`user/merchandise/details/${id}`]);
  }

  modify(id: number): void {
    this.router.navigate([`user/merchandise/edit/${id}`]);
  }



  cancel(id: number): void {
    this.dataService.deleteMerchandise(id).subscribe(
      (response) => {
        this.InfoMerchandise();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la marchandise:', error);
      }
    );
  }

  addMerchandise(): void {
    this.router.navigate([`/user/merchandise/add`]);
  }

}
