import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ResolucionContratoComponent } from './resolucion-contrato.component';
import { SharedModule } from '../../../shared/shared.module';
import { PagerService } from '../../../../appSettings';
import { ModalResolucionContratoComponent } from './modal-resolucion-contrato/modal-resolucion-contrato.component';
import { ModalHistorialComponent } from './modal-historial/modal-historial.component';

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