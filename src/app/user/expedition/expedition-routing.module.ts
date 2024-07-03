import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpeditionHistoryComponent } from './expedition-history/expedition-history.component';

const routes: Routes = [
  { path: 'history', component: ExpeditionHistoryComponent,data: { title: 'Historiques des expeditions' }  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpeditionRoutingModule { }
