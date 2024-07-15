import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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



  departureLocation = '';
  arrivalLocation = '';
  departureTime: Date | null = null;
  arrivalTime: Date | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadTransports();
    this.filterTransports();
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
    this.filteredTransports = this.transports.filter(transport =>
      (!this.departureLocation || transport.departure_location.toLowerCase().includes(this.departureLocation.toLowerCase())) &&
      (!this.arrivalLocation || transport.destination_location.toLowerCase().includes(this.arrivalLocation.toLowerCase())) &&
      (!this.departureTime || new Date(transport.departure_time).toLocaleString().includes(this.departureTime.toLocaleString())) &&
      (!this.arrivalTime || new Date(transport.arrival_time).toLocaleString().includes(this.arrivalTime.toLocaleString()))
    );
  }


  reservation(transport: any): void {
    this.router.navigate(['user/reservation/add'], { queryParams: { transportId: transport.id } });
  }

  seeMap(transport: any): void {
    this.router.navigate([`/user/map/${transport.id}`]);
  }


}
