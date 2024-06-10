import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleAddComponent,
    VehicleEditComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
  ]
})
export class VehicleModule { }
