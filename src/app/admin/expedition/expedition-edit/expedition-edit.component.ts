import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expedition-edit',
  templateUrl: './expedition-edit.component.html',
  styleUrls: ['./expedition-edit.component.css']
})
export class ExpeditionEditComponent implements OnInit {
  expeditionForm!: FormGroup;
  submitError = false;
  submitErrorMessage = '';
  submitSuccess = false;
  submitSuccessMessage = '';
  loading = false;
  selectAll = false;
  showAllMerchandises = false;

  VehicleTypes: any[] = [];
  VehicleLicenses: any[] = [];

  ExpeditionTypes: string[] = ['maritime', 'routier', 'aérien', 'ferroviaire'];
  VehicleId: number[] = [];

  merchandises: any[] = [];
  selectedMerchandises: any[] = [];
  step = 1; // Step indicator (1: Form, 2: Select Merchandise)
  expeditionId!: number

  expedition :any = {};

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {
    this.expeditionId = Number(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnInit(): void {


    this.loadExpeditionData();

    this.expeditionForm = this.fb.group({
      type: [null, [Validators.required, Validators.maxLength(255)]], // dropdown
      origin: [null, [Validators.required, Validators.maxLength(255)]],
      destination: [null, [Validators.required, Validators.maxLength(255)]],
      expedition_number: [null, [Validators.required, Validators.maxLength(10)]],
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


  loadExpeditionData ():void {
    if (this.expeditionId) {
      this.loading = true;
      this.dataService.getExpedition(this.expeditionId).subscribe(
        (response: any) => {
          this.expedition = response.data;
          this.expeditionForm.patchValue(this.expedition);
          this.loading = false;
        },
        (error) => {
          this.msg.error('Erreur lors de la récupération de l\'expédition.', error);
          this.loading = false;
        }
      );
    }
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

  loadAllMerchandisesNoShipped(): void {
    this.dataService.getMerchandisesShip().subscribe(
      (data) => {
        this.merchandises = data.data;
      },
      (error) => {
        this.msg.error('Erreur lors de la récupération de toutes les marchandises.', error);
      }
    );
  }

  toggleAllMerchandises() {
    this.showAllMerchandises = !this.showAllMerchandises;
    if (this.showAllMerchandises) {
      this.loadAllMerchandisesNoShipped();
    } else {
      this.loadMerchandises();
    }
  }


  onMerchandiseSelect(merchandise: any): void {
    merchandise.selected = !merchandise.selected;
    this.updateSelectedMerchandises();
  }

  updateSelectedMerchandises(): void {
    this.selectedMerchandises = this.merchandises.filter(m => m.selected);
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.merchandises.forEach(merchandise => merchandise.selected = this.selectAll);
    this.updateSelectedMerchandises();
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

      this.dataService.updateExpedition(this.expeditionId, formData).subscribe(
        (response) => {
          this.msg.success('Expédition mise à jour avec succès!');
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
