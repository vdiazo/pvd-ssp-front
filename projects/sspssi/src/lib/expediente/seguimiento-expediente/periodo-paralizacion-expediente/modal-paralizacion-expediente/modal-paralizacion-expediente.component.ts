import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ParalizacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/periodo-paralizacion/paralizacion-expediente.service';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-paralizacion-expediente',
  templateUrl: './modal-paralizacion-expediente.component.html',
  styleUrls: ['./modal-paralizacion-expediente.component.css']
})
export class ModalParalizacionExpedienteComponent implements OnInit {

  formParalizacionExpediente: FormGroup;
  listaAdministrador: any = [];
  tipoArchivoDocumento = tipoArchivo.paralizacionExpediente;
  nombreArchivoDocumento: string;
  fecha_inicio_contractual: Date;
  id_SeguimientoMonitoreoExpediente: number;
  entidadEditar: any;
  cambiarEditar = false;
  @Output() retornoValoresParalizacion = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, public funciones: Functions, private periodoParalizacionService: ParalizacionExpedienteService) {
    this.formParalizacionExpediente = this.fb.group({
      id_paralizacion_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      motivo_paralizacion: [null, Validators.required],
      fecha_inicio: [null],
      fecha_termino: [null],
      nombre_archivo: [null]
    });
  }

  ngOnInit() {
    this.fecha_inicio_contractual = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.fecha_inicio_contractual));
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formParalizacionExpediente.patchValue({
        id_paralizacion_expediente: this.entidadEditar.id_paralizacion_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        motivo_paralizacion: this.entidadEditar.motivo_paralizacion,
        fecha_inicio: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_inicio)),
        fecha_termino: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_termino)),
        nombre_archivo: this.entidadEditar.nombre_archivo,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo == null ? '' : this.entidadEditar.nombre_archivo;

    } else {
      this.formParalizacionExpediente.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_SeguimientoMonitoreoExpediente,
      });
      this.nombreArchivoDocumento = '';
    }

  }

  grabarParalizacion() {
    const paralizacionEnvio = Object.assign({}, this.formParalizacionExpediente.value);
    paralizacionEnvio.fecha_inicio = this.funciones.formatDateAAAAMMDD(this.envioFecha(paralizacionEnvio.fecha_inicio));
    paralizacionEnvio.fecha_termino = this.funciones.formatDateAAAAMMDD(this.envioFecha(paralizacionEnvio.fecha_termino));
    if (this.entidadEditar) {
      paralizacionEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.periodoParalizacionService.modificarPeriodoParalizacionExpediente(paralizacionEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresParalizacion.emit(this.id_SeguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      paralizacionEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.periodoParalizacionService.registrarPeriodoParalizacionExpediente(paralizacionEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresParalizacion.emit(this.id_SeguimientoMonitoreoExpediente);
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

  fileChangeEventDocumento(rpta) {
    if (rpta.uploaded != null) {
      this.nombreArchivoDocumento = rpta.uploaded._body;
      this.formParalizacionExpediente.patchValue({ nombre_archivo: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
