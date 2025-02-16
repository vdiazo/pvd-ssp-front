import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoGeneralComponent } from './info-general.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListadoConvenioComponent } from './listado-convenio/listado-convenio.component';

const routes: Routes = [
  { path: '', component: InfoGeneralComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [InfoGeneralComponent, ListadoConvenioComponent]
})
export class InfoGeneralModule { }
