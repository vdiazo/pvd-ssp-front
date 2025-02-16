import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { isUndefined } from 'util';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { PlanillonService } from 'projects/sspssi/src/servicios/planillon/planillon.service';

@Component({
  selector: 'ssi-modal-crud-progra-financiera-exp',
  templateUrl: './modal-crud-progra-financiera-exp.component.html',
  styleUrls: ['./modal-crud-progra-financiera-exp.component.css']
})
export class ModalCrudPrograFinancieraExpComponent implements OnInit {

  formProgramacionFinancieraExp: FormGroup;
  bMostrar: boolean = false;
  cambiarEditar: boolean = false;
  esValidoSumaMontosAvanceProgramado: boolean = false;
  sumaValorizacion: number = 0;
  entidadEditar: any;
  id_seguimientoMonitoreoExpediente: number;
  @Output() retornoValoresCronograma = new EventEmitter();
  infoPeriodos: any = [];

  constructor(private bsModal: BsModalRef, private facadeSvc: FacadeService, private cronogramaFinancieroSvc: PlanillonService, private fb: FormBuilder, public funciones: Functions) { }

  ngOnInit() {
    this.createform();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formProgramacionFinancieraExp.patchValue(this.entidadEditar);
      this.construirCronograma(this.entidadEditar.cronograma);
    } else {
      this.cargarCronogramaFinanciero();
    }
    this.calcularPorcentajeAvanceProgramado();
  }

  createform() {
    this.formProgramacionFinancieraExp = this.fb.group({
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
      id_programacion_financiera_expediente: 0,
      fecha_registro: null,
      usuario_creacion: this.getUsuario(),
      activo: true,
      programacion: this.fb.array([])
    });
  }

  cargarCronogramaFinanciero() {
    // this.construirCronograma(this.infoPeriodos);

    this.cronogramaFinancieroSvc.listarTipoProgramacionFinancieraExpTecnico(this.id_seguimientoMonitoreoExpediente).subscribe(
      (data: any) => {
        if (data != null) {
          this.infoPeriodos = data;
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
      const cronograma: FormArray = <FormArray>this.formProgramacionFinancieraExp.get('programacion');
      while (cronograma.length !== 0) {
        cronograma.removeAt(0);
      }
    }
  }

  registrarCronogramaFinanciero() {
    this.modificarMontos();
    let paramEnvio = { ...{}, ...this.formProgramacionFinancieraExp.value };
    if (this.cambiarEditar) {
      // editar
      paramEnvio.usuario_modificacion = this.getUsuario();
      this.cronogramaFinancieroSvc.modificarProgramacionFinancieraExpTecnico(paramEnvio).subscribe(
        data => {
          if (data > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
            this.retornoValoresCronograma.emit(data);
            this.closeModal();
          } else {
            this.funciones.alertaSimple('error', '', this.funciones.mostrarMensaje('error', ''), true);
          }
        }
      );
    } else {
      // insertar
      paramEnvio.fecha_registro = this.funciones.formatFullDateIso(Date.now());
      this.cronogramaFinancieroSvc.insertarProgramacionFinancieraExpTecnico(paramEnvio).subscribe(
        data => {
          if (data > 0) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
            this.retornoValoresCronograma.emit(data);
            this.closeModal();
          } else {
            this.funciones.alertaSimple('error', '', this.funciones.mostrarMensaje('error', ''), true);
          }
        }
      );
    }
  }

  get getCronograma(): FormArray {
    return <FormArray>this.formProgramacionFinancieraExp.get('programacion');
  }

  construirCronograma(infoPeriodos: any): FormArray {
    let cronograma: FormArray = <FormArray>this.formProgramacionFinancieraExp.get('programacion');

    while (cronograma.length !== 0) {
      cronograma.removeAt(0);
    }

    for (let i = 0; i < infoPeriodos.length; i++) {
      cronograma.push(this.fb.group({
        id_detalle_programacion_financiera_expediente: infoPeriodos[i].id_detalle_programacion_financiera_expediente,
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
    const periodos: FormArray = <FormArray>this.formProgramacionFinancieraExp.get('programacion');
    periodos.controls.forEach(x => {
      let value = x.value.monto_programacion_mensual;
      let valueAvance = x.value.porcentaje_avance;
      x.value.monto_programacion_mensual = this.funciones.castToFloat(value);
      x.value.porcentaje_avance = this.funciones.castToFloat(valueAvance);
    });
  }

  validarSumaPorcentajes() {
    this.esValidoSumaMontosAvanceProgramado = false;
    const periodos: FormArray = <FormArray>this.formProgramacionFinancieraExp.get('programacion');
    let sumaTotal: number = 0;
    periodos.controls.forEach(x => {
      let valueAvance: number = Number.parseFloat(x.value.porcentaje_avance);
      sumaTotal = sumaTotal + valueAvance;
    });

    if (sumaTotal > 100) {
      this.esValidoSumaMontosAvanceProgramado = false;
      this.funciones.mensaje('info', 'La suma del avance programado no puede ser mayor a 100');
      return;
    } else {
      this.esValidoSumaMontosAvanceProgramado = true;
    }
  }

  calcularPorcentajeAvanceProgramado() {
    let pcronograma: FormArray = <FormArray>this.formProgramacionFinancieraExp.get('programacion');
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
    this.formProgramacionFinancieraExp.patchValue({
      programacion: pcronograma.value
    });
  }

  getUsuario(): string {
    return sessionStorage.getItem('Usuario');
  }

  closeModal() {
    this.bsModal.hide();
  }
}
