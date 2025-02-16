import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { LiquidacionPreinversionService } from 'projects/sspssi/src/servicios/preinversion/aprobacion-liquidacion/liquidacion-preinversion.service';

@Component({
  selector: 'ssi-modal-crud-aprobacion-liquidacion-estudio-pre',
  templateUrl: './modal-crud-aprobacion-liquidacion-estudio-pre.component.html',
  styleUrls: ['./modal-crud-aprobacion-liquidacion-estudio-pre.component.css']
})
export class ModalCrudAprobacionLiquidacionEstudioPreComponent implements OnInit {
  formRegistroLiquidacion: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  cambiarEditar: boolean = false;
  entidadEditar: any = null;
  nombreDocumentoInformeAprobacion: string = '';
  nombreDocumentoInformeDireccionAprobacion: string = '';
  nombreDocumentoLiquidacion: string = '';
  tipoArchivoInformeAprobacion: number = tipoArchivo.informeAprobacionPreinversion;
  tipoArchivoInformeAprobacionDireccion: number = tipoArchivo.informeAprobacionDireccionPreinversion;
  tipoArchivo: number = tipoArchivo.resolucionAprobacionLiquidacionContratoPreinversion;
  @Output() retornoValores = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private aprobacionLiquidacionPreSvc: LiquidacionPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroLiquidacion.patchValue(this.entidadEditar);
      this.formRegistroLiquidacion.patchValue({
        fecha_informe_aprobacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_informe_aprobacion)),
        fecha_aprobacion_resolucion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_aprobacion_resolucion)),
        fecha_resolucion_liquidacion: this.entidadEditar.fecha_resolucion_liquidacion != null ? this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_resolucion_liquidacion)) : null,
      });
      this.nombreDocumentoInformeAprobacion = this.entidadEditar.nombre_documento_informe_aprobacion;
      this.nombreDocumentoInformeDireccionAprobacion = this.entidadEditar.nombre_documento_resolucion_aprobacion;
      this.nombreDocumentoLiquidacion = this.entidadEditar.nombre_documento_liquidacion;
    } else {
      this.cambiarEditar = false;
    }
  }

  createForm() {
    this.formRegistroLiquidacion = this.fb.group({
      id_liquidacion: 0,
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      fecha_informe_aprobacion: [null, Validators.required],
      nombre_documento_informe_aprobacion: null,
      fecha_aprobacion_resolucion: [null, Validators.required],
      nombre_documento_resolucion_aprobacion: null,
      resolucion_liquidacion: null,
      fecha_resolucion_liquidacion: null,
      monto_liquidacion: null,
      nombre_documento_liquidacion: null,
    });
  }

  registrarLiquidacionEstudio() {
    const paramEnvio = { ...{}, ...this.formRegistroLiquidacion.value };
    paramEnvio.monto_liquidacion = this.funciones.castToFloat(paramEnvio.monto_liquidacion);
    paramEnvio.fecha_informe_aprobacion = this.envioFecha(paramEnvio.fecha_informe_aprobacion);
    paramEnvio.fecha_aprobacion_resolucion = this.envioFecha(paramEnvio.fecha_aprobacion_resolucion);
    paramEnvio.fecha_resolucion_liquidacion = paramEnvio.fecha_resolucion_liquidacion != null ? this.envioFecha(paramEnvio.fecha_resolucion_liquidacion) : null;

    if (this.cambiarEditar) {
      // modificar
      paramEnvio.usuario_modificacion = this.usuario;
      this.aprobacionLiquidacionPreSvc.modificarAprobacionLiquidacionPreinversion(paramEnvio).subscribe(
        (data: any) => {
          if (data.resultado > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
            this.retornoValores.emit();
            this.closeModal();
          }
        }
      );
    } else {
      // insertar
      paramEnvio.usuario_creacion = this.usuario;
      this.aprobacionLiquidacionPreSvc.insertarAprobacionLiquidacionPreinversion(paramEnvio).subscribe(
        (data: any) => {
          if (data.resultado > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
            this.retornoValores.emit();
            this.closeModal();
          }
        }
      );
    }
  }

  get f(): any { return this.formRegistroLiquidacion.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  fileChangeEventInformeAprobacion(event) {
    if (event.uploaded != null) {
      this.nombreDocumentoInformeAprobacion = event.uploaded._body;
      this.formRegistroLiquidacion.patchValue({
        nombre_documento_informe_aprobacion: this.nombreDocumentoInformeAprobacion
      });
    }
  }

  fileChangeEventInformeDireccionAprobacion(event) {
    if (event.uploaded != null) {
      this.nombreDocumentoInformeDireccionAprobacion = event.uploaded._body;
      this.formRegistroLiquidacion.patchValue({
        nombre_documento_resolucion_aprobacion: this.nombreDocumentoInformeDireccionAprobacion
      });
    }
  }
  fileChangeEvent(event) {
    if (event.uploaded != null) {
      this.nombreDocumentoLiquidacion = event.uploaded._body;
      this.formRegistroLiquidacion.patchValue({
        nombre_documento_liquidacion: this.nombreDocumentoLiquidacion
      });
    }
  }

  closeModal() {
    this.bsModal.hide();
  }
}
