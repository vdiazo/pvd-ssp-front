import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IntegracionProyectoSsiComponent } from './integracion-proyecto-ssi.component';
import { SspssiModule } from 'projects/sspssi/src/lib/sspssi.module';

const routes: Routes = [
  {
    path: '',
    component: IntegracionProyectoSsiComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    SspssiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IntegracionProyectoSsiComponent]
})
export class IntegracionProyectoSsiModule { }
