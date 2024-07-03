import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationAddComponent } from './reservation-add/reservation-add.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';

const routes: Routes = [
  { path: 'list', component: ReservationListComponent ,data: { title: 'Liste des réservations' } },
  { path: 'add', component: ReservationAddComponent,data: { title: 'Faire une Reservation' } },
  { path: 'edit/:id', component: ReservationEditComponent,data: { title: 'Modifier une Reservation' }  },
  { path: 'details/:id', component: ReservationDetailsComponent,data: { title: 'Modifier une Reservation' }  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
