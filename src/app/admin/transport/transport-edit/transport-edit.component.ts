import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-transport-edit',
  templateUrl: './transport-edit.component.html',
  styleUrls: ['./transport-edit.component.css']
})
export class TransportEditComponent implements OnInit {

  transportForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  loading = false;

  VehicleTypes: any[] = [];
  VehicleLicenses: any[] = [];
  //TransportTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];
  TransportId!: number;
  transport: any = {};

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.TransportId = Number(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadTransportData();

      this.sortVehicleType();

    this.transportForm.get('vehicle_license')?.valueChanges.subscribe(() => {
      this.findVehicleId();
    });
  }

  initForm(): void {
    this.transportForm = this.fb.group({
      departure_location: [null, [Validators.required, Validators.maxLength(255)]],
      destination_location: [null, [Validators.required, Validators.maxLength(255)]],
      numero_transport: [null, [Validators.required, Validators.maxLength(10)]],
      departure_time: [null, [Validators.required, this.futureDateValidator()]], // Validation de la date de départ
      arrival_time: [null, [Validators.required, this.afterStartDate()]],   // Validation de la date d'arrivée
      vehicle_license: [null, [Validators.required]],
      vehicle_id: [null],
    });
  }

  loadTransportData(): void {
    this.dataService.getTransport(this.TransportId).subscribe(
      data => {
        this.transport = data.data;
        this.transportForm.patchValue(this.transport);
        this.sortVehicleType();
      },
      error => {
        console.error('Erreur lors de la sélection du transport:', error);
        this.msg.error('Erreur lors du chargement des données du transport.');
      }
    );
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
          const selectedVehicle = this.VehicleTypes.find(vehicle => vehicle.license_plate === vehicleLicense);
          this.transportForm.patchValue({ vehicle_id: selectedVehicle?.id });
        },
        (error) => {
          this.msg.error('Erreur lors de la recherche du véhicule.');
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
      const formValue = this.transportForm.value;
      this.dataService.updateTransport(this.TransportId, formValue).subscribe(
        () => {
          this.msg.success('Transport mis à jour avec succès!');
          this.router.navigate(['/admin/transport']);
          this.loading = false;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du transport:', error);
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
