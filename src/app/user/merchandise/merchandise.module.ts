import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchandiseRoutingModule } from './merchandise-routing.module';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseAddComponent } from './merchandise-add/merchandise-add.component';
import { MerchandiseEditComponent } from './merchandise-edit/merchandise-edit.component';
import { MerchandiseDetailsComponent } from './merchandise-details/merchandise-details.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';


@NgModule({
  declarations: [
    MerchandiseListComponent,
    MerchandiseAddComponent,
    MerchandiseEditComponent,
    MerchandiseDetailsComponent,
  ],
  imports: [
    CommonModule,
    MerchandiseRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class MerchandiseModule { }
