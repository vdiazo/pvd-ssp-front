import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionLiquidacionComponent } from './recepcion-liquidacion.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TransferenciaFinancieraComponent } from './liquidacion-cierre-metas/transferencia-financiera/transferencia-financiera.component';
import { CierreTransfFinancieraModalComponent } from './liquidacion-cierre-metas/transferencia-financiera/cierre-transf-financiera-modal/cierre-transf-financiera-modal.component';
//import { CierreTransfFisicaModalComponent } from './liquidacion-cierre-metas/ejecutada-liquidada/cierre-transf-fisica-modal/cierre-transf-fisica-modal.component';
//import { RecepcionObraComponent } from './recepcion-obra/recepcion-obra.component';
//import { SeguimientoLiquidacionComponent } from './seguimiento-liquidacion/seguimiento-liquidacion.component';

const routes:Routes=[
  {
    path:'',
    component:RecepcionLiquidacionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    SharedModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    RecepcionLiquidacionComponent,
    //CierreTransfFinancieraModalComponent,
    //TransferenciaFinancieraComponent,
    //CierreTransfFisicaModalComponent,
    //RecepcionObraComponent,
    //SeguimientoLiquidacionComponent
  ]
})
export class RecepcionLiquidacionModule { }
