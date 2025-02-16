import { ProcesoSeleccionComponent } from './proceso-seleccion.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { ContratacionObraComponent } from './contratacion-obra/contratacion-obra.component';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';
import { PaginationModule } from 'ngx-bootstrap/pagination/pagination.module';
import { SharedModule } from '../../shared/shared.module';


const routes: Routes = [
  { path : "", 
  component: ProcesoSeleccionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule
  ],
  declarations: [ProcesoSeleccionComponent,
    ContratacionObraComponent,
    ContratacionConsultoriaComponent,
    ContratacionBienesServiciosComponent,
  ],
})
export class ProcesoSeleccionModule { }
