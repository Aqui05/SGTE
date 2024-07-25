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
        this.transports = this.filterTransports(data.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des transports:', error);
      }
    );
  }

  private filterTransports(transports: any[]): any[] {
    return transports.filter(transport => transport.status !== 'cancelled');
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
}
