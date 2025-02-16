import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AprobacionLiquidacionPreinversionComponent } from './aprobacion-liquidacion-preinversion.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AprobacionLiquidacionElaboracionPreComponent } from './aprobacion-liquidacion-elaboracion-pre/aprobacion-liquidacion-elaboracion-pre.component';
import { ResponsablesElaboracionEstudioPreComponent } from './responsables-elaboracion-estudio-pre/responsables-elaboracion-estudio-pre.component';

const routes: Routes = [
  { path: '', component: AprobacionLiquidacionPreinversionComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    AprobacionLiquidacionPreinversionComponent,
    AprobacionLiquidacionElaboracionPreComponent,
    ResponsablesElaboracionEstudioPreComponent
  ]
})
export class AprobacionLiquidacionPreinversionModule { }
