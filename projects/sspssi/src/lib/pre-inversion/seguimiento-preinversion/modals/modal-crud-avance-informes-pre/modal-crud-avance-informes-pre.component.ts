import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { AvanceInformePreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/avance-informe-preinversion.service';

@Component({
  selector: 'ssi-modal-crud-avance-informes-pre',
  templateUrl: './modal-crud-avance-informes-pre.component.html',
  styleUrls: ['./modal-crud-avance-informes-pre.component.css']
})
export class ModalCrudAvanceInformesPreComponent implements OnInit {

  formRegistroAvanceEstudio: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  entidadEditar: any = null;
  cambiarEditar: boolean = false;
  lstNumeroAvanceInforme: any[] = [];
  documentoConformidad: string = '';
  tipoArchivo: number = tipoArchivo.aprobacionEntregablesPreinversion;
  tipoValorizacion: string = '';
  @Output() retornoValores = new EventEmitter();

  constructor(private fb: FormBuilder, private avanceInformeSvc: AvanceInformePreinversionService, private bsModal: BsModalRef, public funciones: Functions) { }

  ngOnInit() {
    this.tipoValorizacion = 'CONTRATO PRINCIPAL';
    this.createForm();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formRegistroAvanceEstudio.patchValue(this.entidadEditar);
      this.formRegistroAvanceEstudio.patchValue({
        fecha_presentacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_presentacion)),
        fecha_conformidad: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_conformidad)),
      });
      this.documentoConformidad = this.entidadEditar.documento_conformidad;
    } else {
      this.listarAvanceInformeComboPreinversion(this.id_seguimientoMonitoreoPreinversion);
    }
  }

  createForm() {
    this.formRegistroAvanceEstudio = this.fb.group({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_avance_informe: 0,
      id_programacion_detalle: [null, Validators.required],
      numero_entregable: null,
      fecha_presentacion: [null, Validators.required],
      fecha_conformidad: [null, Validators.required],
      descripcion_contenido: [null, Validators.required],
      monto_pagado: [null, Validators.required],
      documento_conformidad: null,
    });
  }

  listarAvanceInformeComboPreinversion(idSeguimiento: number) {
    const param = { id_seguimiento: idSeguimiento };
    this.avanceInformeSvc.listarAvanceInformePreinversionCombo(param).subscribe((data: any) => {
      this.lstNumeroAvanceInforme = data.numero_entregable;
    });
  }
  registrarAvanceEstudio() {
    const paramEnvio = { ...{}, ...this.formRegistroAvanceEstudio.value };
    paramEnvio.fecha_presentacion = this.envioFecha(paramEnvio.fecha_presentacion);
    paramEnvio.fecha_conformidad = this.envioFecha(paramEnvio.fecha_conformidad);
    paramEnvio.monto_pagado = this.funciones.castToFloat(paramEnvio.monto_pagado);
    if (this.cambiarEditar) {
      // modificar
      paramEnvio.usuario_modificacion = this.usuario;

      this.avanceInformeSvc.modificarAvanceInformePreinversion(paramEnvio).subscribe(
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

      this.avanceInformeSvc.insertarAvanceInformePreinversion(paramEnvio).subscribe(
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

  get f(): any { return this.formRegistroAvanceEstudio.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  fileChangeEvent(event) {
    if (event.uploaded != null) {
      this.documentoConformidad = event.uploaded._body;
      this.formRegistroAvanceEstudio.patchValue({
        documento_conformidad: this.documentoConformidad
      });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  closeModal() {
    this.bsModal.hide();
  }


}
