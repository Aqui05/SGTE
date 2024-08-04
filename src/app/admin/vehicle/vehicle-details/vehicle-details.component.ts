import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: any;
  fileList: NzUploadFile[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.getVehicle(Number(id)).subscribe(
      (data) => {
        this.vehicle = data.data;
        console.log('Véhicule:', this.vehicle);
        if (this.vehicle.model_3d_link) {
          this.fileList = [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: this.vehicle.model_3d_link
          }];
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du véhicule:', error);
      }
    );
  }

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    this.fileList = fileList;
  }

  editVehicle(id: number): void {
    this.router.navigate([`admin/vehicle/edit/${id}`]);
  }


  deleteVehicle(id: number): void {
    this.dataService.deleteVehicle(id).subscribe(
      (response) => {
        this.router.navigate(['/vehicles']);
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }
}
