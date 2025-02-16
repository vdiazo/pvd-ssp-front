import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoMonitoreoComponent } from './seguimiento-monitoreo.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from 'projects/sspssi/src/appSettings';
import { ComparativoAvanceComponent } from './comparativo-avance/comparativo-avance.component';
import { DxChartModule } from 'devextreme-angular';
import { CronogramaFinancieroComponent } from './cronograma-financiero/cronograma-financiero.component';
//import { CronogramaComponent } from './cronograma/cronograma.component';
//import { InformacionObraComponent } from './informacion-obra/informacion-obra.component';
//import { AsignacionResponsableComponent } from './asignacion-responsable/asignacion-responsable.component';
//import { ValorizacionesComponent } from './valorizaciones/valorizaciones.component';
//import { ParalizacionAccionComponent } from './paralizacion-accion/paralizacion-accion.component';
//import { AccionesSeguimientoMonitoreoComponent } from './acciones-seguimiento-monitoreo/acciones-seguimiento-monitoreo.component';
//import { PeriodoParalizacionComponent } from './periodo-paralizacion/periodo-paralizacion.component';

const routes: Routes = [
  {
    path: '',
    component: SeguimientoMonitoreoComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    DxChartModule
  ],
  providers: [PagerService],
  declarations: [
    SeguimientoMonitoreoComponent,
    ComparativoAvanceComponent,
    CronogramaFinancieroComponent,
    //CronogramaComponent,
    //InformacionObraComponent,
    //AsignacionResponsableComponent,
    //ValorizacionesComponent,
    //AccionesSeguimientoMonitoreoComponent,
    //ParalizacionAccionComponent,
    //PeriodoParalizacionComponent
  ]
})
export class SeguimientoMonitoreoModule { }
