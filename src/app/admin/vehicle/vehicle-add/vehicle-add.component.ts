import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';

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
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
  ) {
    this.vehicleForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]],
      brand: [null, [Validators.required, Validators.maxLength(255)]],
      model: [null, [Validators.required, Validators.maxLength(255)]],
      license_plate: [null, [Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z0-9-]+$')]],
      seats: [null, [Validators.required, Validators.min(1)]],
      model_3d_link: [null] // Champ pour le fichier
    });
  }

  ngOnInit(): void {}

  validateFile = (file: NzUploadFile): boolean => {
    const allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'svg'];
    const fileExtension = file.name.split('.').pop()!.toLowerCase();
    const isValidType = allowedTypes.includes(fileExtension);
    const isValidSize = file.size !== undefined && file.size / 10024 / 10024 <= 10;

    if (!isValidType) {
      this.msg.error('Type de fichier non valide.');
      return false;
    }
    if (!isValidSize) {
      this.msg.error('La taille du fichier ne doit pas dépasser 10 Mo.');
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
      this.msg.success(`${file.name} téléchargé avec succès.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} échec du téléchargement.`);
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
        formData.append('model_3d_link', imageFile, imageFile.name); // Ajoutez le fichier à FormData
      }

      this.dataService.addVehicle(formData).subscribe(
        (response) => {
          this.msg.success('Véhicule ajouté avec succès!');
          this.router.navigate(['/admin/vehicle']);
          this.loading = false;
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du véhicule:', error);
          this.msg.error('Erreur lors de l\'enregistrement du véhicule.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Erreur inconnue';
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
