import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { EjecucionEstadoComponent } from './ejecucion-estado.component';
import { AsignacionResponsableComponent } from './asignacion-responsable/asignacion-responsable.component';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { AccionesSeguimientoMonitoreoComponent } from './acciones-seguimiento-monitoreo/acciones-seguimiento-monitoreo.component';
import { ModalAdelantoDirectoComponent } from './modal-adelanto-directo/modal-adelanto-directo.component';
import { ModalAdelantoMaterialesComponent } from './modal-adelanto-materiales/modal-adelanto-materiales.component';
import { PeriodoParalizacionComponent } from './periodo-paralizacion/periodo-paralizacion.component';
import { ValorizacionesComponent } from './valorizaciones/valorizaciones.component';
import { InformacionObraComponent } from './informacion-obra/informacion-obra.component';
import { PeriodoSuspensionComponent } from './periodo-suspension/periodo-suspension.component';

const routes: Routes = [
  {path:'', component: EjecucionEstadoComponent} 
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [PagerService],
  declarations: [
     EjecucionEstadoComponent
  ],
  entryComponents: [
    
  ]
})
export class EjecucionEstadoModule { }
