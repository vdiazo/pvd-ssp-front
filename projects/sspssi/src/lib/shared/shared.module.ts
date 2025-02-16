import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasClaimDirective } from '../auth/has-claim.directive';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InputFileComponent } from '../controles/input-file/input-file.component';
import { InputFileListadoComponent } from '../controles/input-file-listado/input-file-listado.component';
import { formatoFechaPipe, formatoMonedaPipe, formatoNumeroDecimalPipe } from '../../appSettings/pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { InformacionObraComponent } from '../proyecto/seguimiento-monitoreo/informacion-obra/informacion-obra.component';
import { PresupuestoAdicionalComponent } from '../proyecto/adicional-deductivo/presupuesto-adicional/presupuesto-adicional.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccionesSeguimientoMonitoreoComponent } from '../proyecto/seguimiento-monitoreo/acciones-seguimiento-monitoreo/acciones-seguimiento-monitoreo.component';
import { PeriodoParalizacionComponent } from '../proyecto/seguimiento-monitoreo/periodo-paralizacion/periodo-paralizacion.component';
import { AsignacionResponsableComponent } from '../proyecto/seguimiento-monitoreo/asignacion-responsable/asignacion-responsable.component';
import { CronogramaComponent } from '../proyecto/seguimiento-monitoreo/cronograma/cronograma.component';
import { ValorizacionesComponent } from '../proyecto/seguimiento-monitoreo/valorizaciones/valorizaciones.component';
import { DeductivosReduccionesComponent } from '../proyecto/adicional-deductivo/deductivos-reducciones/deductivos-reducciones.component';
import { RecepcionObraComponent } from '../proyecto/recepcion-liquidacion/recepcion-obra/recepcion-obra.component';
import { SeguimientoLiquidacionComponent } from '../proyecto/recepcion-liquidacion/seguimiento-liquidacion/seguimiento-liquidacion.component';
import { LiquidacionCierreMetasComponent } from '../proyecto/recepcion-liquidacion/liquidacion-cierre-metas/liquidacion-cierre-metas.component';
import { EjecutadaLiquidadaComponent } from '../proyecto/recepcion-liquidacion/liquidacion-cierre-metas/ejecutada-liquidada/ejecutada-liquidada.component';
import { TransferenciaFinancieraComponent } from '../proyecto/recepcion-liquidacion/liquidacion-cierre-metas/transferencia-financiera/transferencia-financiera.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalCrudProgramacionFinancieraComponent } from '../proyecto/seguimiento-monitoreo/cronograma-financiero/modal/modal-crud-programacion-financiera/modal-crud-programacion-financiera.component';
import { ModalCrudPrograFinancieraExpComponent } from '../expediente/seguimiento-expediente/cronograma-financiero-exp/modal/modal-crud-progra-financiera-exp/modal-crud-progra-financiera-exp.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalCrudAmpliacionPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-ampliacion-pre/modal-crud-ampliacion-pre.component';
import { ModalCrudResponsablesPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-responsables-pre/modal-crud-responsables-pre.component';
import { ModalCrudProgramacionFinancieraPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-programacion-financiera-pre/modal-crud-programacion-financiera-pre.component';
import { ModalCrudAvanceInformesPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-avance-informes-pre/modal-crud-avance-informes-pre.component';
import { ModalCrudAccionMonitoreoPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-accion-monitoreo-pre/modal-crud-accion-monitoreo-pre.component';
import { ModalCrudAdelantoDirectoPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-adelanto-directo-pre/modal-crud-adelanto-directo-pre.component';
import { ModalCrudProgramacionEstudioPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-programacion-estudio-pre/modal-crud-programacion-estudio-pre.component';
import { ModalCrudAprobacionLiquidacionEstudioPreComponent } from '../pre-inversion/aprobacion-liquidacion-preinversion/modals/modal-crud-aprobacion-liquidacion-estudio-pre/modal-crud-aprobacion-liquidacion-estudio-pre.component';
import { ModalCrudResponsablesElabEstudioPreComponent } from '../pre-inversion/aprobacion-liquidacion-preinversion/modals/modal-crud-responsables-elab-estudio-pre/modal-crud-responsables-elab-estudio-pre.component';
import { ModalCrudContratistaPreComponent } from '../pre-inversion/seguimiento-preinversion/modals/modal-crud-contratista-pre/modal-crud-contratista-pre.component';
import { LinkNubeDirective } from './directives/link-nube';

@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    NgSelectModule,
    UiSwitchModule,
    TooltipModule.forRoot(),
    TextMaskModule
  ],
  declarations: [
    HasClaimDirective,
    InputFileComponent,
    InputFileListadoComponent,
    formatoFechaPipe,
    formatoMonedaPipe,
    formatoNumeroDecimalPipe,
    InformacionObraComponent,
    PresupuestoAdicionalComponent,
    AccionesSeguimientoMonitoreoComponent,
    PeriodoParalizacionComponent,
    AsignacionResponsableComponent,
    CronogramaComponent,
    ValorizacionesComponent,
    DeductivosReduccionesComponent,
    RecepcionObraComponent,
    SeguimientoLiquidacionComponent,
    LiquidacionCierreMetasComponent,
    EjecutadaLiquidadaComponent,
    TransferenciaFinancieraComponent,

    // modal-obra
    ModalCrudProgramacionFinancieraComponent,

    // modal-expediente
    ModalCrudPrograFinancieraExpComponent,

    // modal preinversion
    ModalCrudAmpliacionPreComponent,
    ModalCrudResponsablesPreComponent,
    ModalCrudProgramacionEstudioPreComponent,
    ModalCrudProgramacionFinancieraPreComponent,
    ModalCrudAvanceInformesPreComponent,
    ModalCrudAccionMonitoreoPreComponent,
    ModalCrudAdelantoDirectoPreComponent,
    ModalCrudAprobacionLiquidacionEstudioPreComponent,
    ModalCrudResponsablesElabEstudioPreComponent,
    ModalCrudContratistaPreComponent,
    LinkNubeDirective
  ],
  exports: [
    // DIRECTIVAS
    HasClaimDirective,
    AccordionModule,
    InputFileComponent,
    InputFileListadoComponent,
    formatoFechaPipe,
    formatoMonedaPipe,
    formatoNumeroDecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgSelectModule,
    UiSwitchModule,
    InformacionObraComponent,
    PresupuestoAdicionalComponent,
    PaginationModule,
    AccionesSeguimientoMonitoreoComponent,
    PeriodoParalizacionComponent,
    AsignacionResponsableComponent,
    CronogramaComponent,
    ValorizacionesComponent,
    DeductivosReduccionesComponent,
    RecepcionObraComponent,
    SeguimientoLiquidacionComponent,
    LiquidacionCierreMetasComponent,
    EjecutadaLiquidadaComponent,
    TransferenciaFinancieraComponent,
    TooltipModule,
    TextMaskModule,

    // modals
    ModalCrudProgramacionFinancieraComponent,
    ModalCrudPrograFinancieraExpComponent,

    // modal preinversion
    ModalCrudAmpliacionPreComponent,
    ModalCrudResponsablesPreComponent,
    ModalCrudProgramacionEstudioPreComponent,
    ModalCrudProgramacionFinancieraPreComponent,
    ModalCrudAvanceInformesPreComponent,
    ModalCrudAccionMonitoreoPreComponent,
    ModalCrudAdelantoDirectoPreComponent,
    ModalCrudAprobacionLiquidacionEstudioPreComponent,
    ModalCrudResponsablesElabEstudioPreComponent,
    ModalCrudContratistaPreComponent,
    LinkNubeDirective
  ],
  entryComponents: [
    ModalCrudProgramacionFinancieraComponent,
    ModalCrudPrograFinancieraExpComponent,

    // modal preinversion
    ModalCrudAmpliacionPreComponent,
    ModalCrudResponsablesPreComponent,
    ModalCrudProgramacionEstudioPreComponent,
    ModalCrudProgramacionFinancieraPreComponent,
    ModalCrudAvanceInformesPreComponent,
    ModalCrudAccionMonitoreoPreComponent,
    ModalCrudAdelantoDirectoPreComponent,
    ModalCrudAprobacionLiquidacionEstudioPreComponent,
    ModalCrudResponsablesElabEstudioPreComponent,
    ModalCrudContratistaPreComponent,
  ]
})
export class SharedModule { }
