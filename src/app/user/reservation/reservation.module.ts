import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationAddComponent } from './reservation-add/reservation-add.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReservationListComponent,
    ReservationEditComponent,
    ReservationAddComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
  ]
})
export class ReservationModule { }
