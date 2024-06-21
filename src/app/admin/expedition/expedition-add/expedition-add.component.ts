import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-add',
  templateUrl: './expedition-add.component.html',
  styleUrls: ['./expedition-add.component.css']
})
export class ExpeditionAddComponent implements OnInit {
  expeditionForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  submitSuccess = false;
  submitSuccessMessage = '';
  loading = false;
  selectAll = false;

  VehicleTypes: any[] = [];
  VehicleLicenses: any[] = [];

  ExpeditionTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];
  VehicleId: number[] = [];

  merchandises: any[] = [];
  selectedMerchandises: any[] = [];
  step = 1; // Step indicator (1: Form, 2: Select Merchandise)
  expeditionId: number | null = null; // To store the expedition ID after it's created

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.expeditionForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]], // dropdown
      origin: [null, [Validators.required, Validators.maxLength(255)]],
      destination: [null, [Validators.required, Validators.maxLength(255)]],
      expedition_number: [null, [Validators.required, Validators.maxLength(5)]],
      date_expedition: [null, [Validators.required]],
      date_livraison_prevue: [null, [Validators.required]],
      notes: [null],
      vehicle_license: [null, [Validators.required]], // dropdown
      vehicle_id: [null],
    });

    this.expeditionForm.get('type')?.valueChanges.subscribe(value => {
      this.sortVehicleType();
    });

    this.expeditionForm.get('vehicle_license')?.valueChanges.subscribe(value => {
      this.findVehicleId();
    });
  }
  findVehicleId(): void {
    const vehicleLicense = this.expeditionForm.get('vehicle_license')?.value;
    if (vehicleLicense) {
      this.dataService.searchVehicle('license_plate', vehicleLicense).subscribe(
        (response: any) => {
          const vehicle = response.data[0];
          if (vehicle) {
            this.expeditionForm.controls['vehicle_id'].setValue(vehicle.id);
          } else {
            this.expeditionForm.controls['vehicle_id'].setValue(null);
          }
        },
        (error) => {
          this.msg.error('Erreur lors de la recherche du véhicule.', error);
        }
      );
    }
  }


  sortVehicleType(): void {
    const vehicleType = this.expeditionForm.get('type')?.value;
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

  loadMerchandises(): void {
    this.dataService.getMerchandisesDeAr(this.expeditionForm.get('origin')?.value, this.expeditionForm.get('destination')?.value).subscribe(
      (data) => {
        this.merchandises = data.data;
        console.log(this.merchandises);
      },
      (error) => {
        this.msg.error('Erreur lors de la récupération des marchandises.', error);
      }
    );
  }


  loadAllMerchandises(): void {
    this.dataService.getMerchandises().subscribe(
      (data) => {
        this.merchandises = data.data;
      },
      (error) => {
        this.msg.error('Erreur lors de la récupération de toutes les marchandises.', error);
      }
    );
  }

  onMerchandiseSelect(merchandise: any): void {
    const index = this.selectedMerchandises.indexOf(merchandise);
    if (index === -1) {
      this.selectedMerchandises.push(merchandise);
    } else {
      this.selectedMerchandises.splice(index, 1);
    }
  }


  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedMerchandises = [...this.merchandises];
      this.merchandises.forEach(merchandise => merchandise.selected = true);
    } else {
      this.selectedMerchandises = [];
      this.merchandises.forEach(merchandise => merchandise.selected = false);
    }
  }

  submitSelectedMerchandises(): void {
    if (this.expeditionId !== null) {
      const merchandiseIds = this.selectedMerchandises.map(m => m.id);
      this.dataService.updateMerchandiseExpedition(this.expeditionId, merchandiseIds).subscribe(
        (response) => {
          this.msg.success('Marchandises liées à l\'expédition avec succès!');
          this.router.navigate(['admin/expedition']);
        },
        (error) => {
          this.msg.error('Erreur lors de la liaison des marchandises à l\'expédition.', error);
        }
      );
    } else {
      this.msg.error('Erreur : ID d\'expédition non disponible.');
    }
  }

  submitForm(): void {
    this.loading = true;
    if (this.expeditionForm.valid) {
      const formData = this.expeditionForm.value;

      console.log('Form Data:', formData);

      this.dataService.addExpedition(formData).subscribe(
        (response) => {
          this.msg.success('Expédition enregistrée avec succès!');
          this.expeditionId = response.data.id; // Store the expedition ID
          this.step = 2; // Move to the next step (select merchandise)
          this.loadMerchandises(); // Load merchandise for selection
          this.loading = false;
          console.log(response);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'expédition:', error);
          this.msg.error('Erreur lors de l\'enregistrement de l\'expédition.');
          this.submitError = true;
          this.submitErrorMessage = error.error.message || 'Erreur inconnue';
          this.loading = false;
        }
      );
    } else {
      Object.values(this.expeditionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.loading = false;
    }
  }


  resetForm(): void {
    this.expeditionForm.reset();
    this.submitError = false;
    this.submitErrorMessage = '';
    this.submitSuccess = false;
    this.submitSuccessMessage = '';
  }
}
