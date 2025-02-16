import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformacionComplementariaComponent } from './informacion-complementaria.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { PresupuestoAdicionalComponent } from './presupuesto-adicional/presupuesto-adicional.component';
import { DeductivosReduccionesComponent } from './deductivos-reducciones/deductivos-reducciones.component';

const routes: Routes = [
  {path:'', component: InformacionComplementariaComponent} 
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [PagerService],
  declarations: [
     //------------------------------------
    //  InformacionComplementariaComponent,
    //  PresupuestoAdicionalComponent,
    //  DeductivosReduccionesComponent,
  ],
  exports: [
    // InformacionComplementariaComponent,
    // PresupuestoAdicionalComponent,
    // DeductivosReduccionesComponent,
 ]
})
export class InformacionComplementariaModule { }
