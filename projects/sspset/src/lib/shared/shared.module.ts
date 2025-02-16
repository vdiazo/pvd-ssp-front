import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasClaimDirective } from '../auth/has-claim.directive';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InputFileComponent } from '../controles/input-file/input-file.component';
//import { InputFileListadoComponent } from '../controles/input-file-listado/input-file-listado.component';
import { formatoFechaPipe, formatoMonedaPipe, SafePipe } from '../../appSettings/pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TextMaskModule } from 'angular2-text-mask';
import { DxFileUploaderModule } from 'devextreme-angular';
import { LinkNubeDirective } from './directives/link-nube';



@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    UiSwitchModule,
    TextMaskModule,
    DxFileUploaderModule
  ],
  declarations: [
    HasClaimDirective,
    InputFileComponent,
    //InputFileListadoComponent,
    formatoFechaPipe,
    formatoMonedaPipe ,
    SafePipe,
    LinkNubeDirective
  ],
  exports: [
    //DIRECTIVAS
    HasClaimDirective,
    AccordionModule,
    InputFileComponent,
    //InputFileListadoComponent,
    formatoFechaPipe,
    formatoMonedaPipe,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgSelectModule,
    UiSwitchModule,
    SafePipe,
    TextMaskModule,
    DxFileUploaderModule,
    LinkNubeDirective
  ]
})
export class SharedModule { }
