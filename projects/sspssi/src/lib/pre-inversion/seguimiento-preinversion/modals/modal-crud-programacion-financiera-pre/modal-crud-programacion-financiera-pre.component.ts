import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { isUndefined } from 'util';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ProgramacionFinancieraService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/programacion-financiera.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ssi-modal-crud-programacion-financiera-pre',
  templateUrl: './modal-crud-programacion-financiera-pre.component.html',
  styleUrls: ['./modal-crud-programacion-financiera-pre.component.css']
})
export class ModalCrudProgramacionFinancieraPreComponent implements OnInit {

  formProgramacionFinancieraPre: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  fecha_inicio_contractual: Date;
  cambiarEditar: boolean = false;
  entidadEditar: any = null;
  esValidoSumaMontosAvanceProgramado: boolean = false;
  sumaValorizacion: number = 0;
  infoPeriodos: any[] = [];
  montoContratoProgramado: number = 0;
  @Output() retornoValoresFinanciero = new EventEmitter();

  constructor(private fb: FormBuilder, private programacionFinancieraSvc: ProgramacionFinancieraService, private bsModal: BsModalRef, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formProgramacionFinancieraPre.patchValue(this.entidadEditar);
      this.montoContratoProgramado = this.entidadEditar.total_monto_programacion_financiera;
      this.construirCronograma(this.entidadEditar.cronograma);
    } else {
      this.cargarCronogramaFinanciero();
    }
    this.calcularPorcentajeAvanceProgramado();
  }

  createForm() {
    this.formProgramacionFinancieraPre = this.fb.group({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_programacion_financiera: 0,
      fecha_registro: null,
      usuario_creacion: this.getUsuario(),
      activo: true,
      detalleProgramacion: this.fb.array([])
    });
  }

  cargarCronogramaFinanciero() {
    const param = { id_seguimiento: this.id_seguimientoMonitoreoPreinversion };

    this.programacionFinancieraSvc.listarProgramacionFinancieraPreinversionCombo(param).subscribe(
      (data: any) => {
        if (data != null) {
          this.infoPeriodos = data.listado_periodo;
          this.montoContratoProgramado = data.monto_total;
          this.construirCronograma(this.infoPeriodos);
        }
      }
    );
  }

  seleccionarAnioCronograma(event) {
    if (!isUndefined(event)) {
      const anio = event.nro_anio;
      const infoPeriodoMod = this.infoPeriodos.filter(m => m.anio === anio);
      this.construirCronograma(infoPeriodoMod);
    } else {
      const cronograma: FormArray = <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');
      while (cronograma.length !== 0) {
        cronograma.removeAt(0);
      }
    }
  }

  registrarCronogramaFinanciero() {
    this.modificarMontos();
    let paramEnvio = { ...{}, ...this.formProgramacionFinancieraPre.value };
    if (this.cambiarEditar) {
      // editar
      paramEnvio.usuario_modificacion = this.getUsuario();
      this.programacionFinancieraSvc.modificarProgramacionFinancieraPreinversion(paramEnvio).subscribe(
        (data: any) => {
          if (data.resultado > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
            this.retornoValoresFinanciero.emit(data);
            this.closeModal();
          } else {
            this.funciones.alertaSimple('error', '', this.funciones.mostrarMensaje('error', ''), true);
          }
        }
      );
    } else {
      // insertar
      paramEnvio.fecha_registro = this.fecha_inicio_contractual;
      this.programacionFinancieraSvc.insertarProgramacionFinancieraPreinversion(paramEnvio).subscribe(
        (data: any) => {
          if (data.resultado > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
            this.retornoValoresFinanciero.emit(data);
            this.closeModal();
          } else {
            this.funciones.alertaSimple('error', '', this.funciones.mostrarMensaje('error', ''), true);
          }
        }
      );
    }
  }

  get getCronograma(): FormArray {
    return <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');
  }

  construirCronograma(infoPeriodos: any): FormArray {
    let cronograma: FormArray = <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');

    while (cronograma.length !== 0) {
      cronograma.removeAt(0);
    }

    for (let i = 0; i < infoPeriodos.length; i++) {
      cronograma.push(this.fb.group({
        id_detalle_programacion_financiera: infoPeriodos[i].id_detalle_programacion_financiera,
        periodo: infoPeriodos[i].periodo,
        monto_programacion_mensual: infoPeriodos[i].monto_programacion_mensual,
        porcentaje_avance: infoPeriodos[i].porcentaje_avance,
        usuario_creacion: this.getUsuario(),
        activo: true
      }));
    }
    return cronograma;
  }

  modificarMontos(): void {
    const periodos: FormArray = <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');
    periodos.controls.forEach(x => {
      let value = x.value.monto_programacion_mensual;
      let valueAvance = x.value.porcentaje_avance;
      x.value.monto_programacion_mensual = this.funciones.castToFloat(value);
      x.value.porcentaje_avance = this.funciones.castToFloat(valueAvance);
    });
  }

  validarSumaPorcentajes() {
    this.esValidoSumaMontosAvanceProgramado = false;
    const periodos: FormArray = <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');
    let sumaTotal: number = 0;
    periodos.controls.forEach(x => {
      let valueAvance: number = this.funciones.castToFloat(x.value.monto_programacion_mensual);
      sumaTotal = sumaTotal + valueAvance;
    });

    if (sumaTotal > this.montoContratoProgramado) {
      this.esValidoSumaMontosAvanceProgramado = false;
      this.funciones.mensaje('info', 'La suma del avance programado no puede ser mayor a al Monto del Contrato');
      return;
    } else {
      this.esValidoSumaMontosAvanceProgramado = true;
    }
  }

  calcularPorcentajeAvanceProgramado() {
    let pcronograma: FormArray = <FormArray>this.formProgramacionFinancieraPre.get('detalleProgramacion');
    this.sumaValorizacion = 0;
    pcronograma.value.forEach(element => {
      if (element.monto_programacion_mensual != '') {
        let valor: number = this.funciones.castToFloat(element.monto_programacion_mensual);
        this.sumaValorizacion = this.sumaValorizacion + valor;
      }
    });
    pcronograma.value.forEach(element => {
      if (element.monto_programacion_mensual != '') {
        element.porcentaje_avance = this.funciones.fixed(this.funciones.castToFloat(element.monto_programacion_mensual) * 100 / this.sumaValorizacion, 2);
      } else {
        element.porcentaje_avance = 0;
        element.valorizacion = 0;
      }
    });
    this.formProgramacionFinancieraPre.patchValue({
      detalleProgramacion: pcronograma.value
    });
  }

  getUsuario(): string {
    return sessionStorage.getItem('Usuario');
  }

  closeModal() {
    this.bsModal.hide();
  }

}
