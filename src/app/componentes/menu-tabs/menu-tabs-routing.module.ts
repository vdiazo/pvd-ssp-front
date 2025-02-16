// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { InfoGeneralProyectoComponent } from '../info-general-proyecto/info-general-proyecto.component';
// import { MenuTabsComponent } from './menu-tabs.component';
// import { InfoFinancieraComponent } from '../info-financiera/info-financiera.component';
// import { ProcesoSeleccionComponent } from '../proceso-seleccion/proceso-seleccion.component';
// import { EjecucionEstadoComponent } from '../ejecucion-estado/ejecucion-estado.component';
// import { InformacionComplementariaComponent } from '../informacion-complementaria/informacion-complementaria.component';
// import { RecepcionLiquidacionComponent } from '../recepcion-liquidacion/recepcion-liquidacion.component';

// const routes: Routes = [
//   { path: '/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad', component: MenuTabsComponent,
//   children:[
//     {
//       path: 'informacion-general/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//       component: InfoGeneralProyectoComponent
//     },
//     {
//       path: 'financiamiento/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//       component: InfoFinancieraComponent
//     },
//     {
//       path: 'proceso-seleccion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//       component: ProcesoSeleccionComponent
//     },
//     {
//         path: 'seguimiento-monitoreo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//         component: EjecucionEstadoComponent
//       },
//       {
//         path: 'adicional-deductivo/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//         component: InformacionComplementariaComponent
//       },
//       {
//         path: 'recepcion-liquidacion/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad',
//         component: RecepcionLiquidacionComponent
//       }
//   ],
// },
    
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class MenuTabsRoutingModule { }
