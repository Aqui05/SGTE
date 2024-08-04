import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportRoutingModule } from './transport-routing.module';
import { TransportViewComponent } from './transport-view/transport-view.component';
import { TransportHistoryComponent } from './transport-history/transport-history.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';


@NgModule({
  declarations: [
    TransportViewComponent,
    TransportHistoryComponent
  ],
  imports: [
    CommonModule,
    TransportRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class TransportModule { }
