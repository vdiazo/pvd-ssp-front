import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { FacadeService } from '../../../patterns/facade.service';
import { IValorizaciones, IEstadosSituacionales, IAdicionales, IAccionSegMonitoreo } from '../../../../lib/Interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funciones } from '../../../../appSettings/funciones';

@Component({
  selector: 'set-modal-registrar',
  templateUrl: './modal-registrar.component.html',
  styleUrls: ['./modal-registrar.component.css']
})
export class ModalRegistrarComponent implements OnInit {

  seguimientoMonitoreoAccion: IAccionSegMonitoreo
  listaPeriodosValorizaciones: IValorizaciones[]
  listaPeriodosAdicionales: IAdicionales[]
  listaEstados: IEstadosSituacionales[]
  listaValorizacion: any[];
  IdTipoArchivo: number = tipoArchivo.valorizaciones;
  fecha_inicio_contractual: Date;

  formGroup: FormGroup
  bMostrar: boolean = false;
  nombreArchivo: string = "";
  activarTransferencia:boolean=false;

  file:any;

  ngOnInit(): void {
    this.listarPeriodosValorizacion(this.seguimientoMonitoreoAccion.id_valorizacion_ejecucion_expediente);
    this.listarEstadoSituacional();
    this.crearForm();
  }

  constructor(public modalRef: BsModalRef,
    private fs: FacadeService,
    public funciones: Funciones,
    private fb: FormBuilder) { }

  listarPeriodosValorizacion(Id_accion_seguimiento_monitoreo_obra: number) {
    this.fs.valorizacionesService.listarPeriodos(this.seguimientoMonitoreoAccion.id_seguimiento_ejecucion_expediente, Id_accion_seguimiento_monitoreo_obra).subscribe(
      data => {
        this.listaPeriodosValorizaciones = data.valorizacion;
        this.listaPeriodosAdicionales = data.adicionales;
      }
    );
  }

  listarEstadoSituacional() {
    this.fs.maestraService.listarEstadosSituacional().subscribe(
      data => {
        this.listaEstados = data.estado_situacional_valorizacion;
      }
    );
  }

  crearForm(): void {
    this.formGroup = this.fb.group(
      {
        avance_financiero_programado: [null, Validators.required],
        avance_financiero_real: [null, Validators.required],
        avance_fisico_programado: [null, Validators.required],
        avance_fisico_real: [null, Validators.required],
        fecha_valorizacion: [null, Validators.required],
       //id_accion_seguimiento_monitoreo_obra: [this.seguimientoMonitoreoAccion.id_accion_seguimiento_monitoreo_obra],
        id_valorizacion_ejecucion_expediente: [this.seguimientoMonitoreoAccion.id_valorizacion_ejecucion_expediente],
        id_estado_situacional_valorizacion_expediente: [null, Validators.required],
        id_seguimiento_ejecucion_expediente: [this.seguimientoMonitoreoAccion.id_seguimiento_ejecucion_expediente],
        monto: [0],
        nombre_archivo: [null, Validators.required],//this.nombreArchivo,
        observacion: [""],
        periodo: [null],
        periodo_adicional: [null],
        usuario_creacion: sessionStorage.getItem("Usuario"),
        usuario_modificacion: sessionStorage.getItem("Usuario"),
      }
    )

    if (this.seguimientoMonitoreoAccion.id_valorizacion_ejecucion_expediente > 0) {
      this.formGroup.patchValue(
        this.seguimientoMonitoreoAccion
      );

      this.cambiarEstado(this.seguimientoMonitoreoAccion.id_estado_situacional_valorizacion_expediente, this.seguimientoMonitoreoAccion.periodo, this.seguimientoMonitoreoAccion.periodo_adicional);

      Object.assign(this.listArchivosSeleccionados, this.seguimientoMonitoreoAccion.lista_archivos);
      this.listArchivosSeleccionados.map(data => this.listArchivosSeleccionadosTemporal.push(data.nombre_archivo));
    }
    else {
      this.mostrarSeleccionValorizacion = true;
      this.formGroup.controls['periodo'].disable();
    }


  }

  mostrarSeleccionValorizacion: boolean;

  cambiarEstado(id_estado_situacional, periodo: string = null, periodoAdicional: string = null) {
    this.mostrarSeleccionValorizacion = (id_estado_situacional == 1 || id_estado_situacional == 3);

    this.formGroup.patchValue({
      periodo_adicional: periodoAdicional,
      periodo: periodo
    })

    if (this.mostrarSeleccionValorizacion) {

      this.formGroup.controls['periodo'].enable();
      this.formGroup.controls['periodo_adicional'].disable();

      this.formGroup.controls["periodo"].setValidators(Validators.required);
      this.formGroup.controls["periodo_adicional"].clearValidators();

    } else {

      this.formGroup.controls["periodo_adicional"].setValidators(Validators.required);
      this.formGroup.controls["periodo"].clearValidators();

      this.formGroup.controls['periodo_adicional'].enable();
      this.formGroup.controls['periodo'].disable();
    }
  }

  /*fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
      this.formGroup.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }*/

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
      this.nombreArchivo=evento.file.name;
      this.formGroup.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  arrArchivosEnvio = [];
  contador: number = 0;
  listArchivosSeleccionados = [];
  listArchivosSeleccionadosTemporal = [];
  listaArchivosEliminados = [];

  fileChangeEventList(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      if (this.listArchivosSeleccionadosTemporal != null && this.listArchivosSeleccionadosTemporal != undefined) {
        if (this.listArchivosSeleccionadosTemporal.indexOf(evento.nombre) == -1) {
          this.listArchivosSeleccionados.push({ "nombre_archivo": evento.nombre, "archivo": evento.uploaded });
          this.listArchivosSeleccionadosTemporal.push(evento.nombre);
          let InputSalida: HTMLInputElement = document.getElementsByName("fileValorizacionesmodal")[0] as HTMLInputElement;
          InputSalida.value = "";
          evento.target.value = '';
          this.registrarArchivoData(evento.file);
        } else {
          this.funciones.mensaje("info", "Ya existe un archivo con el nombre ingresado.");
        }
      }
    }
  }

  registrarArchivoData(file: any) {
    this.arrArchivosEnvio.push({ "identificador": "uploadFile" + this.contador.toString(), "archivo": file, "nombre_archivo": file.name });
    this.contador++;
  }

  eliminarArchivoSeleccionado(aSeleccionado) {
    if (this.listArchivosSeleccionados != null && this.listArchivosSeleccionados != undefined) {
      for (let i = 0; i < this.listArchivosSeleccionados.length; i++) {
        if (this.listArchivosSeleccionados[i].nombre_archivo == aSeleccionado.nombre_archivo) {

          if (!this.listArchivosSeleccionados[i].hasOwnProperty('archivo')) {
            this.listaArchivosEliminados.push(
              {
                nombre_archivo: aSeleccionado.nombre_archivo,
                id_accion_seguimiento_monitoreo_obra_archivo: this.listArchivosSeleccionados[i].id_accion_seguimiento_monitoreo_obra_archivo
              });
          }

          this.listArchivosSeleccionados.splice(i, 1);
          this.listArchivosSeleccionadosTemporal.splice(i, 1);

          let index = this.arrArchivosEnvio.findIndex(x => x.nombre_archivo === aSeleccionado.nombre_archivo);
          this.arrArchivosEnvio.splice(index, 1);
        }
      }
    }
  }

  @Output() retornoValores = new EventEmitter();

  Grabar() {
    this.bMostrar = true;
    let fecha_valorizacion: Date;

    if (this.formGroup.get("fecha_valorizacion").value.toString().length == 10) {
      fecha_valorizacion = this.funciones.ConvertStringtoDate(this.formGroup.get("fecha_valorizacion").value)
    } else {
      fecha_valorizacion = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.formGroup.get("fecha_valorizacion").value))
    }

    this.formGroup.patchValue({
      avance_financiero_programado: this.funciones.castToFloat(this.formGroup.get("avance_financiero_programado").value),
      avance_financiero_real: this.funciones.castToFloat(this.formGroup.get("avance_financiero_real").value),
      fecha_valorizacion: fecha_valorizacion
    })

    let idSegMonitoreoObra: number = this.formGroup.get("id_seguimiento_ejecucion_expediente").value
    let idAccionSegMonitoreoObra: number = this.formGroup.get("id_valorizacion_ejecucion_expediente").value
    let idEstadoSituacional: number = this.formGroup.get("id_estado_situacional_valorizacion_expediente").value

    this.fs.valorizacionesService.validarValorizacionesMonto(idSegMonitoreoObra, idAccionSegMonitoreoObra, 0, idEstadoSituacional, this.formGroup.get("avance_fisico_real").value).subscribe(
      data => {
        let valid;
        valid = data as any;
        if (valid.estado) {
          this.fs.valorizacionesService.validarValorizacionesMonto(idSegMonitoreoObra, idAccionSegMonitoreoObra, 1, idEstadoSituacional, this.formGroup.get("avance_fisico_programado").value).subscribe(
            validar => {
              let valid2;
              valid2 = validar as any;
              if (valid2.estado) {
                if (idAccionSegMonitoreoObra == 0) {
                  this.fs.valorizacionesService.registrarValorizacionConArchivos(this.formGroup.value, this.arrArchivosEnvio,this.file).subscribe(
                    respuesta => {
                      if (respuesta > 0) {
                        this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                        this.retornoValores.emit(respuesta);
                        this.modalRef.hide();
                      } else {
                        this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
                      }
                      this.bMostrar = false;
                    }
                  )
                }
                //actualizar
                else {
                 this.formGroup.patchValue({
                    nombre_archivo: (this.nombreArchivo == '' ? this.seguimientoMonitoreoAccion.nombre_archivo : this.seguimientoMonitoreoAccion.nombre_archivo),
                  })

                  this.fs.valorizacionesService.ModificarValorizacionConArchivos(this.formGroup.value, this.arrArchivosEnvio, this.listaArchivosEliminados,this.file).subscribe(
                    respuesta => {
                      if (respuesta > 0) {
                        this.retornoValores.emit(respuesta);
                        this.modalRef.hide();
                        this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
                      } else {
                        this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
                      }
                      this.bMostrar = false;
                    }
                  );
                }
              } else {
                if (valid2 == "") {
                  this.funciones.mensaje("info", "Hubo un error con el servicio de búsqueda. Consulte con el administrador del sistema.");
                } else {
                  this.funciones.mensaje("info", "El porcentaje de avance Físico Programado ha excedido el 100%.");
                }
                this.bMostrar = false;
              }
            }
          );
        } else {
          if (valid == "") {
            this.funciones.mensaje("info", "Hubo un error con el servicio de búsqueda. Consulte con el administrador del sistema.");
          } else {
            this.funciones.mensaje("info", "El porcentaje de avance Físico Real ha excedido el 100%.");
          }
          this.bMostrar = false;
        }
      }
    );

    /*if (idAccionSegMonitoreoObra == 0) {
      this.fs.valorizacionesService.registrarValorizacionConArchivos(this.formGroup.value, this.arrArchivosEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.retornoValores.emit(respuesta);
            this.modalRef.hide();
          } else {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      )
    }
    //actualizar
    else {
      this.fs.valorizacionesService.ModificarValorizacionConArchivos(this.formGroup.value, this.arrArchivosEnvio, this.listaArchivosEliminados).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.retornoValores.emit(respuesta);
            this.modalRef.hide();
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
          } else {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      );
    }*/
      
  }
  verArchivoSeleccionado(param:any):void{

  }

}
