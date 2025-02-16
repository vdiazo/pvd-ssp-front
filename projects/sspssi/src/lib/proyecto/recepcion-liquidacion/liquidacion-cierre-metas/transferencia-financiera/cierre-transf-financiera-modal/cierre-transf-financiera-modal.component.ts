import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CierreTransfContable } from '../../../../../../models/response/cierre-transferencia-contable';
import { tipoArchivo, Functions } from '../../../../../../appSettings';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CierreProyectoService } from '../../../../../../servicios/recepcion-liquidacion/cierre-proyecto.service';

@Component({
  selector: 'ssi-cierre-transf-financiera-modal',
  templateUrl: './cierre-transf-financiera-modal.component.html',
  styleUrls: ['./cierre-transf-financiera-modal.component.css']
})
export class CierreTransfFinancieraModalComponent implements OnInit {

  idCierreTransfContableAprobada;
  mostrarNuevoCierreTransferenciaContable;
  modelCierreTransfContable;
  model: CierreTransfContable;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  IdTipoArchivo: number = tipoArchivo.CierreTransfContable;
  lstEstadoCierreTransfContable;
  lstTipoDocumentoCierreTransfContable;

  @Output() retornaValores = new EventEmitter();

  constructor(public modalRef: BsModalRef, public funciones: Functions, private servicio: CierreProyectoService) { }

  ngOnInit() {
    this.listarEstadoCierreTransfContable();
    this.listarTipoDocumentoCierre();
    if (this.modelCierreTransfContable.id_cierre_transferencia_contable == 0) {
      this.model = new CierreTransfContable();
      this.model.id_cierre_transferencia_contable = this.modelCierreTransfContable.id_cierre_transferencia_contable;
      this.model.id_seguimiento_monitoreo_obra = this.modelCierreTransfContable.id_seguimiento_monitoreo_obra
    } else {
      this.editarCierreTransfContable();
    }
  }

  administrarCierreTransfContable(model) {
    //registrar
    if (model.id_cierre_transferencia_contable == 0) {
      model.nombre_archivo = this.nombreArchivo = null ? model.nombre_archivo : this.nombreArchivo;
      if (model.nombre_archivo == "" && model.id_estado_cierre == 1) { //aprobado
        this.funciones.mensaje("info", "Debe adjuntar un documento.");
      } else {
        model.usuario_creacion = sessionStorage.getItem("Usuario");
        this.servicio.registrarCierreTransfContable(model).subscribe(
          respuesta => {
            this.retornaValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          }
        );
      }
      //actualizar
    } else {
      if ( !this.mostrarNuevoCierreTransferenciaContable && model.id_estado_cierre == 1 && this.idCierreTransfContableAprobada != model.id_cierre_transferencia_contable) {
        this.funciones.mensaje("info", "Ya existe una transferencia contable Aprobada.");
      } else {
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        if (model.nombre_archivo == "" && model.id_estado_cierre == 1) {
          this.funciones.mensaje("info", "Debe adjuntar un documento.");
        } else {
          this.servicio.actualizarCierreTransfContable(model).subscribe(
            respuesta => {
              this.retornaValores.emit(respuesta);
              this.modalRef.hide();
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            }
          );
        }
      }
    }
  }

  editarCierreTransfContable() {
    this.model = new CierreTransfContable();
    this.model.id_cierre_transferencia_contable = this.modelCierreTransfContable.id_cierre_transferencia_contable;
    this.model.id_estado_cierre = this.modelCierreTransfContable.id_estado_cierre;
    this.model.fecha = this.modelCierreTransfContable.fecha.toString().lenght == 10 ? this.funciones.ConvertStringtoDate(this.modelCierreTransfContable.fecha) : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.modelCierreTransfContable.fecha));
    this.model.id_tipo_documento_cierre = this.modelCierreTransfContable.id_tipo_documento_cierre;
    this.model.observacion = this.modelCierreTransfContable.observacion;
    this.model.nombre_archivo = this.modelCierreTransfContable.archivo_doc_cierre;
    this.model.id_seguimiento_monitoreo_obra = this.modelCierreTransfContable.id_seguimiento_monitoreo_obra;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  listarEstadoCierreTransfContable() {
    this.servicio.listarEstadoCierre().subscribe(
      respuesta => {
        this.lstEstadoCierreTransfContable = respuesta;
      }
    );
  }

  listarTipoDocumentoCierre() {
    this.servicio.listarTipoDocumentoCierre().subscribe(
      respuesta => {
        this.lstTipoDocumentoCierreTransfContable = respuesta;
      }
    );
  }

  closeModal() {
    this.modalRef.hide();
  }
}