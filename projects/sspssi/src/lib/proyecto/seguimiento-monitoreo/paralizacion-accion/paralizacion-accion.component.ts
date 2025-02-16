import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ParalizacionAccion } from '../../../../models/response/paralizacion-accion';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TipoDocumento } from '../../../../models/response/tipo-documento';
import { TipoParalizacionAccion } from '../../../../models/response/tipo-paralizacion-accion';
import { Functions } from '../../../../appSettings/functions';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { FacadeService } from '../../../../patterns/facade.service';

@Component({
  selector: 'ssi-paralizacion-accion',
  templateUrl: './paralizacion-accion.component.html',
  styleUrls: ['./paralizacion-accion.component.css'],
  providers: [Functions]
})
export class ParalizacionAccionComponent implements OnInit {
  modelAccionParalizacion;
  model: ParalizacionAccion;
  tipoDocumento: TipoDocumento;
  tipoParalizacionAccion: TipoParalizacionAccion;
  listTipoDocumento;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  IdTipoArchivo: number = tipoArchivo.paralizacionAccion;
  minimoDate = new Date();
  maximoDate = new Date();
  minDate;
  maxDate;
  bMostrar: boolean = false;

  constructor(public modalRef: BsModalRef,
    private fs: FacadeService,
    public funciones: Functions) { }

  ngOnInit() {
    this.listarTipoDocumento();
    this.listarTipoParalizacionAccion();
    if (this.modelAccionParalizacion.id_paralizacion_accion_obra == 0) {
      this.model = new ParalizacionAccion();
      this.model.id_paralizacion_accion_obra = this.modelAccionParalizacion.id_paralizacion_accion_obra;
      this.model.id_paralizacion_obra = this.modelAccionParalizacion.id_paralizacion_obra;
      this.minimoDate = this.funciones.ConvertStringtoDate(this.minDate);
      this.maximoDate = this.funciones.ConvertStringtoDate(this.maxDate);
    } else {
      this.minimoDate = this.funciones.ConvertStringtoDateDB(this.minDate);
      this.maximoDate = this.funciones.ConvertStringtoDateDB(this.maxDate);
      this.editarParalizacionAccionObra();
    }

  }

  editarParalizacionAccionObra() {
    this.model = new ParalizacionAccion();
    this.model.id_paralizacion_accion_obra = this.modelAccionParalizacion.id_paralizacion_accion_obra;
    this.model.id_paralizacion_obra = this.modelAccionParalizacion.id_paralizacion_obra;
    this.model.id_tipo_documento = this.modelAccionParalizacion.id_tipo_documento;
    this.model.id_tipo_paralizacion_accion_obra = this.modelAccionParalizacion.id_tipo_paralizacion_accion_obra;
    this.model.fecha = this.funciones.ConvertStringtoDate(this.modelAccionParalizacion.fecha);
    this.model.observaciones = this.modelAccionParalizacion.observaciones;
    this.model.nombre_archivo = this.modelAccionParalizacion.archivo_convenio;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
  }

  closeModal() {
    this.modalRef.hide();
    this.listarTipoParalizacionAccion();
  }

  listarTipoDocumento() {
    this.fs.maestraService.listarTipoDocumento().subscribe(
      data => {
        this.tipoDocumento = data as any;
      }
    )
  }

  listarTipoParalizacionAccion() {
    this.fs.maestraService.listarTipoParalizacionAccion().subscribe(
      data => {
        let listTipAcParalizacion = data as any;
        this.tipoParalizacionAccion = listTipAcParalizacion.data;
      }
    )
    // var abc = [{ "id_tipo_paralizacion_accion_obra": 1, "nombre_accion": "OBSERVADO" }, { "id_tipo_paralizacion_accion_obra": 2, "nombre_accion": "APROBADO" }];
    // this.tipoParalizacionAccion = abc as any;
  }

  @Output() retornoValores = new EventEmitter();

  administrarAccionParalizacion(model) {
    this.bMostrar = true;
    //model.nombre_archivo = this.nombreArchivo==null? model.nombre_archivo : this.nombreArchivo;
    //actualizar
    if (model.id_paralizacion_accion_obra == 0) {
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      if (model.nombre_archivo == "") {
        this.funciones.mensaje("info", "Debe adjuntar un documento.");
        this.bMostrar = false;
      } else {
        model.usuario_creacion = sessionStorage.getItem("Usuario");
        this.fs.paralizacionAccionService.registrarAccionParalizacion(model).subscribe(
          respuesta => {
            this.retornoValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.bMostrar = false;
          }
        );
      }
    }
    //registrar
    else {
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      this.fs.paralizacionAccionService.actualizarAccionParalizacion(model).subscribe(
        respuesta => {
          this.retornoValores.emit(respuesta);
          this.modalRef.hide();
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
          this.bMostrar = false;
        }
      )
    }
  };

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }
}
