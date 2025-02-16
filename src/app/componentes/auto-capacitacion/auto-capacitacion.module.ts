import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';

import { AutoCapacitacionComponent } from './auto-capacitacion/auto-capacitacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from 'src/app/appSettings';
import { SharedModule } from '../../shared/shared.module';
import { VideosCapacitacionComponent } from './auto-capacitacion/videos-capacitacion/videos-capacitacion.component';
import { ManualCapacitacionComponent } from './auto-capacitacion/manual-capacitacion/manual-capacitacion.component';


const routes: Routes = [
  { path : "", component: AutoCapacitacionComponent,
    children: [
      {
        path: 'manual',
        component: ManualCapacitacionComponent
      },
    {
      path: 'videos',
      component: VideosCapacitacionComponent
    }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AutoCapacitacionComponent, VideosCapacitacionComponent, ManualCapacitacionComponent]
})
export class AutoCapacitacionModule { }
