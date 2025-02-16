import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
//import { SafePipe } from './componentes/mapa/mapa.component';


import { BuscarProyectoModalComponent } from './componentes/buscar-proyecto-modal/buscar-proyecto-modal.component';


import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgxAccordionTableModule } from 'ngx-accordion-table'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'

import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './componentes/login/login.component';
import { AuthGuard } from './componentes/auth/auth.guard';
import { AuthService } from './componentes/auth/auth.service';


import { MatAutocompleteModule, MatInputModule, MatListModule } from '@angular/material';
import { MatIconModule } from "@angular/material/icon";
import { PagerService } from './appSettings';
import { EditarConvenioComponent } from './componentes/editar-convenio/editar-convenio.component';
import { AmpliacionModalComponent } from './componentes/ampliacion-modal/ampliacion-modal.component';
import { HttpModule } from '@angular/http';
import { ParalizacionAccionComponent } from './componentes/paralizacion-accion/paralizacion-accion.component';
import { ParalizacionModalComponent } from './componentes/paralizacion-modal/paralizacion-modal.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { ModalTramoComponent } from './componentes/modal-tramo/modal-tramo.component';
import { ModalUsuarioComponent } from './componentes/modal-usuario/modal-usuario.component';

import { Functions } from './appSettings/functions';
import { AuthInterceptor } from './componentes/auth/auth.interceptor';
import { ModalCambiarClaveComponent } from './componentes/modal-cambiar-clave/modal-cambiar-clave.component';
import { VerResultadosComponent } from './componentes/proceso-seleccion/ver-resultados/ver-resultados.component';
import { ModalCronogramaComponent } from './componentes/ejecucion-estado/cronograma/modal/modal.component';
import { ModalUpdateCronogramaComponent } from './componentes/ejecucion-estado/cronograma/modal-update/modal-update.component';

import { RecepcionObraModalComponent } from './componentes/recepcion-liquidacion/recepcion-obra/recepcion-obra-modal/recepcion-obra-modal.component';
import { LiquidacionModalComponent } from './componentes/recepcion-liquidacion/seguimiento-liquidacion/liquidacion-modal/liquidacion-modal.component';

import { TextMaskModule } from 'angular2-text-mask';
import { ModalAccesoComponent } from './componentes/buscar-acceso/modal-acceso/modal-acceso.component'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ModalMenuComponent } from './componentes/buscar-menu/modal-menu/modal-menu.component';
/*
 * Fin de Importación de controles
*/
import { LogonComponent } from './componentes/logon/logon.component';
import { ModalGarantiasComponent } from './componentes/proceso-seleccion/ver-resultados/modal-garantias/modal-garantias.component';
import { RoleGuardService } from './componentes/auth/role-guard.service';
import { TransferenciasModalComponent } from './componentes/transferencias/transferencias-seleccion/transferencias-modal/transferencias-modal.component';



import { ModalSupervisorComponent } from './componentes/ejecucion-estado/asignacion-responsable/modal-supervisor/modal-supervisor.component';
import { ModalResidenteComponent } from './componentes/ejecucion-estado/asignacion-responsable/modal-residente/modal-residente.component';
import { ModalInspectorComponent } from './componentes/ejecucion-estado/asignacion-responsable/modal-inspector/modal-inspector.component';

import { ModalCreateComponent } from './componentes/ejecucion-estado/acciones-seguimiento-monitoreo/modal-create/modal-create.component';
import { ModalUpdateComponent } from './componentes/ejecucion-estado/acciones-seguimiento-monitoreo/modal-update/modal-update.component';
import { ModalRegistrarComponent } from './componentes/ejecucion-estado/valorizaciones/modal-valorizaciones/modal-registrar.component';

import { MapaComponent } from './componentes/mapa/mapa.component';

import { DatePipe } from '../../node_modules/@angular/common';
import { ModalPDFComponent } from './componentes/modal-pdf/modal-pdf.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalDeductivosReduccionesComponent } from './componentes/informacion-complementaria/deductivos-reducciones/modal-deductivos-reducciones/modal-deductivos-reducciones.component';
import { ModalPresupuestoAdicionalComponent } from './componentes/informacion-complementaria/presupuesto-adicional/modal-presupuesto-adicional/modal-presupuesto-adicional.component';

import { GaleriaComponent } from './componentes/ejecucion-estado/valorizaciones/galeria/galeria.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalAsignarMenuComponent } from './componentes/buscar-perfil/modal-asignar-menu/modal-asignar-menu.component';
import { ModalAsignarMenuComponenteComponent } from './componentes/buscar-perfil/modal-asignar-menu-componente/modal-asignar-menu-componente.component';
import { ModalAgregarComponenteComponent } from './componentes/buscar-perfil/modal-asignar-menu-componente/modal-agregar-componente/modal-agregar-componente.component';

import { SharedModule } from './shared/shared.module';
import { ModalPerfilesComponent } from './componentes/buscar-perfil/modal-perfiles/modal-perfiles.component';
import { ModalComponentesComponent } from './componentes/buscar-componentes/modal-componentes/modal-componentes.component';
import { ModalPerfilComponent } from './componentes/login/modal-perfil/modal-perfil.component';
import { ModalMontoTransferidoComponent } from './componentes/info-financiera/monto-transferido/modal-monto-transferido/modal-monto-transferido.component';


import { ModalGeoComponent } from './componentes/buscar-geo/modal-geo/modal-geo.component';
import { ModalIframeGeoComponent } from './componentes/buscar-geo/modal-iframe-geo/modal-iframe-geo.component';

import { ModalAdelantoDirectoComponent } from './componentes/ejecucion-estado/modal-adelanto-directo/modal-adelanto-directo.component';
import { ModalAdelantoMaterialesComponent } from './componentes/ejecucion-estado/modal-adelanto-materiales/modal-adelanto-materiales.component';
import { ModalColaboradorComponent } from './componentes/colaboradores/modal-colaborador/modal-colaborador.component';
import { InformacionComplementariaComponent } from './componentes/informacion-complementaria/informacion-complementaria.component';
import { PresupuestoAdicionalComponent } from './componentes/informacion-complementaria/presupuesto-adicional/presupuesto-adicional.component';
import { DeductivosReduccionesComponent } from './componentes/informacion-complementaria/deductivos-reducciones/deductivos-reducciones.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

import { SuspensionModalComponent } from './componentes/ejecucion-estado/periodo-suspension/suspension-modal/suspension-modal.component';
import { SuspensionAccionComponent } from './componentes/ejecucion-estado/periodo-suspension/suspension-accion/suspension-accion.component';
import { ModalAsociacionExpInteresComponent } from './componentes/proceso-seleccion/modal-asociacion-exp-interes/modal-asociacion-exp-interes.component';

import { InfoObrasValorizacionesComponent } from './componentes/ejecucion-estado/valorizaciones/info-obras-valorizaciones/info-obras-valorizaciones.component';
import { ModalInformeContraloriaComponent } from './componentes/ejecucion-estado/valorizaciones/modal-informe-contraloria/modal-informe-contraloria.component';
//import { ModalCapacitacionComponent } from './componentes/buscar-auto-capacitacion/modal-capacitacion/modal-capacitacion.component';
import { ModalGatewayComponent } from './modales/modal-gateway/modal-gateway.component';
import { ModalCapacitacionComponent } from './componentes/buscar-auto-capacitacion/modal-capacitacion/modal-capacitacion.component';
import { ModalAsignarHijosComponent } from './componentes/buscar-perfil/modal-asignar-hijos/modal-asignar-hijos.component';
import { ModalPerfilHijosComponent } from './componentes/buscar-perfil/modal-perfil-hijos/modal-perfil-hijos.component';
import { TranfmefseleccionmodalComponent } from './componentes/transferencias/transferencias-mef/tranfmefseleccionmodal/tranfmefseleccionmodal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    LoginComponent,
    LogonComponent,

    // ContratoObraComponent,
    // EjecucionEstadoComponent,

    // StyleLabelsDirective,
    // StyleLabelsReadDirective,
    // StyleTitlesDirective,
    // StyleTextBoxsDirective,
    // StyleDropDownsDirective,
    // StyleButtonsDirective,
    // StyleModalHeadDirective,
    // StyleReferenceDirective,
    // StyleReferenceIconoDirective,
    // StyleTableDetalleDirective,

    BuscarProyectoModalComponent,
    EditarConvenioComponent,
    AmpliacionModalComponent,
    ParalizacionAccionComponent,
    ParalizacionModalComponent,
    ModalRegistrarComponent,

    ModalTramoComponent,
    ModalUsuarioComponent,
    ModalCambiarClaveComponent,
    VerResultadosComponent,
    ModalCronogramaComponent,
    ModalUpdateCronogramaComponent,
    // LiquidacionCierreMetasComponent,------------------- NO SE USA
    // ProgramadaSegunExpedienteComponent,---------------- NO SE USA
    // EjecutadaLiquidadaComponent,----------------------- NO SE USA
    RecepcionObraModalComponent,
    LiquidacionModalComponent,
    ModalMontoTransferidoComponent,
    ModalAccesoComponent,
    ModalPerfilComponent,
    ModalMenuComponent,
    // LogonComponent,
    ModalGarantiasComponent,
    TransferenciasModalComponent,
    ModalSupervisorComponent,
    ModalResidenteComponent,
    ModalInspectorComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    MapaComponent,
    ModalPDFComponent,
    //SafePipe,
    ModalDeductivosReduccionesComponent,
    ModalPresupuestoAdicionalComponent,
    ModalPerfilesComponent,
    ModalComponentesComponent,
    GaleriaComponent,
    ModalAsignarMenuComponent,
    ModalAsignarMenuComponenteComponent,
    ModalAgregarComponenteComponent,
    // ModalPerfilesComponent,
    // ModalComponentesComponent,
    // ReporteAltaDireccionComponent,
    GaleriaComponent,
    //UnidadesEjecutorasComponent,
    ModalGeoComponent,
    ModalIframeGeoComponent,
    //UnidadesEjecutorasComponent
    ModalAdelantoDirectoComponent,
    ModalAdelantoMaterialesComponent,
    ModalColaboradorComponent,

    SuspensionModalComponent,
    SuspensionAccionComponent,
    ModalAsociacionExpInteresComponent,

    InfoObrasValorizacionesComponent,
    ModalInformeContraloriaComponent,
    ModalCapacitacionComponent,
    ModalGatewayComponent,
    ModalAsignarHijosComponent, ModalPerfilHijosComponent, TranfmefseleccionmodalComponent, 
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    NgxAccordionTableModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpModule,
    SweetAlert2Module.forRoot(),
    PerfectScrollbarModule,
    PDFExportModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot()
  ],
  entryComponents: [
    BuscarProyectoModalComponent,
    AmpliacionModalComponent,
    EditarConvenioComponent,
    ParalizacionAccionComponent,
    ParalizacionModalComponent,
    ModalRegistrarComponent,
    ModalTramoComponent,
    ModalUsuarioComponent,
    ModalCambiarClaveComponent,
    VerResultadosComponent,
    ModalCronogramaComponent,
    ModalUpdateCronogramaComponent,
    RecepcionObraModalComponent,
    LiquidacionModalComponent,
    ModalMontoTransferidoComponent,
    ModalAccesoComponent,
    ModalPerfilComponent,
    ModalMenuComponent,
    ModalGarantiasComponent,
    TransferenciasModalComponent,
    ModalSupervisorComponent,
    ModalResidenteComponent,
    ModalInspectorComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    MapaComponent,
    ModalPDFComponent,
    ModalDeductivosReduccionesComponent,
    ModalPresupuestoAdicionalComponent,
    ModalPerfilesComponent,
    ModalComponentesComponent,
    GaleriaComponent,
    ModalAsignarMenuComponent,
    ModalAsignarMenuComponenteComponent,
    ModalAgregarComponenteComponent,
    // ModalPerfilesComponent,
    // ModalComponentesComponent,
    GaleriaComponent,
    ModalGeoComponent,
    ModalIframeGeoComponent,
    ModalAdelantoDirectoComponent,
    ModalAdelantoMaterialesComponent,
    ModalColaboradorComponent,
    ModalRegistrarComponent,
    
    SuspensionModalComponent,
    SuspensionAccionComponent,
    ModalAsociacionExpInteresComponent,

    InfoObrasValorizacionesComponent,
    ModalInformeContraloriaComponent,

    ModalCapacitacionComponent,
    ModalGatewayComponent,
    ModalAsignarHijosComponent, ModalPerfilHijosComponent,
    TranfmefseleccionmodalComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthService, AuthGuard, PagerService, Functions, RoleGuardService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    defineLocale('es', esLocale);
  }
} 
