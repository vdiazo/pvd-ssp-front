import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectoComponent } from './proyecto.component';

import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { PagerService } from '../../appSettings';
import { SharedModule } from '../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';

const routes: Routes = [

  {
    path: '',
    component: ProyectoComponent,
    children: [
      {
        path: 'info-general/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/info-general/info-general.module#InfoGeneralModule",
      },
      {
        path: 'financiamiento/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/financiamiento/financiamiento.module#FinanciamientoModule",
      },
      {
        path: 'proceso-seleccion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/proceso-seleccion/proceso-seleccion.module#ProcesoSeleccionModule",
      },
      {
        path: 'seguimiento-monitoreo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/seguimiento-monitoreo/seguimiento-monitoreo.module#SeguimientoMonitoreoModule",
      },
      {
        path: 'adicional-deductivo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/adicional-deductivo/adicional-deductivo.module#AdicionalDeductivoModule",
      },
      {
        path: 'recepcion-liquidacion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/recepcion-liquidacion/recepcion-liquidacion.module#RecepcionLiquidacionModule",
      },
      {
        path: 'historial/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: "../../lib/proyecto/recepcion-liquidacion/resolucion-contrato/resolucion-contrato.module#ResolucionContratoModule",
      },

      //Información General del Proyecto
      //Financiamiento
      //Proceso de Selección
      //Seguimiento y Monitoreo a Ejecución
      //Adicional y Deductivo
      //Recepción y Liquidación
    ],
  },

];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    TextMaskModule
    //SSPSETModule
  ],
  providers: [PagerService],
  declarations: [
    ProyectoComponent,
    //ProcesoSeleccionComponent
    // InfoGeneralProyectoComponent,
    //------------------------------------
    // InfoFinancieraComponent,

    // CostoProyectoComponent,
    // MontoConvenioComponent,
    // MontoTransferidoComponent,
    // FuenteFinancieraComponent,
    // InformacionFinancieraComponent,
    //--------------------
    // ProcesoSeleccionComponent,

    // ContratacionObraComponent,
    // ContratacionConsultoriaComponent,
    // ContratacionBienesServiciosComponent,
    //------------------------------------
    //  EjecucionEstadoComponent,

    //  AsignacionResponsableComponent,
    //  CronogramaComponent,
    //  AccionesSeguimientoMonitoreoComponent,
    //------------------------------------
    //InformacionComplementariaComponent,
    // PresupuestoAdicionalComponent,
    // DeductivosReduccionesComponent,
    //------------------------------------
    // RecepcionLiquidacionComponent,

    // RecepcionObraComponent,
    // SeguimientoLiquidacionComponent,

  ]
})
export class ProyectoModule { }
