import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.css']
})
export class MerchandiseListComponent  implements OnInit{


  Transport: any[] = [];
  Reservation : any[] = [];
  Merchandise : any[] = [];
  Expedition : any[] = [];
  CompletedDelivery : any[] = [];

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
    return this.Merchandise.filter(m => m.status !== 'delivré' && m.status !== 'annulé');
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/merchandise/details/${id}`]);
  }

  shipped(id: number): void {
    this.router.navigate([`admin/merchandise/send/${id}`]);
  }



  cancel(id: number): void {
    /*this.dataService.deleteVehicle(id).subscribe(
      (response) => {
        this.loadMerchandises();
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );*/
  }

}
