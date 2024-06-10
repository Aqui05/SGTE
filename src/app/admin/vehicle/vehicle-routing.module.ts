import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';

const routes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'create', component: VehicleAddComponent },
  { path: 'edit/:id', component: VehicleEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
