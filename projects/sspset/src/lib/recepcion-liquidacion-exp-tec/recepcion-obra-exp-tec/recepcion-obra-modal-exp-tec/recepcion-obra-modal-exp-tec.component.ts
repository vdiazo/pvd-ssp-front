import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RecepcionObraService } from '../../../services/recepcion-obra.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Funciones } from '../../../../appSettings/funciones';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
import { RecepcionObra } from '../../../../models/response/recepcion-obra';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
defineLocale('es', deLocale);



@Component({
  selector: 'set-recepcion-obra-modal-exp-tec',
  templateUrl: './recepcion-obra-modal-exp-tec.component.html',
  styleUrls: ['./recepcion-obra-modal-exp-tec.component.css']
})
export class RecepcionObraModalExpTecComponent implements OnInit {
  idRecepcionAprobada;
  mostrarNuevaRecepcion;
  modelRecepcionObra;
  model: RecepcionObra;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  IdTipoArchivo: number = tipoArchivo.recepcionObra;
  lstEstadoRecepcionObra;
  lstTipoDocumentoRecepcionObra;
  constructor(public modalRef: BsModalRef, public funciones: Funciones, private servicio: RecepcionObraService) { }

  ngOnInit() {
    this.listarEstadosRecepcionObra();
    this.listarTipoDocumentoRecepcionObra();
    if (this.modelRecepcionObra.id_liquidacion_recepcion_expediente == 0) {
      this.model = new RecepcionObra();
      this.model.id_liquidacion_recepcion_expediente = this.modelRecepcionObra.id_liquidacion_recepcion_expediente;
      this.model.id_seguimiento_ejecucion_expediente = this.modelRecepcionObra.id_seguimiento_ejecucion_expediente
    } else {
      this.editarRecepcionObra();
    }
  }
  @Output() retornoValores = new EventEmitter();

  administrarRecepcionObra(model) {
    //registrar
    if (model.id_liquidacion_recepcion_expediente == 0) {
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      if (model.nombre_archivo == "" && model.id_estado_recepcion_expediente == 2) { //APROBADO
        this.funciones.mensaje("info", "Debe adjuntar un documento.");
      } else {
        model.usuario_creacion = sessionStorage.getItem("Usuario");
        this.servicio.registrarRecepcionObra(model).subscribe(
          respuesta => {
            this.retornoValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          }
        )
      }

    }
    //actualizar
    else {
      if(!this.mostrarNuevaRecepcion && model.id_estado_recepcion_expediente == 2 && this.idRecepcionAprobada != model.id_liquidacion_recepcion_expediente){
        this.funciones.mensaje("info", "Ya existe una recepción de obra Aprobada.");
      }else{
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        if (model.nombre_archivo == "" && model.id_estado_recepcion_expediente == 2) { //APROBADO
          this.funciones.mensaje("info", "Debe adjuntar un documento.");
        } else {
          this.servicio.actualizarRecepcionObra(model).subscribe(
            respuesta => {
              this.retornoValores.emit(respuesta);
              this.modalRef.hide();
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            }
          );
        }
      }
    }
  }

  editarRecepcionObra() {
    this.model = new RecepcionObra();
    this.model.id_liquidacion_recepcion_expediente = this.modelRecepcionObra.id_liquidacion_recepcion_expediente;
    this.model.id_estado_recepcion_expediente = this.modelRecepcionObra.id_estado_recepcion_expediente;
    this.model.fecha = this.modelRecepcionObra.fecha.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.modelRecepcionObra.fecha):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.modelRecepcionObra.fecha));  
    this.model.id_tipo_documento_recepcion_expediente = this.modelRecepcionObra.id_tipo_documento_recepcion_expediente;
    this.model.observacion = this.modelRecepcionObra.observacion;
    this.model.nombre_archivo = this.modelRecepcionObra.archivo_recepcion;
    this.model.id_seguimiento_ejecucion_expediente = this.modelRecepcionObra.id_seguimiento_ejecucion_expediente;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  listarEstadosRecepcionObra(){
    this.servicio.listarEstadoRecepcionObra().subscribe(
      respuesta => {
        this.lstEstadoRecepcionObra = respuesta;
      }
    );
  }

  listarTipoDocumentoRecepcionObra(){
    this.servicio.listarTipoDocumentoRecepcionObra().subscribe(
      respuesta => {
        this.lstTipoDocumentoRecepcionObra = respuesta;
      }
    );
  }

  closeModal() {
    this.modalRef.hide();
  }

}
