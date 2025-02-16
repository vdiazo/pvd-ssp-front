import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesoSeleccionComponent } from './proceso-seleccion.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ContratacionConsultoriaPreComponent } from './contratacion-consultoria-pre/contratacion-consultoria-pre.component';
import { ContratacionBienesServiciosPreComponent } from './contratacion-bienes-servicios-pre/contratacion-bienes-servicios-pre.component';

const routes: Routes = [
  { path: '', component: ProcesoSeleccionComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ProcesoSeleccionComponent, ContratacionConsultoriaPreComponent, ContratacionBienesServiciosPreComponent]
})
export class ProcesoSeleccionModule { }
