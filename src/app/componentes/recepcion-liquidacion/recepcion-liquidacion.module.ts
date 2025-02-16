import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RecepcionLiquidacionComponent } from '../recepcion-liquidacion/recepcion-liquidacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { RecepcionObraComponent } from '../recepcion-liquidacion/recepcion-obra/recepcion-obra.component';
import { SeguimientoLiquidacionComponent } from '../recepcion-liquidacion/seguimiento-liquidacion/seguimiento-liquidacion.component';
import { LiquidacionCierreMetasComponent } from './liquidacion-cierre-metas/liquidacion-cierre-metas.component';
import { EjecutadaLiquidadaComponent } from './liquidacion-cierre-metas/ejecutada-liquidada/ejecutada-liquidada.component';
import { ProgramadaSegunExpedienteComponent } from './liquidacion-cierre-metas/programada-segun-expediente/programada-segun-expediente.component';
import { ResolucionContratoComponent } from './resolucion-contrato/resolucion-contrato.component';
import { ModalResolucionContratoComponent } from './resolucion-contrato/modal-resolucion-contrato/modal-resolucion-contrato.component';
import { ModalHistorialComponent } from './resolucion-contrato/modal-historial/modal-historial.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InformacionComplementariaModule } from '../informacion-complementaria/informacion-complementaria.module';


const routes: Routes = [
  {
    path: '',
    component: RecepcionLiquidacionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [PagerService],
  entryComponents: [
    // ModalResolucionContratoComponent,
    // ModalHistorialComponent
  ],
  declarations: [
    //------------------------------------
    // RecepcionLiquidacionComponent,
    // RecepcionObraComponent,
    // SeguimientoLiquidacionComponent,
    // LiquidacionCierreMetasComponent,
    // EjecutadaLiquidadaComponent,
    // ProgramadaSegunExpedienteComponent,
    // ResolucionContratoComponent,
    // ModalResolucionContratoComponent,
    // ModalHistorialComponent    
  ]
})
export class RecepcionLiquidacionModule { }