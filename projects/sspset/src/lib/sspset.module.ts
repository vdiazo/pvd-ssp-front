import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfoGeneralProyectoExpTecComponent } from './info-general-proyecto-exp-tec/info-general-proyecto-exp-tec.component';
//import { InfoFinancieraExpTecComponent } from './info-financiera-exp-tec/info-financiera-exp-tec.component';
import { MenuTabsComponent } from './menu-tabs/menu-tabs.component';

import {TabMenuModule} from 'primeng/tabmenu';
import { SeguimientoMonitoreoEjecucionExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/seguimiento-monitoreo-ejecucion-exp-tec.component';
import { RecepcionLiquidacionExpTecComponent } from './recepcion-liquidacion-exp-tec/recepcion-liquidacion-exp-tec.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalAmpliacionesComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/modales/modal-ampliaciones/modal-ampliaciones.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination'


//import {DropdownModule} from 'primeng/primeng';
// import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import {CalendarModule} from 'primeng/calendar';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
//import {FileUploadModule as FUModule} from 'primeng/fileupload';
import {InputTextareaModule} from 'primeng/inputtextarea';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { NgSelectModule } from '@ng-select/ng-select';



import { Funciones } from '../appSettings/funciones';

import {AccordionModule} from 'primeng/accordion';
import {FieldsetModule} from 'primeng/fieldset';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {KeyFilterModule} from 'primeng/keyfilter';

//import { ContratacionBienesServiciosExpTecComponent } from './proceso-seleccion-exp-tec/contratacion-bienes-servicios-exp-tec/contratacion-bienes-servicios-exp-tec.component';
//import { ContratacionConsultoriaExpTecComponent } from './proceso-seleccion-exp-tec/contratacion-consultoria-exp-tec/contratacion-consultoria-exp-tec.component';
//import { CostoProyectoExpTecComponent } from './info-financiera-exp-tec/costo-proyecto-exp-tec/costo-proyecto-exp-tec.component';
//import { CostoSeguimientoExpTecComponent } from './info-financiera-exp-tec/costo-seguimiento-exp-tec/costo-seguimiento-exp-tec.component';
//import { CostoTransferidoExpTecComponent } from './info-financiera-exp-tec/costo-transferido-exp-tec/costo-transferido-exp-tec.component';
//import { CostoConvenioExpTecComponent } from './info-financiera-exp-tec/costo-convenio-exp-tec/costo-convenio-exp-tec.component';
import { FileUploadModule } from 'ng2-file-upload';

import { HttpClientModule } from "@angular/common/http";
//import { ModalSupervisorComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/modales/modal-supervisor/modal-supervisor/modal-supervisor.component';
import { ModalInspectorComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/modales/modal-inspector/modal-inspector.component';
import { ModalSupervisorComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/modales/modal-supervisor/modal-supervisor.component';

//import { InputFileComponent } from './controles/input-file/input-file.component';
import { AsignacionResponsableExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/asignacion-responsable-exp-tec/asignacion-responsable-exp-tec.component';

import { SharedModule } from './shared/shared.module';

import { MatAutocompleteModule, MatInputModule, MatListModule } from '@angular/material';
import { MatIconModule } from "@angular/material/icon";



import { InformacionObraComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/informacion-obra/informacion-obra.component';
import { CronogramaExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/cronograma-exp-tec/cronograma-exp-tec.component';

import { ModalGarantiasComponent } from './proceso-seleccion-exp-tec/ver-resultados/modal-garantias/modal-garantias.component';
import { VerResultadosComponent } from './proceso-seleccion-exp-tec/ver-resultados/ver-resultados.component';

import { AuthService } from './auth/auth.service';
import { ProcesoSeleccionExpTecComponent } from './proceso-seleccion-exp-tec/proceso-seleccion-exp-tec.component';
import { ContratacionObraComponent } from './proceso-seleccion-exp-tec/contratacion-obra/contratacion-obra.component';
import { ContratacionConsultoriaComponent } from './proceso-seleccion-exp-tec/contratacion-consultoria/contratacion-consultoria.component';
import { ContratacionBienesServiciosComponent } from './proceso-seleccion-exp-tec/contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { ModalCronogramaComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/cronograma-exp-tec/modal-cronograma/modal-cronograma.component';
import { ModalUpdateCronogramaComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/cronograma-exp-tec/modal-update-cronograma/modal-update-cronograma.component';
import { ValorizacionesExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/valorizaciones-exp-tec/valorizaciones-exp-tec.component';
import { AccionesSeguimientoMonitoreoExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/acciones-seguimiento-monitoreo-exp-tec/acciones-seguimiento-monitoreo-exp-tec.component';
import { PeriodoParalizacionExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/periodo-paralizacion-exp-tec/periodo-paralizacion-exp-tec.component';
import { GaleriaComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/valorizaciones-exp-tec/galeria/galeria.component';
import { ModalRegistrarComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/valorizaciones-exp-tec/modal-registrar/modal-registrar.component';
import { ModalMontoTransferidoComponent } from './info-financiera-exp-tec/financiamiento/monto-transferido/modal-monto-transferido/modal-monto-transferido.component';
import { FinanciamientoComponent } from './info-financiera-exp-tec/financiamiento/financiamiento.component';
import { CostoProyectoComponent } from './info-financiera-exp-tec/financiamiento/costo-proyecto/costo-proyecto.component';
import { ListaConvenioComponent } from './info-financiera-exp-tec/financiamiento/lista-convenio/lista-convenio.component';
import { FuenteFinancieraComponent } from './info-financiera-exp-tec/financiamiento/fuente-financiera/fuente-financiera.component';
import { InformacionFinancieraComponent } from './info-financiera-exp-tec/financiamiento/informacion-financiera/informacion-financiera.component';
import { MontoConvenioComponent } from './info-financiera-exp-tec/financiamiento/monto-convenio/monto-convenio.component';
import { MontoTransferidoComponent } from './info-financiera-exp-tec/financiamiento/monto-transferido/monto-transferido.component';
import { ModalCreateComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/acciones-seguimiento-monitoreo-exp-tec/modal-create/modal-create.component';
import { ModalUpdateComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/acciones-seguimiento-monitoreo-exp-tec/modal-update/modal-update.component';
import { InputFileListadoComponent } from './controles/input-file-listado/input-file-listado.component';

import { ParalizacionAccionExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/paralizacion-accion-exp-tec/paralizacion-accion-exp-tec.component';
import { ParalizacionModalExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/paralizacion-modal-exp-tec/paralizacion-modal-exp-tec.component';
import { defineLocale } from 'ngx-bootstrap/chronos'; 
import { esLocale } from 'ngx-bootstrap/locale';
import { RecepcionObraExpTecComponent } from './recepcion-liquidacion-exp-tec/recepcion-obra-exp-tec/recepcion-obra-exp-tec.component';
import { SeguimientoLiquidacionExpTecComponent } from './recepcion-liquidacion-exp-tec/seguimiento-liquidacion-exp-tec/seguimiento-liquidacion-exp-tec.component';
import { LiquidacionModalExpTecComponent } from './recepcion-liquidacion-exp-tec/seguimiento-liquidacion-exp-tec/liquidacion-modal-exp-tec/liquidacion-modal-exp-tec.component';
import { RecepcionObraModalExpTecComponent } from './recepcion-liquidacion-exp-tec/recepcion-obra-exp-tec/recepcion-obra-modal-exp-tec/recepcion-obra-modal-exp-tec.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { EntregablesExpTecComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/entregables-exp-tec/entregables-exp-tec.component';
import { ModalEntregableComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/entregables-exp-tec/modal-entregable/modal-entregable.component';
import { ModalUpdateEntregableComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/entregables-exp-tec/modal-update-entregable/modal-update-entregable.component';
import { AvanceElaboracionExpedienteComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/avance-elaboracion-expediente/avance-elaboracion-expediente.component';
import { ModalAvanceEntregableComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/avance-elaboracion-expediente/modal-avance-entregable/modal-avance-entregable.component';
import { ModalUpdateAvanceEntregableComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/avance-elaboracion-expediente/modal-update-avance-entregable/modal-update-avance-entregable.component';
import { FormExpedienteComponent } from './recepcion-liquidacion-exp-tec/form-expediente/form-expediente.component';
import { ItemExpedienteComponent } from './recepcion-liquidacion-exp-tec/form-expediente/componentes/item-expediente/item-expediente.component';
import { InputReqComponent } from './controles/input-req/input-req.component';

import { DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule } from 'devextreme-angular';
import { ResponsablesExpedienteTecnicoComponent } from './recepcion-liquidacion-exp-tec/responsables-expediente-tecnico/responsables-expediente-tecnico.component';
import { ModalRegistrarResponsableComponent } from './recepcion-liquidacion-exp-tec/responsables-expediente-tecnico/modal-registrar-responsable/modal-registrar-responsable.component';
import { InputFileUploaderComponent } from './controles/input-file-uploader/input-file-uploader.component';
import { ModalSupervisorEstudioComponent } from './seguimiento-monitoreo-ejecucion-exp-tec/modales/modal-supervisor-estudio/modal-supervisor-estudio.component';
import { ModalAsociacionExpInteresComponent } from './proceso-seleccion-exp-tec/modal-asociacion-exp-interes/modal-asociacion-exp-interes.component';
import { ModalLoadingDownloadComponent } from './recepcion-liquidacion-exp-tec/form-expediente/modal-loading-download/modal-loading-download.component';
import { ResolucionContratoComponent } from './recepcion-liquidacion-exp-tec/resolucion-contrato/resolucion-contrato.component';
import { ModalResolucionContratoComponent } from './recepcion-liquidacion-exp-tec/resolucion-contrato/modal-resolucion-contrato/modal-resolucion-contrato.component';
import { ModalHistorialComponent } from './recepcion-liquidacion-exp-tec/resolucion-contrato/modal-historial/modal-historial.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

const routes: Routes = [
  {
    path: '',
    component: MenuTabsComponent,
    children: [
      {
        path: '',
        redirectTo: "infogeneral-exp-tec",
        pathMatch: "full"
      },
      {
        path: 'infogeneral-exp-tec',
        component: InfoGeneralProyectoExpTecComponent
        //loadChildren: "./info-general-proyecto-exp-tec/info-general-proyecto-exp-tec.component",
      },
      {
        path: 'financiamiento-exp-tec',
        component: FinanciamientoComponent,
        //loadChildren:"projects/sspset/src/lib/info-financiera-exp-tec/financiamiento/financiamiento.module#FinanciamientoModule"
      },
      {
        path: 'proceso-seleccion-exp-tec',
        component: ProcesoSeleccionExpTecComponent
        //loadChildren:"projects/sspset/src/lib/proceso-seleccion-exp-tec/proceso-seleccion-exp-tec.module#ProcesoSeleccioExpTecnModule",
        
      },
      {
        path: 'seguimiento-monitoreo-ejecucion-exp-tec',
        component: SeguimientoMonitoreoEjecucionExpTecComponent
        //loadChildren: "./info-financiera/info-financiera-exp-tec.component",
      },
      {
        path: 'recepcion-liquidacion-exp-tec',
        component: RecepcionLiquidacionExpTecComponent
        //loadChildren: "./info-financiera/info-financiera-exp-tec.component",
      },
      {
        path: 'resolucion-contrato',
        component: ResolucionContratoComponent
        //loadChildren: "./info-financiera/info-financiera-exp-tec.component",
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    TabMenuModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    DropdownModule,
    FileUploadModule,
    ModalModule.forRoot(),
    CalendarModule,
    NgSelectModule,
    InputTextModule,
    NgxPaginationModule,
    AccordionModule,
    FieldsetModule,
    ButtonModule,

    MatInputModule,
    MatListModule,
    MatAutocompleteModule,
    MatIconModule,

    InputTextareaModule,    
    KeyFilterModule, 
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    //FUModule,
    SharedModule,
    CarouselModule,
    DxFileUploaderModule,
    DxCheckBoxModule,
    DxSelectBoxModule

  ],
  entryComponents:[
    ModalAmpliacionesComponent,
    ModalInspectorComponent,
    ModalSupervisorComponent,
    ModalGarantiasComponent,
    VerResultadosComponent,
    ModalCronogramaComponent,
    ModalRegistrarComponent,
    ModalCreateComponent,
    ParalizacionModalExpTecComponent,
    LiquidacionModalExpTecComponent,
    RecepcionObraModalExpTecComponent,
    ModalUpdateComponent,
    ModalMontoTransferidoComponent,
    ModalUpdateCronogramaComponent,
    GaleriaComponent,
    ModalEntregableComponent,
    ModalUpdateEntregableComponent,
    ModalAvanceEntregableComponent,
    ModalUpdateAvanceEntregableComponent,
    ModalRegistrarResponsableComponent,
    ModalSupervisorEstudioComponent,
    ModalAsociacionExpInteresComponent,
    ModalLoadingDownloadComponent,
    ModalResolucionContratoComponent,
    ModalHistorialComponent,
    ResolucionContratoComponent
  ],
  //exports: [ RouterModule,MenuTabsComponent, InfoGeneralProyectoExpTecComponent,NgSelectModule ],
  declarations: [
    MenuTabsComponent, 
    InfoGeneralProyectoExpTecComponent, 
    //InfoFinancieraExpTecComponent, 
    SeguimientoMonitoreoEjecucionExpTecComponent, 
    RecepcionLiquidacionExpTecComponent, 
    ModalAmpliacionesComponent, 
    //ContratacionBienesServiciosExpTecComponent, 
    //ContratacionConsultoriaExpTecComponent, 
    /*CostoProyectoExpTecComponent, 
    CostoSeguimientoExpTecComponent, 
    CostoTransferidoExpTecComponent, 
    CostoConvenioExpTecComponent,*/ ModalInspectorComponent, ModalSupervisorComponent, AsignacionResponsableExpTecComponent,InformacionObraComponent, CronogramaExpTecComponent,
    ModalGarantiasComponent,
    VerResultadosComponent,
    ProcesoSeleccionExpTecComponent,
    ContratacionObraComponent,
    ContratacionConsultoriaComponent,
    ContratacionBienesServiciosComponent,

    ModalCronogramaComponent,
    ModalUpdateCronogramaComponent,
    ValorizacionesExpTecComponent,
    AccionesSeguimientoMonitoreoExpTecComponent,
    PeriodoParalizacionExpTecComponent,
    GaleriaComponent,
    ModalRegistrarComponent,

    ModalMontoTransferidoComponent,
    FinanciamientoComponent,
    CostoProyectoComponent,
    ListaConvenioComponent,
    FuenteFinancieraComponent,
    InformacionFinancieraComponent,
    MontoConvenioComponent,
    MontoTransferidoComponent,
    ModalCreateComponent,
    ModalUpdateComponent,
    InputFileListadoComponent,
    ParalizacionAccionExpTecComponent,
    ParalizacionModalExpTecComponent,
    RecepcionObraExpTecComponent,
    SeguimientoLiquidacionExpTecComponent,
    LiquidacionModalExpTecComponent,
    RecepcionObraModalExpTecComponent,
    EntregablesExpTecComponent,
    ModalEntregableComponent,
    ModalUpdateEntregableComponent,
    AvanceElaboracionExpedienteComponent,
    ModalAvanceEntregableComponent,
    ModalUpdateAvanceEntregableComponent,
    FormExpedienteComponent,
    ItemExpedienteComponent,
    InputReqComponent,
    ResponsablesExpedienteTecnicoComponent,
    ModalRegistrarResponsableComponent,
    InputFileUploaderComponent,
    ModalSupervisorEstudioComponent,
    ModalAsociacionExpInteresComponent,
    ModalLoadingDownloadComponent,
    ModalResolucionContratoComponent,
    ModalHistorialComponent,
    ResolucionContratoComponent
  ],
    providers:[
      Funciones,
      AuthService
    ]
})
export class SSPSETModule {
  constructor() {
    defineLocale('es', esLocale);
  }

 }