import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService, NzNotificationComponent } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-transport-add',
  templateUrl: './transport-add.component.html',
  styleUrls: ['./transport-add.component.css']
})
export class TransportAddComponent implements OnInit {

  @ViewChild('template', { static: true }) notificationTemplate!: TemplateRef<{}>;
  @ViewChild('notificationTpl', { static: true }) btnTemplate!: TemplateRef<{ $implicit: NzNotificationComponent } | string>;

  transportForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;
  transportId!: number;

  VehicleTypes: any[] = [];
  VehicleLicenses: any[] = [];

  //TransportTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];
  VehicleId: number[] = [];

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.transportForm = this.fb.group({
      //type: [null, [Validators.required, Validators.maxLength(255)]], //dropdown
      departure_location: [null, [Validators.required, Validators.maxLength(255)]],
      destination_location: [null, [Validators.required, Validators.maxLength(255)]],
      numero_transport: [null, [Validators.required, Validators.maxLength(10)]],
      departure_time: [null, [Validators.required, this.futureDateValidator()]], // Validation de la date de départ
      arrival_time: [null, [Validators.required, this.afterStartDate()]],   // Validation de la date d'arrivée
      vehicle_license: [null, [Validators.required]], //dropdown
      vehicle_id: [null],
    });


      this.sortVehicleType();

    this.transportForm.get('vehicle_license')?.valueChanges.subscribe(value => {
      this.findVehicleId();
    });
  }

  // Validateur personnalisé pour vérifier que la date est dans le futur
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const controlDate = new Date(control.value);

      // Vérifie si la date est dans le futur
      if (controlDate <= currentDate) {
        return { futureDate: { value: control.value } };
      }
      return null;
    };
  }

// Validateur personnalisé pour vérifier que la date d'arrivée est après la date de départ
afterStartDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;
    
    if (!form) {
      return null;
    }
    
    const departureTimeControl = form.get('departure_time');
    const arrivalTimeControl = control;
    
    if (!departureTimeControl || !arrivalTimeControl.value) {
      return null;
    }
    
    const departureTime = new Date(departureTimeControl.value);
    const arrivalTime = new Date(arrivalTimeControl.value);
    
    // Vérifie si la date d'arrivée est après la date de départ
    if (arrivalTime <= departureTime) {
      return { afterStartDate: { value: arrivalTimeControl.value } };
    }
    
    return null;
  };
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
    this.dataService.getVehicles().subscribe(
      (response: any) => {
        this.VehicleTypes = response.data;
        
        // Filtrer et mapper les véhicules
        this.VehicleLicenses = this.VehicleTypes.map(vehicle => ({
          license: vehicle.license_plate,
          available: vehicle.available,
          disabled: !vehicle.available  // Ajouter une propriété disabled
        }));
  
        // Dans le template HTML, vous pouvez utiliser cette propriété disabled
        // par exemple pour désactiver l'option de sélection
        console.log('Liste des véhicules trouvés:', this.VehicleTypes);
        console.log(this.VehicleLicenses);
      },
      (error) => {
        this.msg.error('Erreur lors de la recherche des véhicules par type.', error);
      }
    );
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
          console.log(response);
          this.transportId = response.success.id;
          console.log(this.transportId);
          this.openNotification(this.notificationTemplate, this.transportId);
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

  openNotification(template: TemplateRef<{}>, transportId: number): void {
    this.notification.template(template, {
      nzData: { transportId: transportId },
      nzDuration: 0
    });
  }

  associateRoute(): void {
    this.notification.remove();
    this.router.navigate([`/admin/map/${this.transportId}`]);
  }

  resetForm(): void {
    this.transportForm.reset();
    this.submitError = false;
    this.submitErrorMessage = '';
  }
}
