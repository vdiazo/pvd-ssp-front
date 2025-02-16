import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../../../appSettings/functions';
import { Cronograma } from '../../../../../models/response/cronograma';
import { tipoArchivo } from '../../../../../appSettings/enumeraciones';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'
import { FacadeService } from '../../../../../patterns/facade.service';

@Component({
  selector: 'ssi-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.css']
})
export class ModalUpdateCronogramaComponent implements OnInit {
  listaProgramaEjecucionFinanciera: any;
  listaDocumentoAprobacion: any;
  listaTipoDefinicion = [];
  Cronograma: Cronograma = new Cronograma();
  cronogramaForm: FormGroup;
  tipoArchivo: number = tipoArchivo.cronograma;
  @Output() retornoValores = new EventEmitter();
  nombreArchivo: string = "";
  esValidoSumaMontosAvanceProgramado: boolean = true;
  sumaValorizacion: number;
  fecha_inicio_contractual: Date
  bMostrar: boolean = false;

  constructor(public modalRef: BsModalRef,
    public funciones: Functions,
    private fs: FacadeService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarControlesSeleccion();

    this.cronogramaForm = this.fb.group({
      id_cronograma_ejecucion_financiera_obra: this.Cronograma.id_cronograma_ejecucion_financiera_obra,
      id_seguimiento_monitoreo_obra: this.Cronograma.id_seguimiento_monitoreo_obra,
      id_programa_ejecucion_financiera_obra: this.Cronograma.id_programa_ejecucion_financiera_obra,
      id_documento_aprobacion_obra: this.Cronograma.id_documento_aprobacion_obra,
      id_ampliacion_obra: this.Cronograma.id_ampliacion_obra,
      fecha_aprobacion: this.funciones.formatDate(this.Cronograma.fecha_aprobacion),
      nombre_archivo: this.Cronograma.archivo_convenio,
      definicion_cronograma_obra: this.Cronograma.definicion_cronograma_obra,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      cronograma: this.construirCronograma(this.Cronograma)
    });
    this.calcularPorcentajeAvanceProgramado();
  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }

  construirCronograma(infoPeriodos: any): FormArray {
    let cronograma = this.fb.array([]);

    for (let i = 0; i < infoPeriodos.cronograma.length; i++) {
      cronograma.push(this.fb.group({
        id_detalle_cronograma_ejecucion_financiera_obra: infoPeriodos.cronograma[i].id_detalle_cronograma_ejecucion_financiera_obra,
        id_cronograma_ejecucion_financiera_obra: infoPeriodos.cronograma[i].id_cronograma_ejecucion_financiera_obra,
        periodo: infoPeriodos.cronograma[i].periodo,
        valoracion_programada: infoPeriodos.cronograma[i].valoracion_programada,
        avance_programada: infoPeriodos.cronograma[i].avance_programada,
        fecha_periodo: this.funciones.obtenerPeriodo(infoPeriodos.cronograma[i].periodo),
        usuario_creacion: sessionStorage.getItem("Usuario"),
        usuario_modificacion: sessionStorage.getItem("Usuario")
      }));
    }

    return cronograma;
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

    this.fs.cronogramaService.listarTipoDefinicionCronogramaObra(this.Cronograma.id_seguimiento_monitoreo_obra).subscribe(
      data => {
        this.listaTipoDefinicion = data as any[];
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
    let fecha: string = this.cronogramaForm.get("fecha_aprobacion").value;
    let fechaValue: Date

    if (fecha.toString().length == 10) {
      fechaValue = this.funciones.ConvertStringtoDate(fecha)
    } else {
      fechaValue = this.funciones.ConvertStringtoDate(this.funciones.formatDate(fecha))
    }

    this.cronogramaForm.patchValue({
      nombre_archivo: (this.nombreArchivo == '' ? this.Cronograma.archivo_convenio : this.nombreArchivo),
      definicion_cronograma_obra: this.Cronograma.definicion_cronograma_obra,
      fecha_aprobacion: fechaValue
    })

    this.modificarMontos();

    if (this.validarControles(this.cronogramaForm)) {
      this.fs.cronogramaService.actualizarCronograma(this.cronogramaForm.value).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.retornoValores.emit(true);
            this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      );
    }
    else {
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
      if (datosFormulario.value.id_documento_aprobacion_obra == 0) throw BreakException.controles;

      for (var i = 0; i < datosFormulario.value.cronograma.length; i++) {
        if (datosFormulario.value.cronograma[i].avance_programada != "" && datosFormulario.value.cronograma[i].valoracion_programada != 0) {
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
    let periodos: FormArray = <FormArray>this.cronogramaForm.get('cronograma');
    periodos.controls.forEach(x => {
      let value = x.value.valoracion_programada;
      let valueAvance = x.value.avance_programada;
      x.value.valoracion_programada = this.castToFloat(value);
      x.value.avance_programada = this.castToFloat(valueAvance);
    });
  }

  castToFloat(monto: number | string): number {
    if (monto == 0 || monto == "") {
      return 0;
    }

    let valueWithReplace = monto.toString().replace(/,/g, "");

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
      if (element.valoracion_programada != "") {
        let valor: number = this.castToFloat(element.valoracion_programada);
        this.sumaValorizacion = this.sumaValorizacion + valor;
      }
    });
    pcronograma.value.forEach(element => {
      if (element.valoracion_programada != "") {
        element.avance_programada = this.funciones.fixed(this.castToFloat(element.valoracion_programada) * 100 / this.sumaValorizacion, 2);
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
