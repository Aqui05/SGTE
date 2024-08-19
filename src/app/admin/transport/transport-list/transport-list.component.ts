import { Component } from '@angular/core';
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
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent {

  transports: TransportData[] = [];
  filteredTransports: any[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadTransports();
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'in Progress':
        return 'processing';
      case 'finished':
        return 'magenta';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }

  loadTransports(): void {
    this.dataService.getTransports().subscribe(
      (data) => {
        this.transports = this.sortTransports(data.data);
        this.filteredTransports = this.transports; // Initial filtering with all data
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  private sortTransports(transports: any[]): any[] {
    const statusOrder = ['confirmed', 'planification', 'in Progress', 'finished', 'cancelled'];
    return transports.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  }

  searchTransports(): void {
    if (this.searchTerm) {
      this.filteredTransports = this.transports.filter(transport =>
        transport.numero_transport.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transport.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transport.departure_location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transport.destination_location.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTransports = this.transports; // Show all if no search term
    }
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/transport/details/${id}`]);
  }

  editTransport(id: number): void {
    this.router.navigate([`admin/transport/edit/${id}`]);
  }

  addTransport(): void {
    this.router.navigate([`/admin/transport/create`]);
  }

  deleteTransport(id: number): void {
    this.dataService.deleteTransport(id, this.transports).subscribe(
      (response) => {
        this.loadTransports();
      },
      (error) => {
        console.error('Erreur lors de la suppression du transport:', error);
      }
    );
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
