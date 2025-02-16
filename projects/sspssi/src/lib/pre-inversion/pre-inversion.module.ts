import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PreInversionComponent } from './pre-inversion.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: PreInversionComponent,
    children: [
      // Información General del Proyecto
      {
        path: 'info-general/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/pre-inversion/info-general/info-general.module#InfoGeneralModule',
      },
      // Financiamiento
      {
        path: 'financiamiento/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/pre-inversion/financiamiento/financiamiento.module#FinanciamientoModule',
      },
      // Proceso de Selección
      {
        path: 'proceso-seleccion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/pre-inversion/proceso-seleccion/proceso-seleccion.module#ProcesoSeleccionModule',
      },
      // Seguimiento y Monitoreo elaboracion estudio Preinversion
      {
        path: 'seguimiento-preinversion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/pre-inversion/seguimiento-preinversion/seguimiento-preinversion.module#SeguimientoPreinversionModule',
      },
      /* // Adicional y Deductivo
      {
        path: 'adicional-deductivo-pre-inverison/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto:snip/:idMunicipalidad',
        loadChildren: '../../lib/expediente/adicional-deductivo-expediente/adicional-deductivo-expediente.module#AdicionalDeductivoExpedienteModule',
      }, */
      // Aprobación y Liquidación
      {
        path: 'aprobacion-liquidacion-preinversion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
        loadChildren: '../../lib/pre-inversion/aprobacion-liquidacion-preinversion/aprobacion-liquidacion-preinversion.module#AprobacionLiquidacionPreinversionModule'
      }
    ]
  },

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
  ],
  declarations: [PreInversionComponent]
})
export class PreInversionModule { }
