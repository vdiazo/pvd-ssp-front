import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesoSeleccionComponent } from './proceso-seleccion.component';
import { Routes, RouterModule } from '@angular/router';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  { path: '', component: ProcesoSeleccionComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule
  ],
  declarations: [ProcesoSeleccionComponent, ContratacionConsultoriaComponent, ContratacionBienesServiciosComponent]
})
export class ProcesoSeleccionModule { }
