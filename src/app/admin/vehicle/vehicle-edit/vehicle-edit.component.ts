import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {

  fileList: NzUploadFile[] = [];
  vehicleForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;
  vehicleId!: number; // Changed type to number
  vehicle: any;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vehicleForm = this.fb.group({
      type: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      model: [null, [Validators.required]],
      license_plate: [null, [Validators.required]],
      model_3d: [null],
      seats: [null, [Validators.required, Validators.min(1)]],
      available: [true]
    });

    // Convert string to number
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {
    this.dataService.getVehicle(this.vehicleId).subscribe((vehicle: any) => {
      this.vehicleForm.patchValue({
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        license_plate: vehicle.license_plate,
        seats: vehicle.seats,
        available: vehicle.available
      });
    });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.vehicleForm.patchValue({
        model_3d: info.file.originFileObj
      });
      const model3dControl = this.vehicleForm.get('model_3d');
      if (model3dControl) {
        model3dControl.updateValueAndValidity();
      }
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  submitForm(): void {
    this.loading = true;
    if (this.vehicleForm.valid) {
      const formData: FormData = new FormData();
      formData.append('type', this.vehicleForm.get('type')?.value);
      formData.append('brand', this.vehicleForm.get('brand')?.value);
      formData.append('model', this.vehicleForm.get('model')?.value);
      formData.append('license_plate', this.vehicleForm.get('license_plate')?.value);
      formData.append('seats', this.vehicleForm.get('seats')?.value);
      formData.append('available', this.vehicleForm.get('available')?.value.toString());

      const model3dFile = this.vehicleForm.get('model_3d')?.value;
      if (model3dFile) {
        formData.append('model_3d', model3dFile);
      }

      this.dataService.updateVehicle(this.vehicleId, formData).subscribe(
        (response) => {
          this.msg.success('Véhicule mis à jour avec succès!');
          this.router.navigate(['/vehicles']);
          this.loading = false;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du véhicule:', error);
          this.msg.error('Erreur lors de la mise à jour du véhicule.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Erreur inconnue';
          this.loading = false;
        }
      );
    } else {
      Object.values(this.vehicleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loading = false;
    }
  }
}
