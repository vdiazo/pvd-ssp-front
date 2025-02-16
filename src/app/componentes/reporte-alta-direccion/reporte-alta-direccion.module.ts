import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReporteAltaDireccionComponent } from './reporte-alta-direccion.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from '../../appSettings';

const routes:Routes=[
  {
    path:'',
    component:ReporteAltaDireccionComponent
  }

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
  declarations: [ReporteAltaDireccionComponent]
})
export class ReporteAltaDireccionModule { }