import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationAddComponent } from './reservation-add/reservation-add.component';

const routes: Routes = [
  { path: '', component: ReservationListComponent },
  { path: 'create', component: ReservationAddComponent },
  { path: 'edit/:id', component: ReservationEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
