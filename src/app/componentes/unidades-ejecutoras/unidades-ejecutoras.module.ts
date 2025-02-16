import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { UnidadesEjecutorasComponent } from './unidades-ejecutoras.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

const routes: Routes = [
  { path : "", component: UnidadesEjecutorasComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
    TypeaheadModule
  ],
  declarations: [UnidadesEjecutorasComponent]
})
export class UnidadesEjecutorasModule { }