
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { ColaboradoresComponent } from './colaboradores.component';
import { ModalColaboradorComponent } from './modal-colaborador/modal-colaborador.component';

const routes: Routes = [
  { path : "", component: ColaboradoresComponent }
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
  providers: [PagerService],
  declarations: [ColaboradoresComponent]
})
export class ColaboradoresModule { }
