import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { InfoFinancieraComponent } from './info-financiera.component';
import { CostoProyectoComponent } from './costo-proyecto/costo-proyecto.component';
import { MontoTransferidoComponent } from './monto-transferido/monto-transferido.component';
import { MontoConvenioComponent } from './monto-convenio/monto-convenio.component';
import { FuenteFinancieraComponent } from './fuente-financiera/fuente-financiera.component';
import { InformacionFinancieraComponent } from './informacion-financiera/informacion-financiera.component';

const routes: Routes = [
  {path:'', component: InfoFinancieraComponent} 
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
     InfoFinancieraComponent,

     CostoProyectoComponent,
     MontoConvenioComponent,
     MontoTransferidoComponent,
     FuenteFinancieraComponent,
     InformacionFinancieraComponent,
  ]
})
export class InfoFinancieraModule { }
