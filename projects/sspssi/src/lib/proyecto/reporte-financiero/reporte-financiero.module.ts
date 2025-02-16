import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteFinancieroComponent } from './reporte-financiero.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from 'projects/sspssi/src/appSettings';

const routes: Routes = [
  { path: '', component: ReporteFinancieroComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ReporteFinancieroComponent],
  providers: [PagerService]
})
export class ReporteFinancieroModule { }
