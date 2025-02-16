import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferenciasComponent } from './transferencias.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { PagerService } from '../../appSettings';
import { TransferenciasListadoComponent } from './transferencias-listado/transferencias-listado.component';
import { TransferenciasSeleccionComponent } from './transferencias-seleccion/transferencias-seleccion.component';
import { TransferenciasMefComponent } from './transferencias-mef/transferencias-mef.component';
import { TranfmefseleccionComponent } from './transferencias-mef/tranfmefseleccion/tranfmefseleccion.component';
import { TranfmefrecursosComponent } from './transferencias-mef/tranfmefrecursos/tranfmefrecursos.component';

const routes: Routes = [
  { path : "", component: TransferenciasComponent }
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
  declarations: [
    TransferenciasComponent,
    TransferenciasListadoComponent,
    TransferenciasSeleccionComponent,
    TransferenciasMefComponent,
    TranfmefseleccionComponent,
    TranfmefrecursosComponent
  ]
})
export class TransferenciasModule { }
