import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanciamientoComponent } from './financiamiento.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ComponenteProyectoComponent } from './pages/componente-proyecto/componente-proyecto.component';
import { InformacionFinancieraComponent } from './pages/informacion-financiera/informacion-financiera.component';
import { TextMaskModule } from 'angular2-text-mask';


const routes: Routes = [
  { path: '', component: FinanciamientoComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextMaskModule
  ],
  declarations: [FinanciamientoComponent, ComponenteProyectoComponent, InformacionFinancieraComponent]
})
export class FinanciamientoModule { }
