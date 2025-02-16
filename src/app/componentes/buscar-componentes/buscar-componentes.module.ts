import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuscarComponentesComponent } from './buscar-componentes.component';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { PagerService } from '../../appSettings';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path : "", component: BuscarComponentesComponent }
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
  declarations: [BuscarComponentesComponent]
})
export class BuscarComponentesModule { }
