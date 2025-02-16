import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'; 
import { Entregable } from 'projects/sspset/src/models/response/entregable';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';

@Component({
  selector: 'set-modal-update-entregable',
  templateUrl: './modal-update-entregable.component.html',
  styleUrls: ['./modal-update-entregable.component.css']
})
export class ModalUpdateEntregableComponent implements OnInit {

  entregableForm: FormGroup;
  idSeguimientoMonitoreoObra: number;
  @Output() retornoValores = new EventEmitter();

  esValidoSumaMontosAvanceProgramado: boolean = true;

  fecha_inicio_contractual: Date
  bMostrar: boolean = false;

  file: any;
  filePlanTrabajo: any;
  nombreArchivo: string = "";
  nombreArchivoPlanTrabajo: string = "";

  Entregable: Entregable=new  Entregable();
  tipoEntregable

  tipoArchivo: number = tipoArchivo.documento_entregable;
  tipoArchivoPlanTrabajo:number=tipoArchivo.plan_entregable;

  listado:any[];

  listaDocumentoAprobacion: any;

  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  constructor(
    public modalRef: BsModalRef,
    public funciones: Funciones,
    private fs: FacadeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.diaHoy=new Date();
    this.diaInicial=new Date(this.diaHoy.getFullYear(), this.diaHoy.getMonth(), this.diaHoy.getDate());
    this.fechaDesignaconMax=this.diaInicial;
    this.cargarControlesSeleccion();
    this.entregableForm = this.fb.group({
      id_entregable_expediente:this.Entregable.id_entregable_expediente,
      id_seguimiento_actividad:this.Entregable.id_seguimiento_actividad,
      num_entregable:this.Entregable.num_entregable,
      monto_total:this.Entregable.monto_total,
      fecha_aprobacion:this.funciones.formatDate( this.Entregable.fecha_aprobacion),
      nombre_archivo: this.Entregable.nombre_archivo,
      plan_archivo:this.Entregable.plan_archivo,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion:sessionStorage.getItem("Usuario"),
      detalle_entregable: this.construirEntregable(this.Entregable)
    })

  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }

  fileChangeEventPlanTrabajo(rpta : any){
    if(rpta.uploaded != null){
      this.nombreArchivoPlanTrabajo=rpta.uploaded._body;
    }
  }

  cargarControlesSeleccion() {
    this.fs.entregableExpTecService.listarTipoEntregableExpediente(this.idSeguimientoMonitoreoObra).subscribe(
      data => {
        this.listaDocumentoAprobacion = data;
      }
    );
  }


  construirEntregable(infoPeriodos: any): FormArray {
    let entregable = this.fb.array([]);
    for (let i = 0; i < infoPeriodos.detalle_entregable.length; i++) {
      entregable.push(this.fb.group({
        id_entregable_detalle_expediente: infoPeriodos.detalle_entregable[i].id_entregable_detalle_expediente,
        id_entregable_expediente:infoPeriodos.id_entregable_expediente,
        concepto: infoPeriodos.detalle_entregable[i].concepto,
        descripcion:infoPeriodos.detalle_entregable[i].descripcion,
        plazo_dias:infoPeriodos.detalle_entregable[i].plazo_dias,
        monto:infoPeriodos.detalle_entregable[i].monto,

      }));
    }

    return entregable;
  }





  grabar() {
    this.bMostrar = true;
    let fecha: string = this.entregableForm.get("fecha_aprobacion").value;
    let fechaValue: Date

    if (fecha.toString().length == 10) {
      fechaValue = this.funciones.ConvertStringtoDate(fecha)
    } else {
      fechaValue = this.funciones.ConvertStringtoDate(this.funciones.formatDate(fecha))
    }

    this.entregableForm.patchValue({
      nombre_archivo: (this.nombreArchivo == '' ? this.Entregable.nombre_archivo : this.nombreArchivo),
      plan_archivo: (this.nombreArchivoPlanTrabajo == '' ? this.Entregable.plan_archivo: this.nombreArchivoPlanTrabajo),
      fecha_aprobacion: fechaValue
    })

    this.modificarMontos();
    if (this.validarControles(this.entregableForm)) {
      let montoTotal:number=0;
      for (let i=0;i<this.entregableForm.value.detalle_entregable.length;i++){
        montoTotal=montoTotal+this.entregableForm.value.detalle_entregable[i].monto;
      }
      let paramInsert:any={
        "_BE_Entregable":{
          "id_entregable_expediente":this.entregableForm.value.id_entregable_expediente,
          "id_seguimiento_actividad":this.entregableForm.value.id_seguimiento_actividad,
          "num_entregable":this.entregableForm.value.num_entregable,
          "monto_total":montoTotal,
          "fecha_aprobacion":this.entregableForm.value.fecha_aprobacion,
          "nombre_archivo":this.entregableForm.value.nombre_archivo,
          "plan_archivo":this.entregableForm.value.plan_archivo,
          "usuario_creacion":this.entregableForm.value.usuario_creacion
        },
        "_List_BE_Entregable_Detalle":this.entregableForm.value.detalle_entregable,
      }
      this.fs.entregableExpTecService.procesarEntregableExpediente(paramInsert).subscribe(
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

  modificarMontos(): void {
    let periodos: FormArray = <FormArray>this.entregableForm.get("detalle_entregable");
    periodos.controls.forEach(x => {
      let value = x.value.monto;
      x.value.monto = this.castToFloat(value);
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

  validarControles(datosFormulario: FormGroup) {
    try {
      let BreakException = {
        controles: 'Ingrese todos los campos con (*)',
        tipoDefinicion: 'Ingrese todos los campos perteneciente a los entregables'
      };
      if (datosFormulario.value.fecha_aprobacion == "") throw BreakException.controles;
      if (datosFormulario.value.nombre_archivo == "") throw BreakException.controles;
      let cant=0;
      for (var i = 0; i < datosFormulario.value.detalle_entregable.length; i++) {
        if (datosFormulario.value.detalle_entregable[i].descripcion == "" 
          || (datosFormulario.value.detalle_entregable[i].plazo_dias == 0 || datosFormulario.value.detalle_entregable[i].plazo_dias == null) 
          || (datosFormulario.value.detalle_entregable[i].monto == 0 || datosFormulario.value.detalle_entregable[i].monto== null)) {
          cant=cant+1;
        }
      }
      if(cant > 0) throw BreakException.tipoDefinicion;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  get getEntregable(): FormArray {
    return <FormArray>this.entregableForm.get("detalle_entregable");
  }

  closeModal() {
    this.modalRef.hide();
  }

}
