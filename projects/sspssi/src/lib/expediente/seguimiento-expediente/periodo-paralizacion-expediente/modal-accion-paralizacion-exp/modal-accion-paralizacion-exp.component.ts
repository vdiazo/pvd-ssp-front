import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { AccionParalizacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/periodo-paralizacion/accion-paralizacion-expediente.service';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-accion-paralizacion-exp',
  templateUrl: './modal-accion-paralizacion-exp.component.html',
  styleUrls: ['./modal-accion-paralizacion-exp.component.css']
})
export class ModalAccionParalizacionExpComponent implements OnInit {

  formRegistroAccionSeguimientoParalizacion: FormGroup;
  idParalizacionExpediente: number;
  fecha_inicio_contractual: Date;
  nombreArchivoDocumento: string;
  listaTipoDocumentos: any = [];
  rptaListaAccionParalizacion: any = [];
  tipoArchivoDocumento = tipoArchivo.AccionParalizacionExpediente;
  entidadEditar: any;
  cambiarEditar = false;
  @Output() retornoValoresAccionParalizacion = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private accionParalizacionService: AccionParalizacionExpedienteService, public funciones: Functions) {
    this.formRegistroAccionSeguimientoParalizacion = this.fb.group({
      id_paralizacion_accion_expediente: [0],
      id_paralizacion_expediente: [0],
      id_tipo_documento_detalle_expediente: [null],
      fecha_accion: [null],
      observacion_accion: [null],
      nombre_archivo_accion: [null],
    });
  }

  ngOnInit() {
    this.listarTipoDocumentoAccionParalizacion();
    this.fecha_inicio_contractual = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.fecha_inicio_contractual));
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAccionSeguimientoParalizacion.patchValue({
        id_paralizacion_accion_expediente: this.entidadEditar.id_paralizacion_accion_expediente,
        id_paralizacion_expediente: this.entidadEditar.id_paralizacion_expediente,
        id_tipo_documento_detalle_expediente: this.entidadEditar.id_tipo_documento_detalle_expediente,
        fecha_accion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_accion)),
        observacion_accion: this.entidadEditar.observacion_accion,
        nombre_archivo_accion: this.entidadEditar.nombre_archivo_accion,
        ruta_archivo_accion: this.entidadEditar.ruta_archivo_accion,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo_accion == null ? '' : this.entidadEditar.nombre_archivo_accion;
    } else {
      this.formRegistroAccionSeguimientoParalizacion.patchValue({
        id_paralizacion_expediente: this.idParalizacionExpediente,
      });
      this.nombreArchivoDocumento = '';
    }
  }

  listarTipoDocumentoAccionParalizacion() {
    this.accionParalizacionService.listarTipoDocumentoAccionParalizacion().subscribe(
      data => {
        this.listaTipoDocumentos = data;
      }
    );
  }

  grabarAccionSeguimientoParalizacion() {
    const accionParalizacionEnvio = Object.assign({}, this.formRegistroAccionSeguimientoParalizacion.value);
    accionParalizacionEnvio.fecha_accion = this.funciones.formatDateAAAAMMDD(this.envioFecha(accionParalizacionEnvio.fecha_accion));
    if (this.cambiarEditar) {
      accionParalizacionEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.accionParalizacionService.modificarAccionPeriodoParalizacionExpediente(accionParalizacionEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresAccionParalizacion.emit(accionParalizacionEnvio.id_paralizacion_expediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      accionParalizacionEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.accionParalizacionService.registrarAccionPeriodoParalizacionExpediente(accionParalizacionEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresAccionParalizacion.emit(accionParalizacionEnvio.id_paralizacion_expediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  closeModal() {
    this.bsModal.hide();
  }

  fileChangeEventDocumento(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivoDocumento = rpta.uploaded._body;
      this.formRegistroAccionSeguimientoParalizacion.patchValue({ nombre_archivo_accion: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
