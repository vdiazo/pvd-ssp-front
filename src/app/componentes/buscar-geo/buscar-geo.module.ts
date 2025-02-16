import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarGeoComponent } from './buscar-geo.component';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from '../../../../node_modules/ngx-bootstrap/pagination';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Routes, RouterModule } from '../../../../node_modules/@angular/router';

const routes: Routes = [
  { path : "", component: BuscarGeoComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [BuscarGeoComponent]
})
export class BuscarGeoModule { }
