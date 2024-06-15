import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';

const routes: Routes = [
  { path: '', component: VehicleListComponent,data: { title: 'Liste Vehicule' } },
  { path: 'create', component: VehicleAddComponent,data: { title: 'Ajout d\'un Vehicule' } },
  { path: 'details/:id', component: VehicleDetailsComponent,data: { title: 'Details d\'un Vehicule' } },
  { path: 'edit/:id', component: VehicleEditComponent,data: { title: 'Modification d\'un Vehicule' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
