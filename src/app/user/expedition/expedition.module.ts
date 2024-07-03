import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpeditionRoutingModule } from './expedition-routing.module';
import { ExpeditionHistoryComponent } from './expedition-history/expedition-history.component';


@NgModule({
  declarations: [
    ExpeditionHistoryComponent
  ],
  imports: [
    CommonModule,
    ExpeditionRoutingModule
  ]
})
export class ExpeditionModule { }
