import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoPreinversionComponent } from './seguimiento-preinversion.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InformacionPreinversionComponent } from './informacion-preinversion/informacion-preinversion.component';
import { ResponsablesPreinversionComponent } from './responsables-preinversion/responsables-preinversion.component';
import { CronogramaPreinversionComponent } from './cronograma-preinversion/cronograma-preinversion.component';
import { CronogramaFinancieroPreinversionComponent } from './cronograma-financiero-preinversion/cronograma-financiero-preinversion.component';
import { EntregablesPreinversionComponent } from './entregables-preinversion/entregables-preinversion.component';
import { AccionesSeguimientoPreinversionComponent } from './acciones-seguimiento-preinversion/acciones-seguimiento-preinversion.component';

const routes: Routes = [
  { path: '', component: SeguimientoPreinversionComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    SeguimientoPreinversionComponent,
    InformacionPreinversionComponent,
    ResponsablesPreinversionComponent,
    CronogramaPreinversionComponent,
    CronogramaFinancieroPreinversionComponent,
    EntregablesPreinversionComponent,
    AccionesSeguimientoPreinversionComponent,
  ]
})
export class SeguimientoPreinversionModule { }
