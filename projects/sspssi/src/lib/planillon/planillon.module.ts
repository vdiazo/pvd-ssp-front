import { SharedModule } from './../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanillonComponent } from './planillon/planillon.component';

const routes: Routes = [
  {path: '', component: PlanillonComponent}
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlanillonComponent]
})
export class PlanillonModule { }
