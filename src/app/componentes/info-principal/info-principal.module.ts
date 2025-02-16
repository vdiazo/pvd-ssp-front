import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';

import { InfoPrincipalComponent } from './info-principal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from 'src/app/appSettings';
import { SharedModule } from '../../shared/shared.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';


const routes: Routes = [
  { path : "", component: InfoPrincipalComponent }
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
  declarations: [InfoPrincipalComponent],
})
export class InfoPrincipalModule { }
