import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPrincipalComponent } from './info-principal.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from '../../appSettings/pager.service';
import { HttpModule } from '@angular/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatAutocompleteModule, MatInputModule, MatListModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path : "", component: InfoPrincipalComponent }
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    NgSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatListModule,
    SharedModule,
    
  ],
  providers: [PagerService],
  declarations: [InfoPrincipalComponent]
})
export class InfoPrincipalModule { }
