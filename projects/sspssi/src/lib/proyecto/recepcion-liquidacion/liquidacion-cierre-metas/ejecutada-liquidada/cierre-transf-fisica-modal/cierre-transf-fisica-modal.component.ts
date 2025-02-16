import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CierreTransfFisica } from '../../../../../../models/response/cierre-transferencia-fisica';
import { tipoArchivo } from '../../../../../../appSettings/enumeraciones';
import { BsModalRef } from 'node_modules/ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { CierreProyectoService } from '../../../../../../servicios/recepcion-liquidacion/cierre-proyecto.service';

@Component({
  selector: 'ssi-cierre-transf-fisica-modal',
  templateUrl: './cierre-transf-fisica-modal.component.html',
  styleUrls: ['./cierre-transf-fisica-modal.component.css']
})
export class CierreTransfFisicaModalComponent implements OnInit {

  idCierreTransfFisicaAprobada;
  mostrarNuevoCierreTransferenciaFisica;
  modelCierreTransfFisica;
  model: CierreTransfFisica; 
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  IdTipoArchivo: number = tipoArchivo.CierreTransfFisica;
  lstEstadoCierreTransfFisica;
  lstTipoDocumentoCierreTransfFisica;

  @Output() retornarValores = new EventEmitter();

  constructor(public modalRef: BsModalRef, public funciones: Functions, private servicio: CierreProyectoService) { }

  ngOnInit() {
    this.listarEstadoCierreTransfFisica();
    this.listarTipoDocumentoCierre();
    if (this.modelCierreTransfFisica.id_cierre_transferencia_fisica == 0) {
      this.model = new CierreTransfFisica();
      this.model.id_cierre_transferencia_fisica = this.modelCierreTransfFisica.id_cierre_transferencia_fisica;
      this.model.id_seguimiento_monitoreo_obra = this.modelCierreTransfFisica.id_seguimiento_monitoreo_obra
    } else {
      this.editarCierreTransfFisica();
    }
  }

  administrarCierreTransfFisica(model) {
    //registrar
    if (model.id_cierre_transferencia_fisica == 0) {
      model.nombre_archivo = this.nombreArchivo = null ? model.nombre_archivo : this.nombreArchivo;
      if (model.nombre_archivo == "" && model.id_estado_cierre == 1) {
        this.funciones.mensaje("info", "Debe adjuntar un documento.");
      } else {
        model.usuario_creacion = sessionStorage.getItem("Usuario");
        this.servicio.registrarCierreTransfFisica(model).subscribe(
          respuesta => {
            this.retornarValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          }
        );
      }
    } else {
      if (!this.mostrarNuevoCierreTransferenciaFisica && model.id_estado_cierre == 1 && this.idCierreTransfFisicaAprobada != model.id_cierre_transferencia_fisica) {
        this.funciones.mensaje("info", "Ya existe una transferencia fisica Aprobada.");
      } else {
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        if (model.nombre_archivo == "" && model.id_estado_cierre == 1) {
          this.funciones.mensaje("info", "Debe adjuntar un documento.");
        } else {
          this.servicio.actualizarCierreTransfFisica(model).subscribe(
            respuesta => {
              this.retornarValores.emit(respuesta);
              this.modalRef.hide();
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            }
          );
        }
      }
    }
  }

  editarCierreTransfFisica() {
    this.model = new CierreTransfFisica();
    this.model.id_cierre_transferencia_fisica = this.modelCierreTransfFisica.id_cierre_transferencia_fisica;
    this.model.id_estado_cierre = this.modelCierreTransfFisica.id_estado_cierre;
    this.model.fecha = this.modelCierreTransfFisica.fecha.toString().lenght == 10 ? this.funciones.ConvertStringtoDate(this.modelCierreTransfFisica.fecha) : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.modelCierreTransfFisica.fecha));
    this.model.id_tipo_documento_cierre = this.modelCierreTransfFisica.id_tipo_documento_cierre;
    this.model.observacion = this.modelCierreTransfFisica.observacion;
    this.model.nombre_archivo = this.modelCierreTransfFisica.archivo_doc_cierre;
    this.model.id_seguimiento_monitoreo_obra = this.modelCierreTransfFisica.id_seguimiento_monitoreo_obra;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  listarEstadoCierreTransfFisica() {
    this.servicio.listarEstadoCierre().subscribe(
      respuesta => {
        this.lstEstadoCierreTransfFisica = respuesta;
      }
    );
  }

  listarTipoDocumentoCierre() {
    this.servicio.listarTipoDocumentoCierre().subscribe(
      respuesta => {
        this.lstTipoDocumentoCierreTransfFisica = respuesta;
      }
    );
  }

  closeModal() {
    this.modalRef.hide();
  }
}
