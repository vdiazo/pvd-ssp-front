import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'; 
import { tipoArchivo } from '../../../../appSettings/enumeraciones';



@Component({
  selector: 'set-modal-entregable',
  templateUrl: './modal-entregable.component.html',
  styleUrls: ['./modal-entregable.component.css']
})
export class ModalEntregableComponent implements OnInit {
  listaProgramaEjecucionFinanciera: any;
  listaDocumentoAprobacion: any;

  esValidoSumaMontosAvanceProgramado: boolean = true;

  fecha_inicio_contractual: Date
  bMostrar: boolean = false;

  file: any;
  filePlanTrabajo: any;
  nombreArchivo: string = "";
  nombreArchivoPlanTrabajo: string = "";

  entregableForm: FormGroup;
  idSeguimientoMonitoreoObra: number;
  @Output() retornoValores = new EventEmitter();

  tipoArchivo: number = tipoArchivo.documento_entregable;
  tipoArchivoPlanTrabajo:number=tipoArchivo.plan_entregable;

  listaEntregables = [];

  //tipoDoc: any;

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
      //id_seguimiento_actividad: this.idSeguimientoMonitoreoObra,
      id_seguimiento_actividad: 0,
      //id_actividad_padre: -1,
      num_entregable:0,
      monto_total:0,
      fecha_aprobacion: '',
      nombre_archivo: '',
      plan_archivo:'',
      usuario_creacion: sessionStorage.getItem("Usuario"),
      _List_BE_Entregable_Detalle: new FormArray([])
    })

    /*this.listaEntregables=[
      { label: 'Información General Proyecto', icon: 'Informe 1', descripcion:'infogeneral-exp-tec' },
      { label: 'Financiamiento', icon: 'Informe 2', descripcion:'financiamiento-exp-tec' },
      { label: 'Proceso de Selección', icon: 'Informe 3', descripcion:'proceso-seleccion-exp-tec' },
      { label: 'Seguimiento y monitoreo a Ejecución', icon: 'Informe 4', descripcion:'seguimiento-monitoreo-ejecucion-exp-tec' },
      { label: 'Recepción y Liquidación', icon: 'Informe 5', descripcion:'recepcion-liquidacion-exp-tec' }
    ];*/
  }

  cargarControlesSeleccion() {
    this.fs.entregableExpTecService.listarTipoEntregableExpediente(this.idSeguimientoMonitoreoObra).subscribe(
      data => {
        //this.tipoDoc=data;
        this.listaDocumentoAprobacion = data;
      }
    );
  }

  modificarMontos(): void {
    let periodos: FormArray = <FormArray>this.entregableForm.get("_List_BE_Entregable_Detalle");
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

  construirEntregable(infoPeriodos: any,numEntregables:number): void {
    let entregable: FormArray = <FormArray>this.entregableForm.get("_List_BE_Entregable_Detalle");

    while (entregable.length !== 0) {
      entregable.removeAt(0)
    }

    for (let i = 0; i < numEntregables; i++) {
      entregable.push(this.fb.group({
        id_entregable_detalle_expediente:0,
        id_entregable_expediente:0,
        concepto: "Informe "+(i+1),
        descripcion:"",
        plazo_dias:0,
        monto:0,
        usuario_creacion: sessionStorage.getItem("Usuario")
      }))
    }

  }


  onChangeNumeroEntregables(tipoDefinicionValue) {
    let numEntregables=tipoDefinicionValue.srcElement.value;
    //let item = this.listaTipoDefinicion.find(x => x.id_tipo_definicion == tipoDefinicionValue);
    this.construirEntregable(this.listaEntregables,numEntregables);
  }

  grabar(){
    this.bMostrar = true;
    if (this.entregableForm.value.num_entregable != undefined) {
      this.entregableForm.patchValue({
        nombre_archivo: this.nombreArchivo,
        plan_archivo:this.nombreArchivoPlanTrabajo
      })
    }
    this.modificarMontos();
    if (this.validarControles(this.entregableForm)) {
      let montoTotal:number=0;
      for (let i=0;i<this.entregableForm.value._List_BE_Entregable_Detalle.length;i++){
        montoTotal=montoTotal+this.entregableForm.value._List_BE_Entregable_Detalle[i].monto;
      }
      let paramInsert:any={
        "_BE_Entregable":{
          "id_seguimiento_actividad":this.entregableForm.value.id_seguimiento_actividad,
          "num_entregable":this.entregableForm.value.num_entregable,
          "monto_total":montoTotal,
          "fecha_aprobacion":this.entregableForm.value.fecha_aprobacion,
          "nombre_archivo":this.entregableForm.value.nombre_archivo,
          "plan_archivo":this.entregableForm.value.plan_archivo,
          "usuario_creacion":this.entregableForm.value.usuario_creacion
        },
        "_List_BE_Entregable_Detalle":this.entregableForm.value._List_BE_Entregable_Detalle,
      }
      this.fs.entregableExpTecService.procesarEntregableExpediente(paramInsert).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
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
        tipoDefinicion: 'Ingrese todos los campos perteneciente a los entregables'
      };
      //let finFor: boolean = false;
      if (datosFormulario.value.num_entregable == 0) throw BreakException.controles;
      if( datosFormulario.value.id_seguimiento_actividad == 0) throw BreakException.controles;
      if (datosFormulario.value.fecha_aprobacion == "") throw BreakException.controles;
      if (datosFormulario.value.nombre_archivo == "") throw BreakException.controles;
      let cant=0;
      for (var i = 0; i < datosFormulario.value._List_BE_Entregable_Detalle.length; i++) {
        if (datosFormulario.value._List_BE_Entregable_Detalle[i].descripcion == "" 
          || (datosFormulario.value._List_BE_Entregable_Detalle[i].plazo_dias == 0 || datosFormulario.value._List_BE_Entregable_Detalle[i].plazo_dias == null) 
          || (datosFormulario.value._List_BE_Entregable_Detalle[i].monto == 0 || datosFormulario.value._List_BE_Entregable_Detalle[i].monto == null)) {
          //i = datosFormulario.value._List_BE_Entregable_Detalle.length;
          //finFor = true;
          cant=cant+1;
        }
      }
      if(cant > 0) throw BreakException.tipoDefinicion;
      //if (finFor == false) throw BreakException.tipoDefinicion;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  get getEntregable(): FormArray {
    return <FormArray>this.entregableForm.get("_List_BE_Entregable_Detalle");
  }

  closeModal() {
    this.modalRef.hide();
  }

}
