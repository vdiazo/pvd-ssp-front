import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasClaimDirective } from '../componentes/auth/has-claim.directive';
//import { MapaComponent, SafePipe } from '../componentes/mapa/mapa.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
//import { SafePipe } from '../componentes/mapa/mapa.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputFileComponent } from '../controles/input-file/input-file.component';
import { InputFileListadoComponent } from '../controles/input-file-listado/input-file-listado.component';
import { formatoFechaPipe, formatoMonedaPipe, SafePipe } from '../appSettings/pipes';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { StyleTitlesDirective } from '../directives/titles.directive';
import { StyleLabelsReadDirective } from '../directives/labelsRead.directive';
import { StyleTextBoxsDirective } from '../directives/textBox.directive';
import { StyleLabelsDirective } from '../directives/labels.directive';
import { StyleDropDownsDirective } from '../directives/dropDown.directive';
import { StyleModalHeadDirective } from '../directives/modal.head.directive';
import { StyleButtonsDirective } from '../directives/button.directive';
import { StyleReferenceDirective } from '../directives/reference.directive';
import { StyleReferenceIconoDirective } from '../directives/reference.icono.directive';
import { StyleTableDetalleDirective } from '../directives/table.detalle.directive';
import { TreeviewModule } from 'ngx-treeview';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';
import { InformacionComplementariaComponent } from '../componentes/informacion-complementaria/informacion-complementaria.component';
import { PresupuestoAdicionalComponent } from '../componentes/informacion-complementaria/presupuesto-adicional/presupuesto-adicional.component';
import { DeductivosReduccionesComponent } from '../componentes/informacion-complementaria/deductivos-reducciones/deductivos-reducciones.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CronogramaComponent } from '../componentes/ejecucion-estado/cronograma/cronograma.component';
import { AccionesSeguimientoMonitoreoComponent } from '../componentes/ejecucion-estado/acciones-seguimiento-monitoreo/acciones-seguimiento-monitoreo.component';
import { PeriodoParalizacionComponent } from '../componentes/ejecucion-estado/periodo-paralizacion/periodo-paralizacion.component';
import { PeriodoSuspensionComponent } from '../componentes/ejecucion-estado/periodo-suspension/periodo-suspension.component';

import { AsignacionResponsableComponent } from '../componentes/ejecucion-estado/asignacion-responsable/asignacion-responsable.component';
import { ValorizacionesComponent } from '../componentes/ejecucion-estado/valorizaciones/valorizaciones.component';
import { InformacionObraComponent } from '../componentes/ejecucion-estado/informacion-obra/informacion-obra.component';
import { RecepcionObraComponent } from '../componentes/recepcion-liquidacion/recepcion-obra/recepcion-obra.component';
import { RecepcionLiquidacionComponent } from '../componentes/recepcion-liquidacion/recepcion-liquidacion.component';
import { SeguimientoLiquidacionComponent } from '../componentes/recepcion-liquidacion/seguimiento-liquidacion/seguimiento-liquidacion.component';
import { LiquidacionCierreMetasComponent } from '../componentes/recepcion-liquidacion/liquidacion-cierre-metas/liquidacion-cierre-metas.component';
import { EjecutadaLiquidadaComponent } from '../componentes/recepcion-liquidacion/liquidacion-cierre-metas/ejecutada-liquidada/ejecutada-liquidada.component';
import { ProgramadaSegunExpedienteComponent } from '../componentes/recepcion-liquidacion/liquidacion-cierre-metas/programada-segun-expediente/programada-segun-expediente.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TextMaskModule } from 'angular2-text-mask';
import { LinkNubeDirective } from '../directives/link-nube';

@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    UiSwitchModule,
    TreeviewModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    MatIconModule,
    MatListModule,
    TextMaskModule
  ],
  declarations: [
    HasClaimDirective,
    InputFileComponent,
    InputFileListadoComponent,
    formatoFechaPipe,
    formatoMonedaPipe,
    StyleLabelsDirective,
    StyleLabelsReadDirective,
    StyleTitlesDirective,
    StyleTextBoxsDirective,
    StyleDropDownsDirective,
    StyleButtonsDirective,
    StyleModalHeadDirective,
    StyleReferenceDirective,
    StyleReferenceIconoDirective,
    StyleTableDetalleDirective,
    OnlyNumbersDirective,
    SafePipe,
    InformacionComplementariaComponent,
    PresupuestoAdicionalComponent,
    CronogramaComponent,
    AccionesSeguimientoMonitoreoComponent,
    PeriodoParalizacionComponent,
    PeriodoSuspensionComponent,

    AsignacionResponsableComponent,
    ValorizacionesComponent,
    InformacionObraComponent,
    DeductivosReduccionesComponent,
    RecepcionLiquidacionComponent,
    LiquidacionCierreMetasComponent,
    RecepcionObraComponent,
    SeguimientoLiquidacionComponent,
    EjecutadaLiquidadaComponent,
    ProgramadaSegunExpedienteComponent,
    LinkNubeDirective    
  ],
  exports: [
    //DIRECTIVAS
    HasClaimDirective,
    formatoFechaPipe,

    StyleLabelsDirective,
    StyleLabelsReadDirective,
    StyleTitlesDirective,
    StyleTextBoxsDirective,
    StyleDropDownsDirective,
    StyleButtonsDirective,
    StyleModalHeadDirective,
    StyleReferenceDirective,
    StyleReferenceIconoDirective,
    StyleTableDetalleDirective,
    OnlyNumbersDirective,
    //MODULOS
    AccordionModule,
    BsDatepickerModule,
    NgSelectModule,
    UiSwitchModule,
    //COMPONENTES
    InputFileComponent,
    InputFileListadoComponent,
    formatoMonedaPipe,
    TreeviewModule,
    SafePipe,
    InformacionComplementariaComponent,
    PresupuestoAdicionalComponent,
    CronogramaComponent,
    AccionesSeguimientoMonitoreoComponent,
    PeriodoParalizacionComponent,
    PeriodoSuspensionComponent,

    AsignacionResponsableComponent,
    ValorizacionesComponent,
    InformacionObraComponent,
    DeductivosReduccionesComponent,
    RecepcionLiquidacionComponent,
    LiquidacionCierreMetasComponent,
    RecepcionObraComponent,
    SeguimientoLiquidacionComponent,
    EjecutadaLiquidadaComponent,
    ProgramadaSegunExpedienteComponent,
    TooltipModule,
    MatIconModule,
    MatListModule,
    TextMaskModule,
    LinkNubeDirective
  ]
})
export class SharedModule { }
