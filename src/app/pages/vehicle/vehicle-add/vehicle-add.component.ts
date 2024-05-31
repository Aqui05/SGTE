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
      model_3d: [null, [this.validateFile]] // Ajouter la validation de fichier
    });
  }

  ngOnInit(): void {}
  validateFile = (file: NzUploadFile): boolean => {
    if (!file || !file.name) {
      return false; // Retourne false si le fichier ou son nom est undefined
    }

    const allowedTypes = ['obj', 'stl', 'fbx', 'glb', 'gltf'];
    const fileExtension = file.name.split('.').pop()!.toLowerCase();
    const isValidType = allowedTypes.includes(fileExtension);
    const isValidSize = file.size !== undefined && file.size / 1024 / 1024 <= 10;

    if (!isValidType) {
      this.msg.error('Type de fichier non valide');
      return false;
    }
    if (!isValidSize) {
      this.msg.error('La taille du fichier ne doit pas dépasser 10 Mo');
      return false;
    }
    return true;
  };

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
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

      const modelFile = this.fileList[0]?.originFileObj;
      if (modelFile) {
        formData.append('model_3d', modelFile, modelFile.name);
      }

      this.dataService.addVehicle(formData).subscribe(
        (response) => {
          this.msg.success('Véhicule enregistré avec succès!');
          this.router.navigate(['/vehicles']);
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
