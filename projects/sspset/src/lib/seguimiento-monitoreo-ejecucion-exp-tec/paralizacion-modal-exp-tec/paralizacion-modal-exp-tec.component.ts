import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Paralizacion } from '../../../models/response/paralizacion';
import { Funciones } from '../../../appSettings/funciones';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
import { tipoArchivo } from '../../../appSettings/enumeraciones';
import { FacadeService } from '../../patterns/facade.service';
defineLocale('es', deLocale);

@Component({
  selector: 'set-paralizacion-modal-exp-tec',
  templateUrl: './paralizacion-modal-exp-tec.component.html',
  styleUrls: ['./paralizacion-modal-exp-tec.component.css']
})
export class ParalizacionModalExpTecComponent implements OnInit {

  modelParalizacion;
  model: Paralizacion;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  fecha_inicio_contractual: Date;
  IdTipoArchivo: number = tipoArchivo.paralizacion;
  perfil: string
  bMostrar: boolean = false;

  constructor(public modalRef: BsModalRef,
    public funciones: Funciones,
    private fs: FacadeService,
  ) {

  }

  ngOnInit() {
    if (this.modelParalizacion.id_paralizacion_obra == 0) {
      this.model = new Paralizacion();
      this.model.id_paralizacion_obra = this.modelParalizacion.id_paralizacion_obra;
      this.model.id_seguimiento_monitoreo_obra = this.modelParalizacion.id_seguimiento_monitoreo_obra;
      this.model.perfil = this.modelParalizacion.perfil;
    } else {
      this.editarParalizacion();
    }
  }

  @Output() retornoValores = new EventEmitter();

  administrarParalizacion(model) {
    this.bMostrar = true;
    model.fecha_termino_sugerido = model.fecha_termino;
    //model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
    //this.model.nombreArchivo = this.file.name;
    //registrar
    if (model.fecha_inicio > model.fecha_termino) {
      this.funciones.mensaje("info", "La fecha de inicio no puede ser mayor a la fecha de término.");
    } else {
      if (model.id_paralizacion_obra == 0) {
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        if (model.nombre_archivo == null) {
          this.funciones.mensaje("info", "Debe adjuntar un documento.");
          this.bMostrar = false;
        } else {
          model.usuario_creacion = sessionStorage.getItem("Usuario");
          this.fs.paralizacionService.registrarParalizacion(model).subscribe(
            respuesta => {
              this.retornoValores.emit(respuesta);
              this.modalRef.hide();
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              this.bMostrar = false;
            }
          )
        }
      }
      //actualizar
      else {
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        this.fs.paralizacionService.actualizarParalizacion(model).subscribe(
          respuesta => {
            this.retornoValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.bMostrar = false;
          }
        );
      }
    }
  }

  editarParalizacion() {
    this.model = new Paralizacion();
    this.model.id_paralizacion_obra = this.modelParalizacion.id_paralizacion_obra;
    this.model.id_seguimiento_monitoreo_obra = this.modelParalizacion.id_seguimiento_monitoreo_obra;
    this.model.motivo_paralizacion = this.modelParalizacion.motivo_paralizacion;
    this.model.fecha_inicio = this.funciones.ConvertStringtoDate(this.modelParalizacion.fecha_inicio);
    this.model.fecha_termino = this.funciones.ConvertStringtoDate(this.modelParalizacion.fecha_termino);
    this.model.fecha_termino_sugerido = this.funciones.ConvertStringtoDate(this.modelParalizacion.fecha_termino);
    this.model.nombre_archivo = this.modelParalizacion.archivo_convenio;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.model.perfil = this.modelParalizacion.perfil;
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

}
