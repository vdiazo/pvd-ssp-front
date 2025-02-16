import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ResolucionContratoComponent } from './resolucion-contrato.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PagerService } from 'src/app/appSettings';
import { ModalResolucionContratoComponent } from './modal-resolucion-contrato/modal-resolucion-contrato.component';
import { ModalHistorialComponent } from './modal-historial/modal-historial.component';
// import { RecepcionLiquidacionComponent } from '../recepcion-liquidacion.component';
// import { RecepcionObraComponent } from '../recepcion-obra/recepcion-obra.component';
// import { SeguimientoLiquidacionComponent } from '../seguimiento-liquidacion/seguimiento-liquidacion.component';
// import { LiquidacionCierreMetasComponent } from '../liquidacion-cierre-metas/liquidacion-cierre-metas.component';
// import { EjecutadaLiquidadaComponent } from '../liquidacion-cierre-metas/ejecutada-liquidada/ejecutada-liquidada.component';
// import { ProgramadaSegunExpedienteComponent } from '../liquidacion-cierre-metas/programada-segun-expediente/programada-segun-expediente.component';

const routes: Routes = [
  {
    path: '',
    component: ResolucionContratoComponent
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
    ModalModule.forRoot(),  
  ],
  providers: [PagerService],
  entryComponents: [
    ModalResolucionContratoComponent,
    ModalHistorialComponent
  ],
  declarations: [
    ResolucionContratoComponent,
    ModalResolucionContratoComponent,
    ModalHistorialComponent,
    // RecepcionLiquidacionComponent,
    // RecepcionObraComponent,
    // SeguimientoLiquidacionComponent,
    // LiquidacionCierreMetasComponent,
    // EjecutadaLiquidadaComponent,
    // ProgramadaSegunExpedienteComponent    
  ]
})
export class ResolucionContratoModule { }