import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';


interface MerchandiseData {
  id: number;
  name: string;
  volume: number;
  weight: number;
  quantity: number;
  depart: string;
  destination: string;
  status: string;
  paid: boolean;
}

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.css']
})
export class MerchandiseListComponent implements OnInit {

  merchandises: MerchandiseData[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadMerchandises();
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

  getFilteredMerchandises() {
    return this.merchandises
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

  loadMerchandises(): void {
    this.dataService.getMerchandisesList().subscribe(
      (data) => {
        this.merchandises = data.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des marchandises:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/merchandise/details/${id}`]);
  }

  shipped(id: number, origin: string, destination: string): void {
    this.router.navigate(['admin/expedition/create'], {
      queryParams: { origin: origin, destination: destination }
    });
  }


  cancel(id: number): void {
    this.dataService.cancelMerchandise(id, this.merchandises).subscribe(
      (response) => {
        this.loadMerchandises();
      },
      (error) => {
        console.error('Erreur lors de l\'annulation de la marchandise:', error);
      }
    );
  }


  // Fonctions de tri
  sortFnName: NzTableSortFn<MerchandiseData> = (a, b) => a.name.localeCompare(b.name);
  sortFnVolume: NzTableSortFn<MerchandiseData> = (a, b) => a.volume - b.volume;
  sortFnWeight: NzTableSortFn<MerchandiseData> = (a, b) => a.weight - b.weight;
  sortFnQuantity: NzTableSortFn<MerchandiseData> = (a, b) => a.quantity - b.quantity;

  // Fonction de filtrage
  filterFnStatus: NzTableFilterFn<MerchandiseData> = (list: string[], item: MerchandiseData) => list.includes(item.status);
  filterFnPaid: NzTableFilterFn<MerchandiseData> =(list: boolean[], item:MerchandiseData) => list.includes(item.paid);

  listOfStatusFilter: NzTableFilterList = [
    { text: 'Confirmé', value: 'confirmé' },
    { text: 'Planification', value: 'planification' },
    { text: 'En transit', value: 'en transit' },
    { text: 'Délivré', value: 'délivré' },
    { text: 'Annulé', value: 'annulé' },
  ];

  listOfPaid : NzTableFilterList= [
    { text: 'Payé', value:1},
    { text: 'Non payé', value:0}
  ];
}
