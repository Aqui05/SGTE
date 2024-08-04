import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpeditionRoutingModule } from './expedition-routing.module';
import { ExpeditionHistoryComponent } from './expedition-history/expedition-history.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';


@NgModule({
  declarations: [
    ExpeditionHistoryComponent
  ],
  imports: [
    CommonModule,
    ExpeditionRoutingModule,
    DemoNgZorroAntdModule
  ]
})
export class ExpeditionModule { }
