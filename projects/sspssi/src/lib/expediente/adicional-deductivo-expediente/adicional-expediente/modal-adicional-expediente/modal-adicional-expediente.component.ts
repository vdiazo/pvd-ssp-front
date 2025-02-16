import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AdicionalExpedienteService } from 'projects/sspssi/src/servicios/expediente/adicional-deductivo/adicional-expediente.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ssi-modal-adicional-expediente',
  templateUrl: './modal-adicional-expediente.component.html',
  styleUrls: ['./modal-adicional-expediente.component.css']
})
export class ModalAdicionalExpedienteComponent implements OnInit {

  id_seguimientoExpediente: number;
  entidadEditar: any;
  tipoArchivoDocumento = tipoArchivo.adicionalExpediente;
  nombreArchivoDocumento: string;
  formRegistroAdicional: FormGroup;
  cambiarEditar = false;
  @Output() retornoValoresAdicional = new EventEmitter();

  constructor(public funciones: Functions, private bsModal: BsModalRef, private fb: FormBuilder, private adicionalExpedienteService: AdicionalExpedienteService) {
    this.formRegistroAdicional = this.fb.group({
      id_adicional_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      monto_presupuesto: [null, Validators.required],
      adenda_aprobacion: [null, Validators.required],
      adenda_fecha: [null],
      observacion: [null],
      nombre_archivo: [null]
    });
  }

  ngOnInit() {
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAdicional.patchValue({
        id_adicional_expediente: this.entidadEditar.id_adicional_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        monto_presupuesto: this.entidadEditar.monto_presupuesto,
        adenda_aprobacion: this.entidadEditar.adenda_aprobacion,
        adenda_fecha: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.adenda_fecha)),
        nombre_archivo: this.entidadEditar.nombre_archivo,
        observacion: this.entidadEditar.observacion,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo == null ? '' : this.entidadEditar.nombre_archivo;
    } else {
      this.formRegistroAdicional.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_seguimientoExpediente,
      });
      this.nombreArchivoDocumento = '';
    }
  }

  registrarAdicional() {
    const adicionalEnvio = Object.assign({}, this.formRegistroAdicional.value);
    adicionalEnvio.monto_presupuesto = this.funciones.castToFloat(adicionalEnvio.monto_presupuesto);
    adicionalEnvio.adenda_fecha = this.funciones.formatDateAAAAMMDD(this.envioFecha(adicionalEnvio.adenda_fecha));
    if (this.cambiarEditar) {
      adicionalEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.adicionalExpedienteService.actualizarAdicionalExpediente(adicionalEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresAdicional.emit(this.id_seguimientoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      adicionalEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.adicionalExpedienteService.registrarAdicionalExpediente(adicionalEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresAdicional.emit(this.id_seguimientoExpediente);
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

  fileChangeEventDocumento(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivoDocumento = evento.uploaded._body;
      this.formRegistroAdicional.patchValue({ nombre_archivo: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
