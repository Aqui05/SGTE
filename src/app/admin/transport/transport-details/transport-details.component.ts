import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.css']
})
export class TransportDetailsComponent implements OnInit {

  TransportId !:number;
  Transport:any = {};
  Reservation:any = {};

  constructor (
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.TransportId = Number(this.route.snapshot.paramMap.get('id')!);

    this.dataService.getTransport(this.TransportId).subscribe(
      (response: any) => {
        this.Transport = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération du transport:', error);
        this.router.navigate(['/transports']);
      }
    );
  }

  reservationsList() : void {
    this.dataService.ReservationTransport(this.TransportId).subscribe(
      (response: any)  => {
        this.Reservation = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations:', error);
      }
    )
  }
}
