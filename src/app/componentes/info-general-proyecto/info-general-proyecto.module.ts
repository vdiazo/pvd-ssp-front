import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { InfoGeneralProyectoComponent } from './info-general-proyecto.component';
import { MetasService } from 'src/app/services/metas.service';

const routes: Routes = [
  {path:'', component: InfoGeneralProyectoComponent} 
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [PagerService, MetasService],
  declarations: [
     //------------------------------------
     InfoGeneralProyectoComponent
  ]
})
export class InfoGeneralProyectoModule { }
