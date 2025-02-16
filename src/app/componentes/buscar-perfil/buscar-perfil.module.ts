import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuscarPerfilComponent } from './buscar-perfil.component';
import { PagerService } from '../../appSettings';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path : "", component: BuscarPerfilComponent }
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
  declarations: [BuscarPerfilComponent]
})
export class BuscarPerfilModule { }
