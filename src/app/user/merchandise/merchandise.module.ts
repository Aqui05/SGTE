import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchandiseRoutingModule } from './merchandise-routing.module';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseAddComponent } from './merchandise-add/merchandise-add.component';
import { MerchandiseEditComponent } from './merchandise-edit/merchandise-edit.component';


@NgModule({
  declarations: [
    MerchandiseListComponent,
    MerchandiseAddComponent,
    MerchandiseEditComponent
  ],
  imports: [
    CommonModule,
    MerchandiseRoutingModule
  ]
})
export class MerchandiseModule { }
