import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccionSeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/accion-seguimiento-preinversion.service';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-crud-accion-monitoreo-pre',
  templateUrl: './modal-crud-accion-monitoreo-pre.component.html',
  styleUrls: ['./modal-crud-accion-monitoreo-pre.component.css']
})

export class ModalCrudAccionMonitoreoPreComponent implements OnInit {

  formRegistroAccionMonitoreoEstudio: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  lstAccionMonitoreo: any[] = [];
  lstTipoDocumento: any[] = [];
  entidadEditar: any = null;
  cambiarEditar: boolean = false;
  documentoAccion: string = '';
  tipoArchivo: number = tipoArchivo.accionSeguimientoMonitoreoPreinversion;
  @Output() retornoValores = new EventEmitter();

  constructor(private fb: FormBuilder, private accionMonitoreoSvc: AccionSeguimientoPreinversionService, private bsModal: BsModalRef, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarAccionMonitoreoComboPreinversion();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAccionMonitoreoEstudio.patchValue(this.entidadEditar);
      this.formRegistroAccionMonitoreoEstudio.patchValue({
        fecha_accion_seguimiento: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_accion_seguimiento))
      });
      this.documentoAccion = this.entidadEditar.documento_accion;
    } else {
      this.cambiarEditar = false;
    }
  }

  createForm() {
    this.formRegistroAccionMonitoreoEstudio = this.fb.group({
      id_accion_monitoreo: 0,
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_accion_seguimiento: [null, Validators.required],
      fecha_accion_seguimiento: [null, Validators.required],
      comentario: null,
      id_tipo_documento: [null, Validators.required],
      documento_accion: null,
    });
  }

  listarAccionMonitoreoComboPreinversion() {
    this.accionMonitoreoSvc.listarAccionMonitoreoComboPreInv().subscribe((data: any) => {
      this.lstAccionMonitoreo = data.accion_monitoreo;
      this.lstTipoDocumento = data.tipo_documento;
    });
  }

  registrarAccionMonitoreoEstudio() {
    const paramEnvio = { ...{}, ...this.formRegistroAccionMonitoreoEstudio.value };
    paramEnvio.fecha_accion_seguimiento = this.envioFecha(paramEnvio.fecha_accion_seguimiento);
    if (this.cambiarEditar) {
      // modificar
      paramEnvio.usuario_modificacion = this.usuario;

      this.accionMonitoreoSvc.modificarAccionMonitoreoPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
          this.retornoValores.emit();
          this.closeModal();
        }
      });
    } else {
      // insertar
      paramEnvio.usuario_creacion = this.usuario;

      this.accionMonitoreoSvc.insertarAccionMonitoreoPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
          this.retornoValores.emit();
          this.closeModal();
        }
      });
    }
  }

  get f(): any { return this.formRegistroAccionMonitoreoEstudio.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  fileChangeEvent(event) {
    if (event.uploaded != null) {
      this.documentoAccion = event.uploaded._body;
      this.formRegistroAccionMonitoreoEstudio.patchValue({
        documento_accion: this.documentoAccion
      });
    }
  }

  closeModal() {
    this.bsModal.hide();
  }
}
