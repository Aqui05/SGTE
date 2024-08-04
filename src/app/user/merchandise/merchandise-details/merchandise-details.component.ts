import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-details',
  templateUrl: './merchandise-details.component.html',
  styleUrls: ['./merchandise-details.component.css']
})
export class MerchandiseDetailsComponent implements OnInit{
  Merchandise !: {};
  merchandiseId !: number;

  constructor (
    private dataService: DataService,
    private route: ActivatedRoute,
  )
  {}

  ngOnInit(): void {
    this.merchandiseId= this.route.snapshot.params['id'];
    this.loadMerchandiseData();
  }

  loadMerchandiseData():void {
    this.dataService.getMerchandise(this.merchandiseId).subscribe(
      (response) =>  {
        this.Merchandise = response.data;
      },
      (error) =>  {
        console.error('error loading merchandises :', error)
      }

    )
  }

}
