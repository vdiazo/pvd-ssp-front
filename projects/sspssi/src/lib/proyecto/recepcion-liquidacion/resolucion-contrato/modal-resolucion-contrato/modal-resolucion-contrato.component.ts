import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from '../../../../../patterns/facade.service';
import { tipoArchivo, Functions, sessionStorageItems } from '../../../../../appSettings';
import { IResolucionContrato } from '../../../../../interfaces/IResolucionContrato';
import { Router } from '@angular/router';

@Component({
  selector: 'ssi-modal-resolucion-contrato',
  templateUrl: './modal-resolucion-contrato.component.html',
  styleUrls: ['./modal-resolucion-contrato.component.css']
})
export class ModalResolucionContratoComponent implements OnInit {

  formGroup: FormGroup
  id_seguimiento_monitoreo_obra: number;
  id_fase: number;
  id_tipo_documento: number;
  nombreArchivo: string;
  tieneArchivo: boolean = false;
  listTipoDocumento;
  tipoArchivo: number = tipoArchivo.ResolucionContrato;
  listaResolucionContrato: IResolucionContrato[]
  file: any;
  @Output() emitResolucionContrato = new EventEmitter();
  resolucionContrato: IResolucionContrato;

  constructor(private fb: FormBuilder, public modalRef: BsModalRef, private fs: FacadeService, public funciones: Functions, private router:Router) { }

  ngOnInit() {
    this.validarModel(this.resolucionContrato);
    this.listarTipoDocumento();
  }

  validarModel(model) {
    this.formGroup = this.fb.group({
      id_resolucion_contrato: [0],
      id_seguimiento_monitoreo_obra: this.id_seguimiento_monitoreo_obra,
      id_fase: this.id_fase,
      id_tipo_documento: [null, Validators.required],
      descripcion: ["", Validators.compose([Validators.required])],
      fecha_emision_documento: ["", Validators.required],
      nombre_archivo: ["", Validators.required],
      ruta_archivo: [""]
    });

    if (model != undefined) {
      let modelResolucionContrato = Object.assign({}, model);
      modelResolucionContrato.fecha_emision_documento = this.funciones.ConvertStringtoDate(modelResolucionContrato.fecha_emision_documento);
      this.nombreArchivo = modelResolucionContrato.nombre_archivo;
      this.formGroup.patchValue(
        modelResolucionContrato
      );
    }
    this.formGroup.markAsUntouched();
    this.formGroup.markAsPristine();
  }

  listarTipoDocumento() {
    this.fs.maestraService.listarTipoDocumento().subscribe(
      (data: any) => {
        this.listTipoDocumento = data;
      }
    );
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.tieneArchivo = false;
      this.nombreArchivo = evento.uploaded._body;
      this.formGroup.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  grabar() {
    let model: IResolucionContrato = <IResolucionContrato>this.formGroup.value;
    if (model.id_resolucion_contrato == 0) {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      this.funciones.alertaRetorno("question", "¿Está seguro de guardar la Resolución de Contrato?.\n" +
        "Se generará un respaldo de la información registrada anteriormente", "", true, (respuesta) => {
          if (respuesta.value) {
            this.fs.resolucionContratoService.registrarResolucionContrato(model).subscribe(
              (data) => {
                if (data != 0) {
                  sessionStorage.setItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA, null);
                  sessionStorage.setItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA_REGISTRO, null);
                  this.modalRef.hide();
                  this.router.navigate(['/monitoreo']);
                }
                else {
                  this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
                }
              }
            );
          }
        });
    }
    else {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.resolucionContratoService.modificarResolucionContrato(model).subscribe(
        (data) => {
          if (data != 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.emitResolucionContrato.emit();
            this.modalRef.hide();
          }
          else {
            this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
          }
        }
      );
    }
  }
}
