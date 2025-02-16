import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasComponent } from './metas.component';
import { CrudMetasComponent } from './crud-metas/crud-metas.component';
import { MetasEventosService } from './metas-eventos.service';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TextMaskModule } from 'angular2-text-mask';
const routes:Routes=[
  {
    path:"",
    component:MetasComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    PaginationModule.forRoot(),
    SharedModule,
    ModalModule.forRoot(),
    TextMaskModule
  ],
  providers:[MetasEventosService
  ],
  declarations: [MetasComponent, CrudMetasComponent],
  entryComponents:[CrudMetasComponent],
  exports:[CrudMetasComponent]
})
export class MetasModule { }
