import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { ProcesoSeleccionComponent } from './proceso-seleccion.component';
import { ContratacionObraComponent } from './contratacion-obra/contratacion-obra.component';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { FaseIdentificadorComponent } from './fase-identificador/fase-identificador.component';
import { ModalCronoOsceComponent } from './modal-crono-osce/modal-crono-osce.component';
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {path:'', component: ProcesoSeleccionComponent} 
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot()
  ],
  providers: [PagerService],
  declarations: [
     //------------------------------------
     ProcesoSeleccionComponent,

     ContratacionObraComponent,
     ContratacionConsultoriaComponent,
     ContratacionBienesServiciosComponent,
     FaseIdentificadorComponent,
     ModalCronoOsceComponent,
  ],
  exports:[ModalCronoOsceComponent],
  entryComponents:[ModalCronoOsceComponent]
})
export class ProcesoSeleccionModule { }
