import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeductivoExpedienteService } from 'projects/sspssi/src/servicios/expediente/adicional-deductivo/deductivo-expediente.service';

@Component({
  selector: 'ssi-modal-deductivo-expediente',
  templateUrl: './modal-deductivo-expediente.component.html',
  styleUrls: ['./modal-deductivo-expediente.component.css']
})
export class ModalDeductivoExpedienteComponent implements OnInit {

  tipoArchivoDocumento = tipoArchivo.deductivoExpediente;
  nombreArchivoDocumento: string;
  formRegistroDeductivo: FormGroup;
  entidadEditar: any;
  id_seguimientoExpediente: number;
  cambiarEditar = false;
  @Output() retornoValoresDeductivo = new EventEmitter();
  constructor(private fb: FormBuilder, public funciones: Functions, private bsModal: BsModalRef, private deductivoExpedienteService: DeductivoExpedienteService) {
    this.formRegistroDeductivo = this.fb.group({
      id_deductivo_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      monto_presupuesto: [null, Validators.required],
      adenda_aprobacion: [null, Validators.required],
      adenda_fecha: [null],
      observacion: [null],
      nombre_archivo: [null],
    });
  }

  ngOnInit() {
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroDeductivo.patchValue({
        id_deductivo_expediente: this.entidadEditar.id_deductivo_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        monto_presupuesto: this.entidadEditar.monto_presupuesto,
        adenda_aprobacion: this.entidadEditar.adenda_aprobacion,
        adenda_fecha: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.adenda_fecha)),
        observacion: this.entidadEditar.observacion,
        nombre_archivo: this.entidadEditar.nombre_archivo,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo == null ? '' : this.entidadEditar.nombre_archivo;

    } else {
      this.formRegistroDeductivo.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_seguimientoExpediente,
      });
      this.nombreArchivoDocumento = '';
    }

  }

  registrarDeductivo() {
    const deductivoEnvio = Object.assign({}, this.formRegistroDeductivo.value);
    deductivoEnvio.monto_presupuesto = this.funciones.castToFloat(deductivoEnvio.monto_presupuesto);
    deductivoEnvio.adenda_fecha = this.funciones.formatDateAAAAMMDD(this.envioFecha(deductivoEnvio.adenda_fecha));
    if (this.cambiarEditar) {
      deductivoEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.deductivoExpedienteService.actualizarDeductivoExpediente(deductivoEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresDeductivo.emit(this.id_seguimientoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      deductivoEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.deductivoExpedienteService.registrarDeductivoExpediente(deductivoEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresDeductivo.emit(this.id_seguimientoExpediente);
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

  fileChangeEventDocumento(evento) {
    if (evento.uploaded != null) {
      this.nombreArchivoDocumento = evento.uploaded._body;
      this.formRegistroDeductivo.patchValue({ nombre_archivo: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
