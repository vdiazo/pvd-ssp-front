import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuTabsComponent } from './menu-tabs.component';

import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { InformacionComplementariaComponent } from '../informacion-complementaria/informacion-complementaria.component';
import { PresupuestoAdicionalComponent } from '../informacion-complementaria/presupuesto-adicional/presupuesto-adicional.component';
import { DeductivosReduccionesComponent } from '../informacion-complementaria/deductivos-reducciones/deductivos-reducciones.component';

const routes: Routes = [

  { path: '',
   component: MenuTabsComponent,
  children:[
      {
        path: 'infogeneral/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/info-general-proyecto/info-general-proyecto.module#InfoGeneralProyectoModule",
      },
      {
        path: 'financiamiento/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/info-financiera/info-financiera.module#InfoFinancieraModule",
      },
      {
        path: 'proceso-seleccion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/proceso-seleccion/proceso-seleccion.module#ProcesoSeleccionModule",
      },
      {
        path: 'seguimiento-monitoreo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/ejecucion-estado/ejecucion-estado.module#EjecucionEstadoModule",
      },
      {
        path: 'adicional-deductivo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/informacion-complementaria/informacion-complementaria.module#InformacionComplementariaModule",
        // component: InformacionComplementariaComponent
      },
      {
        path: 'recepcion-liquidacion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "../../componentes/recepcion-liquidacion/recepcion-liquidacion.module#RecepcionLiquidacionModule",
      },
       {
         path: 'resolucion-contrato/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
         loadChildren: "../../componentes/recepcion-liquidacion/resolucion-contrato/resolucion-contrato.module#ResolucionContratoModule",
       }      
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
    //SSPSETModule
  ],
  providers: [PagerService],
  declarations: [
    MenuTabsComponent    
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
export class MenuTabsModule { }
