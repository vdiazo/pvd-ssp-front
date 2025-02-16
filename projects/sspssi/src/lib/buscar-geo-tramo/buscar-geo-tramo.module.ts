import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarGeoTramoComponent } from './buscar-geo-tramo.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: BuscarGeoTramoComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PaginationModule.forRoot(),
    FormsModule
  ],
  declarations: [BuscarGeoTramoComponent]
})
export class BuscarGeoTramoModule { }
