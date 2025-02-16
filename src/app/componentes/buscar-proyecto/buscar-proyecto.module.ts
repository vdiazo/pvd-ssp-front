import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuscarProyectoComponent } from './buscar-proyecto.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerService } from '../../appSettings';
import { NgSelectModule } from '@ng-select/ng-select';
import { HasClaimDirective } from '../auth/has-claim.directive';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path : "", component: BuscarProyectoComponent }
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
  declarations: [BuscarProyectoComponent]
})
export class BuscarProyectoModule { }

