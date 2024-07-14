import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-add',
  templateUrl: './transport-add.component.html',
  styleUrls: ['./transport-add.component.css']
})
export class TransportAddComponent implements OnInit {
  transportForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;

  VehicleTypes: any[] = [];
  VehicleLicenses: any[] = [];

  TransportTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];
  VehicleId: number[] = [];

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.transportForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]], //dropdown
      departure_location: [null, [Validators.required, Validators.maxLength(255)]],
      destination_location: [null, [Validators.required, Validators.maxLength(255)]],
      numero_transport: [null, [Validators.required, Validators.maxLength(5)]],
      departure_time: [null, [Validators.required]],
      arrival_time: [null, [Validators.required]],
      vehicle_license: [null, [Validators.required]], //dropdown
      vehicle_id: [null],
    });

    this.transportForm.get('type')?.valueChanges.subscribe(value => {
      this.sortVehicleType();
    });

    this.transportForm.get('vehicle_license')?.valueChanges.subscribe(value => {
      this.findVehicleId();
    });
  }

  findVehicleId(): void {
    const vehicleLicense = this.transportForm.get('vehicle_license')?.value;
    if (vehicleLicense) {
      this.dataService.searchVehicle('license_plate', vehicleLicense).subscribe(
        (response: any) => {
          this.VehicleTypes = response.data;
          this.VehicleId = this.VehicleTypes.map(vehicle => vehicle.id);
          this.transportForm.controls['vehicle_id'].setValue(this.VehicleId);
          console.log(this.VehicleId);
        },
        (error) => {
          this.msg.error('Erreur lors de la recherche du véhicule.', error);
        }
      );
    }
  }

  sortVehicleType(): void {
    const vehicleType = this.transportForm.get('type')?.value;
    if (vehicleType) {
      this.dataService.searchVehicle('type', vehicleType).subscribe(
        (response: any) => {
          this.VehicleTypes = response.data;
          this.VehicleLicenses = this.VehicleTypes.map(vehicle => ({
            license: vehicle.license_plate,
            available: vehicle.available
          }));
          console.log('Liste des véhicules trouvés:', this.VehicleTypes);
          console.log(this.VehicleLicenses);
        },
        (error) => {
          this.msg.error('Erreur lors de la recherche des véhicules par type.', error);
        }
      );
    }
  }

  submitForm(): void {
    this.loading = true;
    if (this.transportForm.valid) {
      const formData = new FormData();
      Object.keys(this.transportForm.controls).forEach(key => {
        formData.append(key, this.transportForm.get(key)?.value);
      });

      this.dataService.addTransport(formData).subscribe(
        (response: any) => {
          console.log(response)
          const transportId = response.id;  // Assurez-vous que l'ID du transport est retourné dans la réponse
          const messageContent = `
            Transport enregistré avec succès!
            <button nz-button nzType="link" (click)="navigateToMap(${transportId})">
              Associer une route
            </button>
          `;
          this.msg.success(messageContent, { nzDuration: 50000, nzPauseOnHover: true });
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

  navigateToMap(transportId: number): void {
    this.router.navigate(['/admin/map', transportId]);
  }




  associateRoute(transportId: number): void {
    this.router.navigate(['/admin/map', transportId]);
  }

  resetForm(): void {
    this.transportForm.reset();
    this.submitError = false;
    this.submitErrorMessage = '';
  }
}
