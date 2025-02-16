import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SeguimientoExpedienteTecnicoComponent } from './seguimiento-expediente-tecnico.component';
import { SSPSETModule } from 'SSPSET';


const routes: Routes = [
  {
    path: '',
    component: SeguimientoExpedienteTecnicoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SSPSETModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
  ],
  declarations: [
    SeguimientoExpedienteTecnicoComponent
  ]
})
export class SeguimientoExpedienteTecnicoModule { }
