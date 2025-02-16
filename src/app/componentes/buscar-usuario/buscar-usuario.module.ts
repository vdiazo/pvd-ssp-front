import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarUsuarioComponent } from './buscar-usuario.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { PagerService } from '../../appSettings';

const routes: Routes = [
  { path : "", component: BuscarUsuarioComponent }
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
  declarations: [BuscarUsuarioComponent],

})
export class BuscarUsuarioModule { }
