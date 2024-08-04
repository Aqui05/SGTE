import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportViewComponent } from './transport-view/transport-view.component';
import { TransportHistoryComponent } from './transport-history/transport-history.component';

const routes: Routes = [
  { path: 'view', component: TransportViewComponent,data: { title: 'Liste Transports' } },
  { path: 'history', component: TransportHistoryComponent,data: { title: 'Historiques des Transports' }  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
