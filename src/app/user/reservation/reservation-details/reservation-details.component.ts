import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit{
  reservation !: {};
  reservationId !: number;

  constructor (
    private dataService: DataService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.params['id']
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.dataService.getReservation(this.reservationId).subscribe(
      (response) => {
        this.reservation = response.data;
      },

      (error) => {
        console.error (error);
        this.msg.error('Erreur de chargement de l\'expédition');
      }
    )
  }

}
