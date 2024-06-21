import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseDetailsComponent } from './merchandise-details/merchandise-details.component';
import { MerchandiseSendComponent } from './merchandise-send/merchandise-send.component';

const routes: Routes = [
  { path: '', component: MerchandiseListComponent,data: { title: 'Liste Marchandises' }  },
  { path: 'details/:id', component: MerchandiseDetailsComponent,data: { title: 'D\'étails d\'une marchandise' }  },
  { path: 'send/:id', component: MerchandiseSendComponent, data:{ title: 'Expédition d\'une marchandise' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchandiseRoutingModule { }
