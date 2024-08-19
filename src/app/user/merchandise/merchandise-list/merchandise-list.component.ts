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
  Merchandise: MerchandiseData[] = [];
  searchTerm: string = '';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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
    );
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmé': return 'success';
      case 'planification': return 'yellow';
      case 'en transit': return 'processing';
      case 'delivré': return 'purple';
      case 'annulé': return 'error';
      default: return 'default';
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
      );
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
