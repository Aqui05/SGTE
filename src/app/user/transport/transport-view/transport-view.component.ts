import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-view',
  templateUrl: './transport-view.component.html',
  styleUrls: ['./transport-view.component.css']
})
export class TransportViewComponent implements OnInit {
  listTransports: any[] = [];
  filteredTransports: any[] = [];
  searchQuery: string = '';
  transports: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.dataService.getTransports().subscribe(
      (response) => {
        this.listTransports = response.data;

        this.transports = this.listTransports.filter(transport => transport.status === 'confirmed');
        this.filteredTransports = this.transports;
        //this.filteredTransports = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  filterTransports(): void {
    if (!this.searchQuery) {
      this.filteredTransports = this.transports;
    } else {
      this.filteredTransports = this.transports.filter(transport =>
        transport.numero_transport.includes(this.searchQuery) ||
        transport.type.includes(this.searchQuery) ||
        transport.departure_location.includes(this.searchQuery) ||
        transport.destination_location.includes(this.searchQuery)
      );
    }
  }
}
