import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent {

  transports: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.dataService.getTransports().subscribe(
      (data) => {
        this.transports = data.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate([`/transport/${id}`]);
  }

  editTransport(id: number): void {
    this.router.navigate([`/transport/edit/${id}`]);
  }

  addTransport(): void {
    this.router.navigate([`/new/transport`]);
  }

  deleteTransport(id: number): void {
    this.dataService.deleteTransport(id, this.transports).subscribe(
      (response) => {
        this.loadTransports();
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }
}
