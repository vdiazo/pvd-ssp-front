import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuscarAccesoComponent } from './buscar-acceso.component';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from '../../appSettings';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path : "", component: BuscarAccesoComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [PagerService],
  declarations: [BuscarAccesoComponent]
})
export class BuscarAccesoModule { }
