import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';



interface TransportData {
  id: number;
  vehicle_id: number;
  route_id: number;
  numero_transport: string;
  type: string;
  destination_location: string;
  departure_location: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats: number;
  status: string;
}


@Component({
  selector: 'app-transport-history',
  templateUrl: './transport-history.component.html',
  styleUrls: ['./transport-history.component.css']
})
export class TransportHistoryComponent implements OnInit {

  Transport: TransportData[] = [];
  Reservation : any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoTransport();
  }

  InfoTransport(): void {
    this.dataService.getUserTransports().subscribe(
      (data) => {
        this.Transport = data.data;
        console.log('Transport:', data.data);
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    );
  }


  getStatusType(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'in Progress':
        return 'processing';
      case 'finished':
        return 'yellow';
      case 'cancelled':
        return 'error';
      default:
        return 'default'
    }
  }


  viewDetails(id: number): void {
    this.router.navigate([`user/transport/details/${id}`]);
  }



  // Fonctions de tri
  sortFnNumber: NzTableSortFn<TransportData> = (a, b) => a.numero_transport.localeCompare(b.numero_transport);
  sortFnPrice: NzTableSortFn<TransportData> = (a, b) => a.price - b.price;
  sortFnDateD: NzTableSortFn<TransportData> = (a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
  sortFnDateF: NzTableSortFn<TransportData> = (a, b) => new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime();

  // Fonctions de filtrage
  filterFnStatus: NzTableFilterFn<TransportData> = (list: string[], item: TransportData) => list.some(status => item.status.indexOf(status) !== -1);
  filterFnType: NzTableFilterFn<TransportData> = (list: string[], item: TransportData) => list.some(type => item.type.indexOf(type) !== -1);

  // Listes de filtres
  listOfStatusFilter: NzTableFilterList = [
    { text: 'Confirmé', value: 'confirmed' },
    { text: 'En cours', value: 'in Progress' },
    { text: 'Terminé', value: 'finished' },
    { text: 'Annulé', value: 'cancelled' },
  ];

  listOfTypeFilter: NzTableFilterList = [
    { text: 'Maritime', value: 'maritime' },
    { text: 'Routier', value: 'routier' },
    { text: 'Aérien', value: 'aérien' },
    { text: 'Ferroviaire', value: 'ferroviaire' },
  ];}
