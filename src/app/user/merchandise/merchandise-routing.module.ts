import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchandiseAddComponent } from './merchandise-add/merchandise-add.component';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseEditComponent } from './merchandise-edit/merchandise-edit.component';
import { MerchandiseDetailsComponent } from './merchandise-details/merchandise-details.component';

const routes: Routes = [
  { path: 'add', component: MerchandiseAddComponent,data: { title: 'Enregistrement marchandise' }  },
  { path: 'list', component: MerchandiseListComponent,data: { title: 'liste des marchandises' }  },
  { path: 'details/:id', component: MerchandiseDetailsComponent,data: { title: 'Détails d\'une marchandise' }  },
  { path: 'edit/:id', component: MerchandiseEditComponent,data: { title: 'Modification  d\'une marchandise' }  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchandiseRoutingModule { }
