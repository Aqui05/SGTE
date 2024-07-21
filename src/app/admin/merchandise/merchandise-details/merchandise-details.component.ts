import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-details',
  templateUrl: './merchandise-details.component.html',
  styleUrls: ['./merchandise-details.component.css']
})
export class MerchandiseDetailsComponent implements OnInit {

  merchandiseId !: number;
  merchandise:any = {};

  constructor (
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.merchandiseId = +params['id'];
      this.loadMerchandise();
    });
  }

  loadMerchandise() :void {
    this.dataService.getMerchandise(this.merchandiseId).subscribe(
      (data) => {
        this.merchandise = data.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération de la marchandise:', error);
      }
    );
  }

}
