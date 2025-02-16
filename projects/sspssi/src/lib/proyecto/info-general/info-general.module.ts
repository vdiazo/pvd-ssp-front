import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoGeneralComponent } from './info-general.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerService } from 'projects/sspssi/src/appSettings';
import { AccordionModule } from 'ngx-bootstrap/accordion';

const routers: Routes = [
  {
    path: '',
    component: InfoGeneralComponent
  }
];

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(routers),
    AccordionModule,
  ],
  providers: [PagerService],
  declarations: [InfoGeneralComponent]
})
export class InfoGeneralModule { }
