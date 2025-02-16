import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuscarTramoComponent } from './buscar-tramo.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PagerService } from '../../appSettings';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  { path: '', component: BuscarTramoComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    PaginationModule.forRoot(),
  ],
  providers: [PagerService],
  declarations: [BuscarTramoComponent]
})
export class BuscarTramoModule { }
