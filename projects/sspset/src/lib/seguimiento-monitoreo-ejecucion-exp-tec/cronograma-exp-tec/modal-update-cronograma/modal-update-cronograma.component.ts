import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { Cronograma } from '../../../../models/response/cronograma';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'
import { FacadeService } from '../../../patterns/facade.service';

import $ from 'jquery';



@Component({
  selector: 'set-modal-update-cronograma',
  templateUrl: './modal-update-cronograma.component.html',
  styleUrls: ['./modal-update-cronograma.component.css']
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
  fecha_inicio_contractual: Date
  bMostrar: boolean = false;

  file: any;
  tipoDoc:any;

  constructor(public modalRef: BsModalRef,
    public funciones: Funciones,
    private fs: FacadeService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarControlesSeleccion();
    this.cronogramaForm = this.fb.group({
      id_actividad_ejecucion_expediente: this.Cronograma.id_actividad_ejecucion_expediente,
      id_seguimiento_ejecucion_expediente: this.Cronograma.id_seguimiento_ejecucion_expediente,
      id_programa_ejecucion_expediente:2,// this.Cronograma.id_programa_ejecucion_expediente,
      id_documento_aprobacion_expediente: this.Cronograma.id_documento_aprobacion_expediente,
      id_actividad_padre: this.Cronograma.id_tipo_actividad_expediente,
      fecha_aprobacion: this.funciones.formatDate(this.Cronograma.fecha_aprobacion),
      nombre_archivo:this.Cronograma.nombre_archivo,
      //definicion_cronograma_obra: this.Cronograma.definicion_cronograma_obra,
      //usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      lst_Detalle_Actividad_Ejecucion_Expediente: this.construirCronograma(this.Cronograma)
    })
  }

  /*fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }*/

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
      this.nombreArchivo=evento.file.name;
    }
  }

  construirCronograma(infoPeriodos: any): FormArray {
    let cronograma = this.fb.array([]);

    for (let i = 0; i < infoPeriodos.cronograma.length; i++) {
      cronograma.push(this.fb.group({
        id_detalle_actividad_ejecucion_expediente: infoPeriodos.cronograma[i].id_detalle_actividad_ejecucion_expediente,
        //id_actividad_ejecucion_expediente: infoPeriodos.cronograma[i].id_actividad_ejecucion_expediente,
        periodo: infoPeriodos.cronograma[i].periodo,
        valoracion_programada: infoPeriodos.cronograma[i].valoracion_programada,
        avance_programada: infoPeriodos.cronograma[i].avance_programada,
        fecha_periodo: this.funciones.obtenerPeriodo(infoPeriodos.cronograma[i].periodo),
        //usuario_creacion: sessionStorage.getItem("Usuario"),
        //usuario_modificacion: sessionStorage.getItem("Usuario")
      }));
    }

    return cronograma;
  }

  get getCronograma(): FormArray {
    return <FormArray>this.cronogramaForm.get("lst_Detalle_Actividad_Ejecucion_Expediente");
  }

  cargarControlesSeleccion() {
    this.fs.maestraService.listarProgramaEjecucionFinanciera().subscribe(
      data => this.listaProgramaEjecucionFinanciera = data
    );

    this.fs.maestraService.listarDocumentoAprobacion().subscribe(
      data => {
        this.tipoDoc=data;
        this.listaDocumentoAprobacion = this.tipoDoc.documento_aprobacion;

      }
    );

    this.fs.cronogramaExpTecService.listarTipoDefinicionCronogramaObra(this.Cronograma.id_seguimiento_ejecucion_expediente).subscribe(
      data => {
        this.listaTipoDefinicion = data as any[];
      }
    );
  }

  onChangeTipoDefinicion(tipoDefinicionValue: number | string) {
    if (tipoDefinicionValue == "-1" || tipoDefinicionValue == -1) {
      let cronograma: FormArray = <FormArray>this.cronogramaForm.get("lst_Detalle_Actividad_Ejecucion_Expediente");
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
      nombre_archivo: (this.nombreArchivo == '' ? this.Cronograma.nombre_archivo : this.Cronograma.nombre_archivo),
      //definicion_cronograma_obra: this.Cronograma.id_actividad_padre,
      fecha_aprobacion: fechaValue
    })

    this.modificarMontos();

    if (this.validarControles(this.cronogramaForm)) {
      $('input[name="fileInsert"]').val(this.Cronograma.nombre_archivo);
      this.fs.cronogramaExpTecService.actualizarCronograma(this.cronogramaForm.value,this.file).subscribe(
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
      if (datosFormulario.value.id_documento_aprobacion_expediente == 0) throw BreakException.controles;

      for (var i = 0; i < datosFormulario.value.lst_Detalle_Actividad_Ejecucion_Expediente.length; i++) {
        if (datosFormulario.value.lst_Detalle_Actividad_Ejecucion_Expediente[i].avance_programada != "" && datosFormulario.value.lst_Detalle_Actividad_Ejecucion_Expediente[i].valoracion_programada != 0) {
          i = datosFormulario.value.lst_Detalle_Actividad_Ejecucion_Expediente.length;
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
    let periodos: FormArray = <FormArray>this.cronogramaForm.get("lst_Detalle_Actividad_Ejecucion_Expediente");
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
    let periodos: FormArray = <FormArray>this.cronogramaForm.get("lst_Detalle_Actividad_Ejecucion_Expediente");
    let sumaTotal: number = 0;
    periodos.controls.forEach(x => {
      let valueAvance: number = Number.parseFloat(x.value.avance_programada);
      sumaTotal = sumaTotal + valueAvance;
    });
    if (sumaTotal > 100) {
      this.esValidoSumaMontosAvanceProgramado = false;
      this.funciones.mensaje("info", "La suma del avance programado no puede ser mayor a 100");
      return;
    } else {
      this.esValidoSumaMontosAvanceProgramado = true;
    }
  }

}
