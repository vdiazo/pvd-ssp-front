import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { Functions } from 'projects/sspssi/src/appSettings';
import { AccionesSeguimientoExpedienteService } from 'projects/sspssi/src/servicios/expediente/avance-expediente/acciones-seguimiento-expediente.service';

@Component({
  selector: 'ssi-modal-accion-seguimiento-expediente',
  templateUrl: './modal-accion-seguimiento-expediente.component.html',
  styleUrls: ['./modal-accion-seguimiento-expediente.component.css']
})
export class ModalAccionSeguimientoExpedienteComponent implements OnInit {

  formRegistroAccionSeguimiento: FormGroup;
  id_seguimientoMonitoreoExpediente: number;
  id_fase: number;
  bEstado: boolean;
  entidadEditar: any;
  cambiarEditar = false;
  tipoArchivoDocumento = tipoArchivo.accionSeguimientoMonitoreoExpediente;
  nombreArchivoDocumento: string;
  listaTipoDocumentos: any = [];
  @Output() retornoValoresAccion = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, public funciones: Functions, private accionMonitoreoService: AccionesSeguimientoExpedienteService) {
    this.formRegistroAccionSeguimiento = this.fb.group({
      id_accion_seguimiento_ejecucion_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      id_fase: [0],
      fecha: [null],
      descripcion: [null],
      id_tipo_documento_detalle_expediente: [null],
      nombre_archivo: [null]
    });
  }

  ngOnInit() {
    this.listarTipoDocumentoAccionExpediente();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAccionSeguimiento.patchValue({
        id_accion_seguimiento_ejecucion_expediente: this.entidadEditar.id_accion_seguimiento_ejecucion_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        id_fase: this.entidadEditar.id_fase,
        fecha: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha)),
        descripcion: this.entidadEditar.descripcion,
        id_tipo_documento_detalle_expediente: this.entidadEditar.id_tipo_documento_detalle_expediente,
        nombre_archivo: this.entidadEditar.nombre_archivo,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo == null ? '' : this.entidadEditar.nombre_archivo;
    } else {
      this.formRegistroAccionSeguimiento.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
        id_fase: this.id_fase,
      });
      this.nombreArchivoDocumento = '';
    }
  }

  listarTipoDocumentoAccionExpediente() {
    this.accionMonitoreoService.listarTipoDocumentoAccionExpediente().subscribe(
      data => {
        this.listaTipoDocumentos = data;
      }
    );
  }

  grabarAccionSeguimiento() {
    const accionSeguimientoEnvio = Object.assign({}, this.formRegistroAccionSeguimiento.value);
    accionSeguimientoEnvio.id_fase = parseInt(accionSeguimientoEnvio.id_fase, 10);
    accionSeguimientoEnvio.fecha = this.funciones.formatDateAAAAMMDD(this.envioFecha(accionSeguimientoEnvio.fecha));
    if (this.cambiarEditar) {
      accionSeguimientoEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.accionMonitoreoService.modificarAccionSeguimientoMonitoreoExpediente(accionSeguimientoEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresAccion.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      accionSeguimientoEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.accionMonitoreoService.insertarAccionSeguimientoMonitoreoExpediente(accionSeguimientoEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresAccion.emit(this.id_seguimientoMonitoreoExpediente);
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
      this.formRegistroAccionSeguimiento.patchValue({ nombre_archivo: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
