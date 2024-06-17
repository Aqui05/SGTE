import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpeditionListComponent } from './expedition-list/expedition-list.component';
import { ExpeditionAddComponent } from './expedition-add/expedition-add.component';
import { ExpeditionEditComponent } from './expedition-edit/expedition-edit.component';
import { ExpeditionDetailsComponent } from './expedition-details/expedition-details.component';

const routes: Routes = [
  { path: '', component: ExpeditionListComponent,data: { title: 'Liste Expedition' }  },
  { path: 'create', component: ExpeditionAddComponent,data: { title: 'Ajout d\'une expedition' } },
  { path: 'edit/:id', component: ExpeditionEditComponent,data: { title: 'Modification d\'une expedition ' } },
  { path: 'details/:id', component: ExpeditionDetailsComponent,data: { title: 'Détails d\'une expedition ' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpeditionRoutingModule { }
