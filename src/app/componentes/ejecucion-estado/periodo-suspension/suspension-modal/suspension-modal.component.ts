import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Suspension } from '../../../../models/response/suspension';
import { Functions } from '../../../../appSettings/functions';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale, idLocale } from 'ngx-bootstrap/locale';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { FacadeService } from '../../../../patterns/facade.service';
import { ModalPerfilComponent } from 'src/app/componentes/login/modal-perfil/modal-perfil.component';

import { Router } from '@angular/router';
defineLocale('es', deLocale);


@Component({
  selector: 'app-suspension-modal',
  templateUrl: './suspension-modal.component.html',
  styleUrls: ['./suspension-modal.component.css']
})
export class SuspensionModalComponent implements OnInit {
  modelSuspension;
  model: Suspension;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  fecha_inicio_contractual: Date;
  fecha_inicio_contractual_parametro: string = "";
  IdTipoArchivo: number = tipoArchivo.suspension;
  perfil: string
  bMostrar: boolean = false;

  listAccionSuspension;
  pNumPagina?: number = 0;
  pNumFilas?: number = 0;

  constructor(
    public modalRef: BsModalRef,
    public funciones: Functions,
    private fs: FacadeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
    if (this.modelSuspension.id_suspension_obra == 0) {
      this.model = new Suspension();
      this.model.id_suspension_obra = this.modelSuspension.id_suspension_obra;
      this.model.id_seguimiento_monitoreo_obra = this.modelSuspension.id_seguimiento_monitoreo_obra;
      this.model.perfil = this.modelSuspension.perfil;
    } else {
      this.editarSuspension();
    }
  }

  @Output() retornoValores = new EventEmitter();

  administrarSuspension(model) {
    let EsSuspendido: boolean;
    // if(sessionStorage.getItem("esSuspension")=="false"){
    //   if (this.modelSuspension.id_seguimiento_monitoreo_obra == 0) {
    //     EsSuspendido = false;
    //   } else {
    //     EsSuspendido = false;
    //   }
    // }

    if (sessionStorage.getItem("esSuspension") == "false") {
      EsSuspendido = false;
    } else {
      EsSuspendido = true;
    }

    this.fs.suspensionService.validarSuspensionObra(this.model.id_seguimiento_monitoreo_obra, "UEI", model.fecha_inicio, EsSuspendido,model.id_suspension_obra).subscribe(
      (respuesta: any) => {
        if (!respuesta.estado) {
          this.funciones.mensaje("info", "La fecha de Inicio de la Suspensión no es válida por ser menor o igual a la última fecha de Acta de Reinicio de Obra.");
        } else {
          /*inicio nueva validacion*/
          this.bMostrar = true;
          model.fecha_termino_sugerido = model.fecha_termino;
          //registrar
          if (model.fecha_inicio > model.fecha_termino) {
            this.funciones.mensaje("info", "La fecha de inicio no puede ser mayor a la fecha de término.");
          } else {
            if (model.id_suspension_obra == 0) {
              model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
              if (model.nombre_archivo == null) {
                this.funciones.mensaje("info", "Debe adjuntar un documento.");
                this.bMostrar = false;
              } else {
                model.usuario_creacion = sessionStorage.getItem("Usuario");
                //parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase)
                if(this.fecha_inicio_contractual_parametro != "null"){
                  model.es_suspension_inicial=false;
                }else{
                  model.es_suspension_inicial=true;
                  model.id_fase = parseInt(sessionStorage.getItem("idFase"));
                }



                /*if (this.modelSuspension.id_seguimiento_monitoreo_obra == 0) {
                  model.es_suspension_inicial = true;
                  model.id_fase = parseInt(sessionStorage.getItem("idFase"));
                } else {
                  if (sessionStorage.getItem("esSuspension")) {
                    model.es_suspension_inicial = true;
                  } else {
                    model.es_suspension_inicial = false;
                  }
                  model.es_suspension_inicial = false;
                  //model.id_fase = parseInt(sessionStorage.getItem("idFase"));
                }*/
                //model.es_suspension_inicial=true;
                this.fs.suspensionService.insertarSuspensionObra(model).subscribe(
                  respuesta => {
                    this.retornoValores.emit(respuesta);
                    this.modalRef.hide();
                    this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                    this.bMostrar = false;

                    if (this.fecha_inicio_contractual_parametro == "null") {
                      this.router.navigate(['/monitoreo']);
                    }
                  }
                )
              }
            }
            //actualizar
            else {
              model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
              this.fs.suspensionService.modificarSuspensionObra(model).subscribe(
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
      });
    /**fin nueva validacion */
  }

  editarSuspension() {
    this.model = new Suspension();
    this.model.id_suspension_obra = this.modelSuspension.id_suspension_obra;
    this.model.id_seguimiento_monitoreo_obra = this.modelSuspension.id_seguimiento_monitoreo_obra;
    this.model.motivo_suspension = this.modelSuspension.motivo_suspension;
    this.model.fecha_inicio = this.funciones.ConvertStringtoDate(this.modelSuspension.fecha_inicio);
    this.model.fecha_termino = this.funciones.ConvertStringtoDate(this.modelSuspension.fecha_termino);
    this.model.fecha_termino_sugerido = this.funciones.ConvertStringtoDate(this.modelSuspension.fecha_termino);
    this.model.nombre_archivo = this.modelSuspension.archivo_convenio;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.model.perfil = this.modelSuspension.perfil;
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
