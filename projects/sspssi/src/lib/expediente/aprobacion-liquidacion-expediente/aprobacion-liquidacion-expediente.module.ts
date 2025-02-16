import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AprobacionLiquidacionExpedienteComponent } from './aprobacion-liquidacion-expediente.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AprobacionExpedienteComponent } from './aprobacion-expediente/aprobacion-expediente.component';
import { LiquidacionExpedienteComponent } from './liquidacion-expediente/liquidacion-expediente.component';

const routes: Routes = [
  { path: '', component: AprobacionLiquidacionExpedienteComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AprobacionLiquidacionExpedienteComponent, AprobacionExpedienteComponent, LiquidacionExpedienteComponent]
})
export class AprobacionLiquidacionExpedienteModule { }
