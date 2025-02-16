import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { CronogramaPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/cronograma-preinversion.service'
import { isUndefined } from 'util';

@Component({
  selector: 'ssi-modal-crud-programacion-estudio-pre',
  templateUrl: './modal-crud-programacion-estudio-pre.component.html',
  styleUrls: ['./modal-crud-programacion-estudio-pre.component.css']
})
export class ModalCrudProgramacionEstudioPreComponent implements OnInit {

  formRegistroProgramacionEstudio: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  fecha_inicio_contractual: Date;
  numeroEntregables: number = 0;
  entidadEditar: any = null;
  cambiarEditar: boolean = false;
  lstDocumentoAprobacion: any[] = [];
  tipoArchivo: number = tipoArchivo.cronogramaEntregables;
  @Output() retornoValores = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private programacionSvc: CronogramaPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.numeroEntregables = this.entidadEditar.nro_entregable;
      for (let i = 0; i < this.entidadEditar.detalle.length; i++) {
        this.entregable.push(this.createEntregable(i + 1));
      }
      this.formRegistroProgramacionEstudio.patchValue(this.entidadEditar);
      this.formRegistroProgramacionEstudio.patchValue({
        fecha_aprobacion: (this.entidadEditar.fecha_aprobacion != null) ? new Date(this.entidadEditar.fecha_aprobacion) : null,
      });
    } else {
      this.listarProgramacionCombo();
      this.cambiarEditar = false;
    }
  }

  createForm() {
    this.formRegistroProgramacionEstudio = this.fb.group({
      id_programacion: 0,
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      nro_entregable: [null, Validators.required],
      id_seguimiento_actividad: [null, Validators.required],
      documento_aprueba: null,
      fecha_aprobacion: this.fecha_inicio_contractual,
      monto_total: null,
      detalle: this.fb.array([])
    });
  }

  listarProgramacionCombo() {
    const param = { id_seguimiento: this.id_seguimientoMonitoreoPreinversion };
    this.programacionSvc.listarProgramacionComboPreInv(param).subscribe((data: any) => {
      if (data != null) {
        this.lstDocumentoAprobacion = data.documento_aprueba;
      }
    });
  }

  registrarProgramacionEstudio() {
    this.modificarMontos();
    const paramEnvio = { ...{}, ...this.formRegistroProgramacionEstudio.value };

    if (this.cambiarEditar) {
      //modificar programacion
      paramEnvio.usuario_modificacion = this.usuario;
      this.programacionSvc.modificarProgramacionPreinversion(paramEnvio).subscribe((data: any) => {
        if (data != null) {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
            this.retornoValores.emit(0);
            this.closeModal();
          }
        }
      });
    } else {
      // nuevo registro
      paramEnvio.usuario_creacion = this.usuario;

      this.programacionSvc.insertarProgramacionPreinversion(paramEnvio).subscribe((data: any) => {
        if (data != null) {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
            this.retornoValores.emit(0);
            this.closeModal();
          }
        }
      });
    }
  }

  seleccionarDocumentoAprueba(event) {
    if (!isUndefined(event)) {
      this.f.documento_aprueba.setValue(event.documento_aprueba);
    } else {
      this.f.documento_aprueba.setValue('');
    }
  }

  get f(): any { return this.formRegistroProgramacionEstudio.controls; }

  get entregable(): FormArray { return this.f.detalle as FormArray; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  crearEntregables(event: any) {
    const cantidad = this.f.nro_entregable.value;

    while (this.entregable.length !== 0) {
      this.entregable.removeAt(0);
    }

    for (let i = 0; i < cantidad; i++) {
      this.entregable.push(this.createEntregable(i + 1));
    }
  }

  createEntregable(i: number): FormGroup {
    return this.fb.group({
      id_programacion_detalle: 0,
      nro_entregable: `Informe ${i}`,
      descripcion_contenido: [null, Validators.required],
      plazo_entrega: [null, Validators.required],
      monto: [null, Validators.required],
      fecha_entrega_programada: null,
      activo: true,
    });
  }

  modificarMontos(): void {
    let sumaTotal: number = 0;
    let sumaDiasPlazo: number = 0;
    this.entregable.controls.forEach(x => {
      let value = x.value.monto;
      sumaDiasPlazo = sumaDiasPlazo + Number.parseFloat(x.value.plazo_entrega);

      let valueAvance: number = this.funciones.castToFloat(value);
      sumaTotal = sumaTotal + valueAvance;

      x.value.monto = this.funciones.castToFloat(value);
      x.value.fecha_entrega_programada = this.setFechaEntregaProgramada(this.f.fecha_aprobacion.value, sumaDiasPlazo);
    });
    this.formRegistroProgramacionEstudio.patchValue({
      monto_total: sumaTotal
    });
  }

  setFechaEntregaProgramada(fecha, dias: number) {
    let fechaTermino: any;
    if (dias != 0) {
      dias = dias > 0 ? dias - 1 : dias;

      fechaTermino = this.funciones.SumDaytoDate(new Date(fecha), dias);
    } else {
      fechaTermino = fecha;
    }

    return fechaTermino;
  }

  closeModal() {
    this.bsModal.hide();
  }

}
