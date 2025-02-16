import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { InformacionExpedienteComponent } from './informacion-expediente/informacion-expediente.component';
import { ResponsablesExpedienteComponent } from './responsables-expediente/responsables-expediente.component';
import { CronogramaExpedienteComponent } from './cronograma-expediente/cronograma-expediente.component';
import { EntregablesExpedienteComponent } from './entregables-expediente/entregables-expediente.component';
import { AccionesSeguimientoExpedienteComponent } from './acciones-seguimiento-expediente/acciones-seguimiento-expediente.component';
import { PeriodoParalizacionExpedienteComponent } from './periodo-paralizacion-expediente/periodo-paralizacion-expediente.component';
import { CronogramaFinancieroExpComponent } from './cronograma-financiero-exp/cronograma-financiero-exp.component';

const routes: Routes = [
  { path: '', component: SeguimientoExpedienteComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    SeguimientoExpedienteComponent,
    InformacionExpedienteComponent,
    ResponsablesExpedienteComponent,
    CronogramaExpedienteComponent,
    EntregablesExpedienteComponent,
    AccionesSeguimientoExpedienteComponent,
    PeriodoParalizacionExpedienteComponent,
    CronogramaFinancieroExpComponent,
  ]
})
export class SeguimientoExpedienteModule { }
