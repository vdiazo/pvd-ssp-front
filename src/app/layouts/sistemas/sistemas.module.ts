import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerService } from '../../appSettings';
import { SharedModule } from '../../shared/shared.module';
import { SistemasComponent } from './sistemas.component';

const routes: Routes = [
  { path : "", component: SistemasComponent }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [PagerService],
  declarations: [SistemasComponent]
})
export class SistemasModule { 
}
