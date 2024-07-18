import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  vehicle: any = {};
  submitError = false;
  submitErrorMessage = '';
  loading = false;
  vehicleId!: number;

  constructor(
    private msg: NzMessageService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.params['id'];
    this.loadVehicleData(this.vehicleId);
  }

  loadVehicleData(id: number): void {
    this.dataService.getVehicle(id).subscribe(
      (vehicle) => {
        this.vehicle = vehicle.data;
        console.log('Vehicle loaded:', this.vehicle);
      },
      (error) => {
        console.error('Error loading vehicle:', error);
        this.msg.error('Error loading vehicle.');
      }
    );
  }

  handleChange(info: NzUploadChangeParam): void {
    const { file, fileList } = info;
    const status = file.status;

    if (status !== 'uploading') {
      console.log(file, fileList);
    }

    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
      this.fileList = fileList; // Update the file list
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  submitForm(): void {
    this.loading = true;
    if (this.vehicle) {
      const formData = new FormData();
      formData.append('type', this.vehicle.type);
      formData.append('brand', this.vehicle.brand);
      formData.append('model', this.vehicle.model);
      formData.append('license_plate', this.vehicle.license_plate);
      formData.append('seats', this.vehicle.seats);

      const imageFile = this.fileList[0]?.originFileObj;
      if (imageFile) {
        formData.append('model_3d_link', imageFile, imageFile.name);
      }

      this.dataService.updateVehicle(this.vehicleId, formData).subscribe(
        (response) => {
          this.msg.success('Vehicle updated successfully!');
          this.router.navigate(['/vehicles']);
          this.loading = false;
        },
        (error) => {
          console.error('Error updating vehicle:', error);
          this.msg.error('Error updating vehicle.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Unknown error';
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }
}
