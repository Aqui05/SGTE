import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-add',
  templateUrl: './transport-add.component.html',
  styleUrls: ['./transport-add.component.css']
})
export class TransportAddComponent {
  transportForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;
  departureLat?: number;
  departureLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  duration?: string;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
  ) {
    this.transportForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]],
      departure_location: [null, [Validators.required, Validators.maxLength(255)]],
      destination_location: [null, [Validators.required, Validators.maxLength(255)]],
      numero_transport: [null, [Validators.required, Validators.maxLength(5)]],
      departure_time: [null, [Validators.required]],
      arrival_time: [null, [Validators.required]],
      seats: [null, [Validators.required, Validators.min(1)]],
      vehicle_id: [null, [Validators.required, Validators.min(1)]]
    });}

  submitForm(): void {
    this.loading = true;
    if (this.transportForm.valid) {
      const formData = new FormData();
      Object.keys(this.transportForm.controls).forEach(key => {
        formData.append(key, this.transportForm.get(key)?.value);
      });

      this.dataService.addTransport(formData).subscribe(
        (response) => {
          this.msg.success('Transport enregistré avec succès!');
          this.router.navigate(['/transports']);
          this.loading = false;
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du transport:', error);
          this.msg.error('Erreur lors de l\'enregistrement du transport.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Erreur inconnue';
          this.loading = false;
        }
      );
    } else {
      Object.values(this.transportForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loading = false;
    }
  }

  resetForm(): void {
    this.transportForm.reset();
    this.submitError = false;
    this.submitErrorMessage = '';
  }
}
