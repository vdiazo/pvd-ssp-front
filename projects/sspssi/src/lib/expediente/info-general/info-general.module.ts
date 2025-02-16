import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoGeneralComponent } from './info-general.component';
import { Routes, RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ListaConvenioComponent } from '../../expediente/financiamiento/lista-convenio/lista-convenio.component';
import { SharedModule } from '../../shared/shared.module';

const routers: Routes = [
  { path: '', component: InfoGeneralComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    AccordionModule,
    SharedModule
  ],
  declarations: [InfoGeneralComponent, ListaConvenioComponent],
  exports: [ListaConvenioComponent]
})
export class InfoGeneralModule { }
