import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportRoutingModule } from './transport-routing.module';
import { TransportListComponent } from './transport-list/transport-list.component';
import { TransportAddComponent } from './transport-add/transport-add.component';
import { TransportEditComponent } from './transport-edit/transport-edit.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TransportListComponent,
    TransportAddComponent,
    TransportEditComponent
  ],
  imports: [
    CommonModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    TransportRoutingModule,
    FormsModule,
  ]
})
export class TransportModule { }
