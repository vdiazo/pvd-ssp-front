import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpedienteComponent } from './expediente.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ExpedienteComponent,
    children: [
      // Información General del Proyecto
      {
        path: 'info-general/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/info-general/info-general.module#InfoGeneralModule',
      },
      // Financiamiento
      {
        path: 'financiamiento/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/financiamiento/financiamiento.module#FinanciamientoModule',
      },
      // Proceso de Selección
      {
        path: 'proceso-seleccion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/proceso-seleccion/proceso-seleccion.module#ProcesoSeleccionModule',
      },
      // Seguimiento y Monitoreo elaboracion Expediente
      {
        path: 'seguimiento-expediente/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/seguimiento-expediente/seguimiento-expediente.module#SeguimientoExpedienteModule',
      },
      // Adicional y Deductivo
      {
        path: 'adicional-deductivo-expediente/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/adicional-deductivo-expediente/adicional-deductivo-expediente.module#AdicionalDeductivoExpedienteModule',
      },
      // Aprobación y Liquidación
      {
        path: 'aprobacion-liquidacion-expediente/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/aprobacion-liquidacion-expediente/aprobacion-liquidacion-expediente.module#AprobacionLiquidacionExpedienteModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ExpedienteComponent]
})
export class ExpedienteModule { }
