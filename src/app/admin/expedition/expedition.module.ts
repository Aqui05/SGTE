import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpeditionRoutingModule } from './expedition-routing.module';
import { ExpeditionAddComponent } from './expedition-add/expedition-add.component'
import { ExpeditionEditComponent } from './expedition-edit/expedition-edit.component'
import { ExpeditionListComponent } from './expedition-list/expedition-list.component'
import { ExpeditionDetailsComponent } from './expedition-details/expedition-details.component'
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ExpeditionDetailsComponent,
    ExpeditionListComponent,
    ExpeditionEditComponent,
    ExpeditionAddComponent,
  ],
  imports: [
    CommonModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    ExpeditionRoutingModule,
    FormsModule,
  ]
})
export class ExpeditionModule { }
