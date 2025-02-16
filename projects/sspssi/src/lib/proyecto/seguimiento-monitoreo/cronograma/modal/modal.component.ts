import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../../../appSettings/functions';
import { Cronograma } from '../../../../../models/response/cronograma';
import { tipoArchivo } from '../../../../../appSettings/enumeraciones';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FacadeService } from '../../../../../patterns/facade.service';

@Component({
  selector: 'ssi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalCronogramaComponent implements OnInit {

  listaProgramaEjecucionFinanciera: any;
  listaDocumentoAprobacion: any;
  listaTipoDefinicion = [];
  cronograma: Cronograma = new Cronograma();
  cronogramaForm: FormGroup;
  idSeguimientoMonitoreoObra: number;
  tipoArchivo: number = tipoArchivo.cronograma;
  @Output() retornoValores = new EventEmitter();
  nombreArchivo: string = '';
  lista: Cronograma[];
  sumaValorizacion: number;
  esValidoSumaMontosAvanceProgramado: boolean = true;
  fecha_inicio_contractual: Date;
  bMostrar: boolean = false;

  constructor(public modalRef: BsModalRef,
    public funciones: Functions,
    private fs: FacadeService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarControlesSeleccion();

    this.cronogramaForm = this.fb.group({
      id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra,
      id_programa_ejecucion_financiera_obra: null,
      id_documento_aprobacion_obra: 0,
      id_ampliacion_obra: -1,
      fecha_aprobacion: '',
      nombre_archivo: '',
      definicion_cronograma_obra: '',
      usuario_creacion: sessionStorage.getItem("Usuario"),
      cronograma: new FormArray([])
    });
    this.calcularPorcentajeAvanceProgramado();
  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }

  construirCronograma(infoPeriodos: any): void {
    let cronograma: FormArray = <FormArray>this.cronogramaForm.get("cronograma");

    while (cronograma.length !== 0) {
      cronograma.removeAt(0);
    }

    for (let i = 0; i < infoPeriodos.periodos.length; i++) {
      cronograma.push(this.fb.group({
        periodo: infoPeriodos.periodos[i].periodo,
        fechaPeriodo: this.funciones.obtenerPeriodo(infoPeriodos.periodos[i].periodo),
        valoracion_programada: 0,
        avance_programada: 0,
        usuario_creacion: 'admin'
      }))
    }
  }

  get getCronograma(): FormArray {
    return <FormArray>this.cronogramaForm.get("cronograma");
  }

  cargarControlesSeleccion() {
    this.fs.maestraService.listarProgramaEjecucionFinanciera().subscribe(
      data => this.listaProgramaEjecucionFinanciera = data
    );

    this.fs.maestraService.listarDocumentoAprobacion().subscribe(
      data => this.listaDocumentoAprobacion = data
    );

    this.fs.cronogramaService.listarTipoDefinicionCronogramaObra(this.idSeguimientoMonitoreoObra).subscribe(
      data => {
        this.listaTipoDefinicion = data as any[];

        this.lista.forEach(x => {
          let index = this.listaTipoDefinicion.findIndex(y => y.tipo_definicion == x.definicion_cronograma_obra);
          this.listaTipoDefinicion.splice(index, 1);
        });
      }
    );
  }

  onChangeTipoDefinicion(tipoDefinicionValue: number | string) {
    if (tipoDefinicionValue == "-1" || tipoDefinicionValue == -1) {
      let cronograma: FormArray = <FormArray>this.cronogramaForm.get("cronograma");
      while (cronograma.length !== 0) {
        cronograma.removeAt(0)
      }
    } else {
      let item = this.listaTipoDefinicion.find(x => x.id_tipo_definicion == tipoDefinicionValue);
      this.construirCronograma(item);
    }

  }

  closeModal() {
    this.modalRef.hide();
  }

  grabar() {
    this.bMostrar = true;
    let tipoDefinicion = this.listaTipoDefinicion.find(x => x.id_tipo_definicion == this.cronogramaForm.get("id_ampliacion_obra").value);
    if (tipoDefinicion != undefined) {
      this.cronogramaForm.patchValue({
        nombre_archivo: this.nombreArchivo,
        definicion_cronograma_obra: tipoDefinicion.tipo_definicion
      });
    }
    this.modificarMontos();
    if (this.validarControles(this.cronogramaForm)) {
      this.fs.cronogramaService.registrarCronograma(this.cronogramaForm.value).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ''));
          } else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ''));
            this.retornoValores.emit(true);
            this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      );
    } else {
      this.bMostrar = false;
    }
  }

  validarControles(datosFormulario: FormGroup) {
    try {
      let BreakException = {
        controles: 'Ingrese todos los campos con (*)',
        tipoDefinicion: 'Ingrese al menos un avance Programado perteneciente a un periodo'
      };
      let finFor: boolean = false;
      if (datosFormulario.value.id_programa_ejecucion_financiera_obra == 0) throw BreakException.controles;
      if (datosFormulario.value.id_documento_aprobacion_obra == 0) throw BreakException.controles;
      if (datosFormulario.value.fecha_aprobacion == '') throw BreakException.controles;
      if (datosFormulario.value.nombre_archivo == '') throw BreakException.controles;
      if (datosFormulario.value.id_ampliacion_obra == -1) throw BreakException.controles;
      for (var i = 0; i < datosFormulario.value.cronograma.length; i++) {
        if (datosFormulario.value.cronograma[i].avance_programada != '' && datosFormulario.value.cronograma[i].valoracion_programada != 0) {
          i = datosFormulario.value.cronograma.length;
          finFor = true;
        }
      }
      if (finFor == false) throw BreakException.tipoDefinicion;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  modificarMontos(): void {
    let periodos: FormArray = <FormArray>this.cronogramaForm.get("cronograma");
    periodos.controls.forEach(x => {
      let value = x.value.valoracion_programada;
      let valueAvance = x.value.avance_programada;
      x.value.valoracion_programada = this.castToFloat(value);
      x.value.avance_programada = this.castToFloat(valueAvance);
    });
  }

  castToFloat(monto: number | string): number {
    if (monto == 0 || monto == '') {
      return 0;
    }
    let valueWithReplace = monto.toString().replace(/,/g, '');
    let value = Number.parseFloat(valueWithReplace);
    return value;
  }

  validarSumaPorcentajes() {
    this.esValidoSumaMontosAvanceProgramado = false;
    let periodos: FormArray = <FormArray>this.cronogramaForm.get("cronograma");
    let sumaTotal: number = 0;
    periodos.controls.forEach(x => {
      let valueAvance: number = Number.parseFloat(x.value.avance_programada);
      sumaTotal = sumaTotal + valueAvance;
    });

    if (sumaTotal > 100) {
      this.esValidoSumaMontosAvanceProgramado = false;
      this.funciones.mensaje("info", "La suma del avance programado no puede ser mayor a 100" + "\nValor Actual: " + sumaTotal);
      return;
    } else {
      this.esValidoSumaMontosAvanceProgramado = true;
    }
  }

  calcularPorcentajeAvanceProgramado() {
    let pcronograma: FormArray = <FormArray>this.cronogramaForm.get("cronograma");
    this.sumaValorizacion = 0;
    pcronograma.value.forEach(element => {
      if (element.valoracion_programada != '') {
        let valor: number = this.castToFloat(element.valoracion_programada);
        this.sumaValorizacion = this.sumaValorizacion + valor;
      }
    });
    pcronograma.value.forEach(element => {
      if (element.valoracion_programada != '') {
        element.avance_programada = this.castToFloat(element.valoracion_programada) * 100 / this.sumaValorizacion;
      } else {
        element.avance_programada = 0;
        element.valoracion_programada = 0;
      }
    });
    this.cronogramaForm.patchValue({
      cronograma: pcronograma.value
    });
  }
}
