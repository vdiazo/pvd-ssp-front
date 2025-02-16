import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { AprobacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/aprobacion-expediente.service';

@Component({
  selector: 'ssi-modal-aprobacion-expediente',
  templateUrl: './modal-aprobacion-expediente.component.html',
  styleUrls: ['./modal-aprobacion-expediente.component.css']
})
export class ModalAprobacionExpedienteComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  tipoArchivoDocumento = tipoArchivo.aprobacionExpediente;
  nombreArchivoDocumento: string;
  formRegistroAprobacionExpediente: FormGroup;
  entidadEditar: any;
  cambiarEditar = false;
  @Output() retornoValoresAprobacionExpediente = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, public funciones: Functions, private aprobacionExpedienteService: AprobacionExpedienteService) {
    this.formRegistroAprobacionExpediente = this.fb.group({
      id_aprobacion_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      fecha_aprobacion: [null],
      resolucion_aprobacion: [null, Validators.required],
      fecha_presupuesto_expediente: [null],
      monto_presupuesto_expediente: [null, Validators.required],
      nombre_archivo_expediente: [null]
    });
  }

  ngOnInit() {
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAprobacionExpediente.patchValue({
        id_aprobacion_expediente: this.entidadEditar.id_aprobacion_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        fecha_aprobacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_aprobacion)),
        resolucion_aprobacion: this.entidadEditar.resolucion_aprobacion,
        fecha_presupuesto_expediente: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_presupuesto_expediente)),
        monto_presupuesto_expediente: this.entidadEditar.monto_presupuesto_expediente,
        nombre_archivo_expediente: this.entidadEditar.nombre_archivo_expediente,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo_expediente == null ? '' : this.entidadEditar.nombre_archivo_expediente;
    } else {
      this.formRegistroAprobacionExpediente.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
      });
      this.nombreArchivoDocumento = '';
    }
  }

  closeModal() {
    this.bsModal.hide();
  }

  registrarAprobacionExpediente() {
    const aprobacionExpedienteEnvio = Object.assign({}, this.formRegistroAprobacionExpediente.value);
    aprobacionExpedienteEnvio.monto_presupuesto_expediente = this.funciones.castToFloat(aprobacionExpedienteEnvio.monto_presupuesto_expediente);
    aprobacionExpedienteEnvio.fecha_aprobacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(aprobacionExpedienteEnvio.fecha_aprobacion));
    aprobacionExpedienteEnvio.fecha_presupuesto_expediente = this.funciones.formatDateAAAAMMDD(this.envioFecha(aprobacionExpedienteEnvio.fecha_presupuesto_expediente));
    if (this.cambiarEditar) {
      aprobacionExpedienteEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.aprobacionExpedienteService.modificarAprobacionExpediente(aprobacionExpedienteEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresAprobacionExpediente.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      aprobacionExpedienteEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.aprobacionExpedienteService.registrarAprobacionExpediente(aprobacionExpedienteEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresAprobacionExpediente.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  fileChangeEventDocumento(evento) {
    if (evento.uploaded != null) {
      this.nombreArchivoDocumento = evento.uploaded._body;
      this.formRegistroAprobacionExpediente.patchValue({ nombre_archivo_expediente: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
