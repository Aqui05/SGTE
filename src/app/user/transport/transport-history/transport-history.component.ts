import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-history',
  templateUrl: './transport-history.component.html',
  styleUrls: ['./transport-history.component.css']
})
export class TransportHistoryComponent implements OnInit {

  Transport: any[] = [];
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
        return 'default';
    }
  }


  viewDetails(id: number): void {
    this.router.navigate([`user/transport/details/${id}`]);
  }


}
