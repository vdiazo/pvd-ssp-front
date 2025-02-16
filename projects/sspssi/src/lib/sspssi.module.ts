import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SspssiComponent } from './sspssi.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalRegistroConvenioComponent } from './convenio/modal-registro-convenio/modal-registro-convenio.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
// shared
// import { NgSelectModule } from '@ng-select/ng-select';
// import { HasClaimDirective } from '../auth/has-claim.directive';

import { SafePipe } from '../appSettings/pipes';

import { Functions } from '../appSettings/functions';
// import { AuthService } from '../auth/auth.service';
// import { AuthGuard } from '../auth/auth.guard';
// import { RoleGuardService } from '../auth/role-guard.service';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
// import { InputFileComponent } from './controles/input-file/input-file.component';
import { MapaComponent } from './mapa/mapa.component';
import { ModalPdfComponent } from './modal-pdf/modal-pdf.component';
import { MatIconModule } from '@angular/material/icon';
import { SspssiInterceptor } from './sspssi.interceptor';
import { SspssiRoleGuardService } from './auth/sspssirole-guard.service';
import { MatAutocompleteModule, MatInputModule, MatListModule } from '@angular/material';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { VerResultadosComponent } from './proyecto/proceso-seleccion/ver-resultados/ver-resultados.component';
import { ModalGarantiasComponent } from './proyecto/proceso-seleccion/ver-resultados/modal-garantias/modal-garantias.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './auth/auth.service';
import { ModalCreateComponent } from './proyecto/seguimiento-monitoreo/acciones-seguimiento-monitoreo/modal-create/modal-create.component';
import { ModalUpdateComponent } from './proyecto/seguimiento-monitoreo/acciones-seguimiento-monitoreo/modal-update/modal-update.component';
import { AmpliacionModalComponent } from './proyecto/seguimiento-monitoreo/ampliacion-modal/ampliacion-modal.component';
import { ModalInspectorComponent } from './proyecto/seguimiento-monitoreo/asignacion-responsable/modal-inspector/modal-inspector.component';
import { ModalResidenteComponent } from './proyecto/seguimiento-monitoreo/asignacion-responsable/modal-residente/modal-residente.component';
import { ModalSupervisorComponent } from './proyecto/seguimiento-monitoreo/asignacion-responsable/modal-supervisor/modal-supervisor.component';
import { ModalCronogramaComponent } from './proyecto/seguimiento-monitoreo/cronograma/modal/modal.component';
import { ModalUpdateCronogramaComponent } from './proyecto/seguimiento-monitoreo/cronograma/modal-update/modal-update.component';
import { ModalAdelantoDirectoComponent } from './proyecto/seguimiento-monitoreo/modal-adelanto-directo/modal-adelanto-directo.component';
import { ModalAdelantoMaterialesComponent } from './proyecto/seguimiento-monitoreo/modal-adelanto-materiales/modal-adelanto-materiales.component';
import { ParalizacionModalComponent } from './proyecto/seguimiento-monitoreo/paralizacion-modal/paralizacion-modal.component';
import { ModalRegistrarComponent } from './proyecto/seguimiento-monitoreo/valorizaciones/modal-valorizaciones/modal-registrar.component';
import { GaleriaComponent } from './proyecto/seguimiento-monitoreo/valorizaciones/galeria/galeria.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RecepcionObraModalComponent } from './proyecto/recepcion-liquidacion/recepcion-obra/recepcion-obra-modal/recepcion-obra-modal.component';
import { LiquidacionModalComponent } from './proyecto/recepcion-liquidacion/seguimiento-liquidacion/liquidacion-modal/liquidacion-modal.component';
import { ModalDeductivosReduccionesComponent } from './proyecto/adicional-deductivo/deductivos-reducciones/modal-deductivos-reducciones/modal-deductivos-reducciones.component';
import { ModalPresupuestoAdicionalComponent } from './proyecto/adicional-deductivo/presupuesto-adicional/modal-presupuesto-adicional/modal-presupuesto-adicional.component';
import { ParalizacionAccionComponent } from './proyecto/seguimiento-monitoreo/paralizacion-accion/paralizacion-accion.component';
import { ModalContratistaComponent } from './proyecto/seguimiento-monitoreo/asignacion-responsable/modal-contratista/modal-contratista.component';
import { ExcelService } from './info-principal/exportar-reporte/reporte-principal';
import { CierreTransfFisicaModalComponent } from './proyecto/recepcion-liquidacion/liquidacion-cierre-metas/ejecutada-liquidada/cierre-transf-fisica-modal/cierre-transf-fisica-modal.component';
import { CierreTransfFinancieraModalComponent } from './proyecto/recepcion-liquidacion/liquidacion-cierre-metas/transferencia-financiera/cierre-transf-financiera-modal/cierre-transf-financiera-modal.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { DxPieChartModule, DxChartModule } from 'devextreme-angular';
import { ModalGarantiasExpComponent } from './expediente/proceso-seleccion/ver-resultado/modal-garantias-exp/modal-garantias-exp.component';
import { ModalAdelantoExpedienteComponent } from './expediente/seguimiento-expediente/informacion-expediente/modal-adelanto-expediente/modal-adelanto-expediente.component';
import { ModalEntregaTerrenoComponent } from './expediente/seguimiento-expediente/informacion-expediente/modal-entrega-terreno/modal-entrega-terreno.component';
import { ModalAmpliacionExpedienteComponent } from './expediente/seguimiento-expediente/informacion-expediente/modal-ampliacion-expediente/modal-ampliacion-expediente.component';
import { ModalContratistaExpedienteComponent } from './expediente/seguimiento-expediente/responsables-expediente/modal-contratista-expediente/modal-contratista-expediente.component';
import { ModalAdministradorExpedienteComponent } from './expediente/seguimiento-expediente/responsables-expediente/modal-administrador-expediente/modal-administrador-expediente.component';
import { ModalCronogramaExpedienteComponent } from './expediente/seguimiento-expediente/cronograma-expediente/modal-cronograma-expediente/modal-cronograma-expediente.component';
import { ModalEntregableExpedienteComponent } from './expediente/seguimiento-expediente/entregables-expediente/modal-entregable-expediente/modal-entregable-expediente.component';
import { ModalGatewayComponent } from './modales/modal-gateway/modal-gateway.component';
import { ModalEdicionTramoComponent } from './buscar-tramo/modal-edicion-tramo/modal-edicion-tramo.component';
import { ModalRegistroGeoComponent } from './buscar-geo-tramo/modal-registro-geo/modal-registro-geo.component';
import { ModalVerGeoComponent } from './buscar-geo-tramo/modal-ver-geo/modal-ver-geo.component';
import { VerResultadoComponent } from './expediente/proceso-seleccion/ver-resultado/ver-resultado.component';
import { ModalAccionSeguimientoExpedienteComponent } from './expediente/seguimiento-expediente/acciones-seguimiento-expediente/modal-accion-seguimiento-expediente/modal-accion-seguimiento-expediente.component';
import { ModalParalizacionExpedienteComponent } from './expediente/seguimiento-expediente/periodo-paralizacion-expediente/modal-paralizacion-expediente/modal-paralizacion-expediente.component';
import { ModalAdicionalExpedienteComponent } from './expediente/adicional-deductivo-expediente/adicional-expediente/modal-adicional-expediente/modal-adicional-expediente.component';
import { ModalDeductivoExpedienteComponent } from './expediente/adicional-deductivo-expediente/deductivo-expediente/modal-deductivo-expediente/modal-deductivo-expediente.component';
import { ModalAprobacionExpedienteComponent } from './expediente/aprobacion-liquidacion-expediente/aprobacion-expediente/modal-aprobacion-expediente/modal-aprobacion-expediente.component';
import { ModalMetasExpedienteComponent } from './expediente/aprobacion-liquidacion-expediente/aprobacion-expediente/modal-metas-expediente/modal-metas-expediente.component';
import { ModalLiquidacionExpedienteComponent } from './expediente/aprobacion-liquidacion-expediente/liquidacion-expediente/modal-liquidacion-expediente/modal-liquidacion-expediente.component';
import { ModalAccionParalizacionExpComponent } from './expediente/seguimiento-expediente/periodo-paralizacion-expediente/modal-accion-paralizacion-exp/modal-accion-paralizacion-exp.component';
// import { ModalGatewayComponent } from './modales/modal-gateway/modal-gateway.component';
import { EstadoFinancieroComponent } from './expediente/seguimiento-expediente/estado-financiero/estado-financiero.component';
import { AsociacionExpresionInteresComponent } from './proyecto/proceso-seleccion/asociacion-expresion-interes/asociacion-expresion-interes.component';
import { ModalValorizacionesInfobrasComponent } from './proyecto/seguimiento-monitoreo/valorizaciones/modal-valorizaciones-infobras/modal-valorizaciones-infobras.component';
import { ModalRegistroTramoComponent } from './convenio/modal-registro-tramo/modal-registro-tramo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'monitoreo',
        // component: InfoPrincipalComponent,
        loadChildren: './info-principal/info-principal.module#InfoPrincipalModule',
        // canActivate: [SspssiRoleGuardService]
      },
      { path: 'convenios', loadChildren: './convenio/convenio.module#ConvenioModule', canActivate: [SspssiRoleGuardService] },
      { path: 'proyecto', loadChildren: './proyecto/proyecto.module#ProyectoModule' },
      { path: 'expediente', loadChildren: './expediente/expediente.module#ExpedienteModule' },
      { path: 'preinversion', loadChildren: './pre-inversion/pre-inversion.module#PreInversionModule' },
      { path: 'buscartramo', loadChildren: './buscar-tramo/buscar-tramo.module#BuscarTramoModule' },
      { path: 'buscargeo', loadChildren: './buscar-geo-tramo/buscar-geo-tramo.module#BuscarGeoTramoModule' },
      { path: 'reportefinanciero', loadChildren: './proyecto/reporte-financiero/reporte-financiero.module#ReporteFinancieroModule' },
      { path: 'planillon', loadChildren: './planillon/planillon.module#PlanillonModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    TextMaskModule,
    // BrowserModule,
    // NoopAnimationsModule,
    // FormsModule,
    // ReactiveFormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatAutocompleteModule, MatInputModule, MatListModule,
    // NgSelectModule,
    PDFExportModule,
    CarouselModule,
    SharedModule,
    DxPieChartModule,
    DxChartModule
  ],
  declarations: [
    HomeLayoutComponent,
    ModalRegistroConvenioComponent,
    ModalRegistroTramoComponent,
    SspssiComponent,
    MapaComponent,
    ModalPdfComponent,
    SafePipe,
    VerResultadosComponent,
    ModalGarantiasComponent,
    AsociacionExpresionInteresComponent,

    ModalCreateComponent,
    ModalUpdateComponent,
    AmpliacionModalComponent,
    ModalInspectorComponent,
    ModalResidenteComponent,
    ModalSupervisorComponent,
    ModalContratistaComponent,
    ModalCronogramaComponent,
    ModalUpdateCronogramaComponent,
    ModalAdelantoDirectoComponent,
    ModalAdelantoMaterialesComponent,
    ParalizacionModalComponent,
    ModalRegistrarComponent,
    GaleriaComponent,
    ModalValorizacionesInfobrasComponent,
    RecepcionObraModalComponent,
    LiquidacionModalComponent,
    ModalDeductivosReduccionesComponent,
    ModalPresupuestoAdicionalComponent,
    ParalizacionAccionComponent,
    CierreTransfFisicaModalComponent,
    CierreTransfFinancieraModalComponent,
    DashboardComponent,
    ModalGatewayComponent,
    ModalEdicionTramoComponent,
    ModalRegistroGeoComponent,
    ModalVerGeoComponent,
    // EXPEDIENTE
    VerResultadoComponent,
    ModalEntregaTerrenoComponent,
    ModalGarantiasExpComponent,
    ModalAdelantoExpedienteComponent,
    ModalAmpliacionExpedienteComponent,
    ModalContratistaExpedienteComponent,
    ModalAdministradorExpedienteComponent,
    ModalCronogramaExpedienteComponent,
    ModalEntregableExpedienteComponent,
    ModalAccionSeguimientoExpedienteComponent,
    ModalParalizacionExpedienteComponent,
    ModalAccionParalizacionExpComponent,
    ModalAdicionalExpedienteComponent,
    ModalDeductivoExpedienteComponent,
    ModalAprobacionExpedienteComponent,
    ModalMetasExpedienteComponent,
    ModalLiquidacionExpedienteComponent,
    EstadoFinancieroComponent
  ],
  exports: [
    HomeLayoutComponent,
    RouterModule,
    // NgSelectModule,
    // BsDatepickerModule,
    SafePipe,
    DxPieChartModule,
    DxChartModule,
    TextMaskModule
  ],
  entryComponents: [
    ModalRegistroConvenioComponent,
    ModalRegistroTramoComponent,
    ModalPdfComponent,
    VerResultadosComponent,
    ModalGarantiasComponent,
    AsociacionExpresionInteresComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    AmpliacionModalComponent,
    ModalInspectorComponent,
    ModalResidenteComponent,
    ModalSupervisorComponent,
    ModalContratistaComponent,
    ModalCronogramaComponent,
    ModalUpdateCronogramaComponent,
    ModalAdelantoDirectoComponent,
    ModalAdelantoMaterialesComponent,
    ParalizacionModalComponent,
    ModalRegistrarComponent,
    GaleriaComponent,
    ModalValorizacionesInfobrasComponent,
    RecepcionObraModalComponent,
    LiquidacionModalComponent,
    ModalDeductivosReduccionesComponent,
    ModalPresupuestoAdicionalComponent,
    ParalizacionAccionComponent,
    CierreTransfFisicaModalComponent,
    CierreTransfFinancieraModalComponent,
    ModalGatewayComponent,
    ModalEdicionTramoComponent,
    ModalRegistroGeoComponent,
    ModalVerGeoComponent,
    MapaComponent,
    // EXPEDIENTE
    VerResultadoComponent,
    ModalEntregaTerrenoComponent,
    ModalGarantiasExpComponent,
    ModalAdelantoExpedienteComponent,
    ModalAmpliacionExpedienteComponent,
    ModalContratistaExpedienteComponent,
    ModalAdministradorExpedienteComponent,
    ModalCronogramaExpedienteComponent,
    ModalEntregableExpedienteComponent,
    ModalAccionSeguimientoExpedienteComponent,
    ModalParalizacionExpedienteComponent,
    ModalAccionParalizacionExpComponent,
    ModalAdicionalExpedienteComponent,
    ModalDeductivoExpedienteComponent,
    ModalAprobacionExpedienteComponent,
    ModalMetasExpedienteComponent,
    ModalLiquidacionExpedienteComponent,
    EstadoFinancieroComponent
  ],

  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: SspssiInterceptor, multi: true } ,
    // AuthGuard,
    // AuthService,
    SspssiRoleGuardService,
    Functions,
    HttpClientModule,
    DatePipe,
    AuthService,
    ExcelService,
    TextMaskModule
  ],
  bootstrap: [SspssiComponent]
})
export class SspssiModule {
  constructor() {
    defineLocale('es', esLocale);
  }
}
