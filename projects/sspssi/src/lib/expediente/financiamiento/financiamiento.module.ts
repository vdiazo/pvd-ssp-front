import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanciamientoComponent } from './financiamiento.component';
import { CostoProyectoComponent } from './costo-proyecto/costo-proyecto.component';
/* import { ListaConvenioComponent } from './lista-convenio/lista-convenio.component'; */
import { InformacionFinancieraComponent } from './informacion-financiera/informacion-financiera.component';
import { FuenteFinancieraComponent } from './fuente-financiera/fuente-financiera.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


const routes: Routes = [
  { path: '', component: FinanciamientoComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [FinanciamientoComponent, CostoProyectoComponent, InformacionFinancieraComponent, FuenteFinancieraComponent]
})
export class FinanciamientoModule { }
