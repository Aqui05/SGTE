import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})
export class VehicleAddComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  vehicleForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;

  TransportTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private http: HttpClient, // Inject HttpClient
    private router: Router,
    private dataService: DataService,
  ) {
    this.vehicleForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]],
      brand: [null, [Validators.required, Validators.maxLength(255)]],
      model: [null, [Validators.required, Validators.maxLength(255)]],
      license_plate: [null, [Validators.required, Validators.maxLength(255)]],
      seats: [null, [Validators.required, Validators.min(1)]],
      model_3d_link: [null, [this.validateFile]] // Keep the field name as model_3d_link
    });
  }

  ngOnInit(): void {}

  validateFile = (file: NzUploadFile): boolean => {
    if (!file || !file.name) {
      return false; // Return false if the file or its name is undefined
    }

    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.name.split('.').pop()!.toLowerCase();
    const isValidType = allowedTypes.includes(fileExtension);
    const isValidSize = file.size !== undefined && file.size / 1024 / 1024 <= 10;

    if (!isValidType) {
      this.msg.error('Invalid file type');
      return false;
    }
    if (!isValidSize) {
      this.msg.error('File size must not exceed 10 MB');
      return false;
    }
    return true;
  };
  handleChange(info: NzUploadChangeParam): void {
    const { file, fileList } = info;
    const status = file.status;

    if (status !== 'uploading') {
      console.log(file, fileList);
    }

    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  submitForm(): void {
    this.loading = true;
    if (this.vehicleForm.valid) {
      const formData = new FormData();
      formData.append('type', this.vehicleForm.get('type')?.value);
      formData.append('brand', this.vehicleForm.get('brand')?.value);
      formData.append('model', this.vehicleForm.get('model')?.value);
      formData.append('license_plate', this.vehicleForm.get('license_plate')?.value);
      formData.append('seats', this.vehicleForm.get('seats')?.value);

      const imageFile = this.fileList[0]?.originFileObj;
      if (imageFile) {
        formData.append('model_3d_link', imageFile, imageFile.name); // Keep the field name as model_3d_link
      }

      this.dataService.addVehicle(formData).subscribe(
        (response) => {
          this.msg.success('Vehicle added successfully!');
          this.router.navigate(['/admin/vehicles']);
          this.loading = false;
          this.resetForm();
        },
        (error) => {
          console.error('Error adding vehicle:', error);
          this.msg.error('Error saving vehicle.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Unknown error';
          this.loading = false;
          this.resetForm();
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

  resetForm(): void {
    this.vehicleForm.reset();
    this.fileList = [];
    this.submitError = false;
    this.submitErrorMessage = '';
  }
}
