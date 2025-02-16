import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanciamientoComponent } from './financiamiento.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from 'projects/sspssi/src/appSettings';
import { CostoProyectoComponent } from './costo-proyecto/costo-proyecto.component';
import { FuenteFinancieraComponent } from './fuente-financiera/fuente-financiera.component';
import { InformacionFinancieraComponent } from './informacion-financiera/informacion-financiera.component';
import { ListaConvenioComponent } from './lista-convenio/lista-convenio.component';

const routes:Routes=[
  {
  path:'',
  component:FinanciamientoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [PagerService],
  declarations: [
    FinanciamientoComponent,
    CostoProyectoComponent,
    ListaConvenioComponent,
    FuenteFinancieraComponent,
    InformacionFinancieraComponent
  ]
})
export class FinanciamientoModule { }
