import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionalDeductivoComponent } from './adicional-deductivo.component';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../../appSettings';
//import { DeductivosReduccionesComponent } from './deductivos-reducciones/deductivos-reducciones.component';
//import { PresupuestoAdicionalComponent } from './presupuesto-adicional/presupuesto-adicional.component';


const routes: Routes = [

  { path: '',
   component: AdicionalDeductivoComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PaginationModule.forRoot(),
    SharedModule
  ],
  providers: [PagerService],
  declarations: [
    AdicionalDeductivoComponent,
    //DeductivosReduccionesComponent,
    //PresupuestoAdicionalComponent
  ]
})
export class AdicionalDeductivoModule { }
