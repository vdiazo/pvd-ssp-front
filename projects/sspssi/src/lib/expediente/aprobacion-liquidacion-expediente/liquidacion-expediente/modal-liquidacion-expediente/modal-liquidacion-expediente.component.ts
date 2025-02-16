import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LiquidacionContratoExpedienteService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/liquidacion-contrato-expediente.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';

@Component({
  selector: 'ssi-modal-liquidacion-expediente',
  templateUrl: './modal-liquidacion-expediente.component.html',
  styleUrls: ['./modal-liquidacion-expediente.component.css']
})
export class ModalLiquidacionExpedienteComponent implements OnInit {

  listaEstadoLiquidacion: any = [];
  listaDocumentoLiquidacion: any = [];
  formRegistroLiquidacionExpediente: FormGroup;
  id_SeguimientoMonitoreoExpediente: number;
  entidadEditar: any;
  cambiarEditar = false;
  tipoArchivoDocumento = tipoArchivo.archivoLiquidacionExpediente;
  nombreArchivoDocumento: string;
  @Output() retornoValoresLiquidacion = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, public funciones: Functions, private liquidacionExpedienteService: LiquidacionContratoExpedienteService) {
    this.formRegistroLiquidacionExpediente = this.fb.group({
      id_liquidacion_seguimiento_expediente: [0],
      id_seguimiento_ejecucion_expediente: [0],
      resolucion_liquidacion_expediente: [null],
      fecha_liquidacion_resolucion_expediente: [null],
      monto_liquidacion_expediente: [null],
      observacion: [null],
      nombre_archivo_liquidacion_expediente: [null],
    });
  }
  ngOnInit() {
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroLiquidacionExpediente.patchValue({
        id_liquidacion_seguimiento_expediente: this.entidadEditar.id_liquidacion_seguimiento_expediente,
        id_seguimiento_ejecucion_expediente: this.entidadEditar.id_seguimiento_ejecucion_expediente,
        resolucion_liquidacion_expediente: this.entidadEditar.resolucion_liquidacion_expediente,
        fecha_liquidacion_resolucion_expediente: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_liquidacion_resolucion_expediente)),
        monto_liquidacion_expediente: this.entidadEditar.monto_liquidacion_expediente,
        observacion: this.entidadEditar.observacion,
        nombre_archivo_liquidacion_expediente: this.entidadEditar.nombre_archivo_liquidacion_expediente,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo_liquidacion_expediente == null ? '' : this.entidadEditar.nombre_archivo_liquidacion_expediente;
    } else {
      this.formRegistroLiquidacionExpediente.patchValue({
        id_seguimiento_ejecucion_expediente: this.id_SeguimientoMonitoreoExpediente,
      });
      this.nombreArchivoDocumento = '';
    }
  }

  registrarLiquidacionExpediente() {
    const liquidacionExpedienteEnvio = Object.assign({}, this.formRegistroLiquidacionExpediente.value);
    liquidacionExpedienteEnvio.monto_liquidacion_expediente = this.funciones.castToFloat(liquidacionExpedienteEnvio.monto_liquidacion_expediente);
    liquidacionExpedienteEnvio.fecha_liquidacion_resolucion_expediente = this.funciones.formatDateAAAAMMDD(this.envioFecha(liquidacionExpedienteEnvio.fecha_liquidacion_resolucion_expediente));
    if (this.cambiarEditar) {
      liquidacionExpedienteEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.liquidacionExpedienteService.modificarLiquidacionExpediente(liquidacionExpedienteEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresLiquidacion.emit(this.id_SeguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      liquidacionExpedienteEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.liquidacionExpedienteService.registrarLiquidacionExpediente(liquidacionExpedienteEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresLiquidacion.emit(this.id_SeguimientoMonitoreoExpediente);
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
      this.formRegistroLiquidacionExpediente.patchValue({ nombre_archivo_liquidacion_expediente: this.nombreArchivoDocumento });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
