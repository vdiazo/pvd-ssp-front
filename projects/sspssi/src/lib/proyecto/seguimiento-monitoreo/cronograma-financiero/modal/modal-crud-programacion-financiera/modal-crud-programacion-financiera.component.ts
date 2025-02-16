import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { PlanillonService } from 'projects/sspssi/src/servicios/planillon/planillon.service';

@Component({
  selector: 'ssi-modal-crud-programacion-financiera',
  templateUrl: './modal-crud-programacion-financiera.component.html',
  styleUrls: ['./modal-crud-programacion-financiera.component.css']
})
export class ModalCrudProgramacionFinancieraComponent implements OnInit {

  formProgramacionFinanciera: FormGroup;
  bMostrar: boolean = false;
  entidadEditar: any = null;
  cambiarEditar: boolean = false;
  idSeguimientoMonitoreoObra: number;
  esValidoSumaMontosAvanceProgramado: boolean = false;
  sumaValorizacion: number = 0;
  listaTipoDefinicion: any[] = [];
  @Output() retornoValoresCronograma = new EventEmitter();

  constructor(private bsModal: BsModalRef, private facadeSvc: FacadeService, private cronogramaFinancieroSvc: PlanillonService, private fb: FormBuilder, public funciones: Functions) { }

  ngOnInit() {
    this.createform();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formProgramacionFinanciera.patchValue(this.entidadEditar);
      this.construirCronograma(this.entidadEditar.cronograma);
    } else {
      this.cargarCronogramaFinanciero();
    }
    this.calcularPorcentajeAvanceProgramado();
  }

  createform() {
    this.formProgramacionFinanciera = this.fb.group({
      id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra,
      id_programacion_financiera: 0,
      fecha_registro: null,
      usuario_creacion: this.getUsuario(),
      activo: true,
      programaciones: this.fb.array([])
    });
  }

  cargarCronogramaFinanciero() {
    let infoPeriodos = [];
    this.facadeSvc.cronogramaService.listarTipoDefinicionCronogramaObra(this.idSeguimientoMonitoreoObra).subscribe(
      (data: any) => {
        if (data != null) {
          this.listaTipoDefinicion = data;
          this.listaTipoDefinicion.forEach(element => {
            if (element.id_tipo_definicion == 0) {
              infoPeriodos = element.periodos
            }
          });
          this.construirCronograma(infoPeriodos);
        }
      }
    );
  }

  registrarCronogramaFinanciero() {
    this.modificarMontos();
    let paramEnvio = { ...{}, ...this.formProgramacionFinanciera.value };
    if (this.cambiarEditar) {
      // editar
      paramEnvio.usuario_modificacion = this.getUsuario();
      this.cronogramaFinancieroSvc.modificarProgramacionFinancieraObra(paramEnvio).subscribe(
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
      this.cronogramaFinancieroSvc.insertarProgramacionFinancieraObra(paramEnvio).subscribe(
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
    return <FormArray>this.formProgramacionFinanciera.get('programaciones');
  }

  construirCronograma(infoPeriodos: any): FormArray {
    let cronograma: FormArray = <FormArray>this.formProgramacionFinanciera.get('programaciones');

    while (cronograma.length !== 0) {
      cronograma.removeAt(0);
    }

    for (let i = 0; i < infoPeriodos.length; i++) {
      cronograma.push(this.fb.group({
        id_detalle_programacion_financiera: infoPeriodos[i].id_detalle_programacion_financiera != null ? infoPeriodos[i].id_detalle_programacion_financiera : 0,
        periodo: infoPeriodos[i].periodo,
        monto_programacion_mensual: infoPeriodos[i].monto_programacion_mensual != null ? infoPeriodos[i].monto_programacion_mensual : 0,
        porcentaje_avance: infoPeriodos[i].porcentaje_avance != null ? infoPeriodos[i].porcentaje_avance : 0,
        usuario_creacion: this.getUsuario(),
        activo: true
      }));
    }
    return cronograma;
  }

  modificarMontos(): void {
    const periodos: FormArray = <FormArray>this.formProgramacionFinanciera.get('programaciones');
    periodos.controls.forEach(x => {
      let value = x.value.monto_programacion_mensual;
      let valueAvance = x.value.porcentaje_avance;
      x.value.monto_programacion_mensual = this.funciones.castToFloat(value);
      x.value.porcentaje_avance = this.funciones.castToFloat(valueAvance);
    });
  }

  asignarIdProgramacionFinanciera(idProgramacionFinanciera: number) {
    const periodos: FormArray = <FormArray>this.formProgramacionFinanciera.get('programaciones');
    periodos.controls.forEach(x => {
      x.value.id_programacion_financiera = idProgramacionFinanciera;
    });
  }

  validarSumaPorcentajes() {
    this.esValidoSumaMontosAvanceProgramado = false;
    const periodos: FormArray = <FormArray>this.formProgramacionFinanciera.get('programaciones');
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
    let pcronograma: FormArray = <FormArray>this.formProgramacionFinanciera.get('programaciones');
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
        element.monto_programacion_mensual = 0;
      }
    });
    this.formProgramacionFinanciera.patchValue({
      programaciones: pcronograma.value
    });
  }

  getUsuario(): string {
    return sessionStorage.getItem('Usuario');
  }

  closeModal() {
    this.bsModal.hide();
  }
}
