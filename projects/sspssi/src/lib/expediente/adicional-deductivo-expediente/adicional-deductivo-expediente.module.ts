import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionalDeductivoExpedienteComponent } from './adicional-deductivo-expediente.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AdicionalExpedienteComponent } from './adicional-expediente/adicional-expediente.component';
import { DeductivoExpedienteComponent } from './deductivo-expediente/deductivo-expediente.component';

const routes: Routes = [
  { path: '', component: AdicionalDeductivoExpedienteComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  declarations: [AdicionalDeductivoExpedienteComponent, AdicionalExpedienteComponent, DeductivoExpedienteComponent]
})
export class AdicionalDeductivoExpedienteModule { }
