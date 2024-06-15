import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportListComponent } from './transport-list/transport-list.component';
import { TransportAddComponent } from './transport-add/transport-add.component';
import { TransportEditComponent } from './transport-edit/transport-edit.component';

const routes: Routes = [
  { path: '', component: TransportListComponent,data: { title: 'Liste Transport' }  },
  { path: 'create', component: TransportAddComponent,data: { title: 'Ajout d\'un Véhicule' } },
  { path: 'edit/:id', component: TransportEditComponent,data: { title: 'Modification d\'un véhicule ' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
