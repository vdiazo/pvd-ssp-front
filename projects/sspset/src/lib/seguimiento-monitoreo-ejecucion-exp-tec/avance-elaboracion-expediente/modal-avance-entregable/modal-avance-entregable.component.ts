import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'; 
import { tipoArchivo } from '../../../../appSettings/enumeraciones';

@Component({
  selector: 'set-modal-avance-entregable',
  templateUrl: './modal-avance-entregable.component.html',
  styleUrls: ['./modal-avance-entregable.component.css']
})
export class ModalAvanceEntregableComponent implements OnInit {
  listaValorizacion: any;
  listaEntregable:any;
  idSeguimientoMonitoreoObra: number;

  fecha_inicio_contractual: Date;
  bMostrar: boolean = false;

  tipoArchivo: number = tipoArchivo.documento_avance_entregable;
  nombreArchivo: string = "";

  esValidoSumaMontosAvanceProgramado: boolean = true;


  entregableAvanceForm: FormGroup;
  @Output() retornoValores = new EventEmitter();

  montoTotalEntregable:number=0;
  sumatoriaMontoAvanceEntregable:number=0;


  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  fechaMin;

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
    this.entregableAvanceForm = this.fb.group({
      id_entregable_detalle_expediente:0,
      id_seguimiento_actividad:0,
      concepto:'',
      fecha_presentacion:'',
      fecha_conformidad:'',
      descripcion: '',
      monto_pagado:0,
      nombre_archivo: '',
      usuario_creacion: sessionStorage.getItem("Usuario"),
    })
  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }

  cargarControlesSeleccion() {
    this.fs.avanceEntregableExpTecService.listarSeguimientoActividadTipoAvance(this.idSeguimientoMonitoreoObra).subscribe(
      data=>{
        if(data.length!=0){
          this.montoTotalEntregable=data[0].monto_total;
            if(data.length!=0){
              let idActividad=data[0].id_seguimiento_actividad;
              this.fs.avanceEntregableExpTecService.listarEntregableDetalleExpedienteEntregable(idActividad).subscribe(
                data => {
                  this.listaEntregable = data;
                }
              );
            }         
          this.listaValorizacion=data;
        } 
      }
    )
  }

  modificarMontos(): void {
    let periodos: FormArray = <FormArray>this.entregableAvanceForm.value;
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

  grabar() {
    this.bMostrar = true;
    
    if (this.entregableAvanceForm.value.id_entregable_detalle_expediente != undefined) {
      this.entregableAvanceForm.patchValue({
        nombre_archivo: this.nombreArchivo,
        monto_pagado:this.castToFloat(this.entregableAvanceForm.value.monto_pagado)
      })
    }
    //this.modificarMontos();
    if (this.validarControles(this.entregableAvanceForm)) {
      this.fs.avanceEntregableExpTecService.insertarAvanceEntregable(this.entregableAvanceForm.value).subscribe(
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
        tipoDefinicion: 'Ingrese al menos un moto perteneciente a un entregable',
        montoValidado: 'El monto pagado no puede ser mayor al monto total del informe o entregable',
        montosuperado: 'La sumatoria del monto pagado ya superó al monto total del informe o entregable'
      };
      //let finFor: boolean = false;
      if (datosFormulario.value.id_seguimiento_actividad == 0) throw BreakException.controles;
      if (datosFormulario.value.id_entregable_detalle_expediente == 0) throw BreakException.controles;
      if (datosFormulario.value.fecha_presentacion == "") throw BreakException.controles;
      if (datosFormulario.value.fecha_conformidad == "") throw BreakException.controles;
      if (datosFormulario.value.descripcion == "") throw BreakException.controles;
      if (datosFormulario.value.monto_pagado === "") throw BreakException.controles;
      if (datosFormulario.value.monto_pagado>this.montoTotalEntregable) throw BreakException.montoValidado;
      if (datosFormulario.value.monto_pagado>(this.montoTotalEntregable-this.sumatoriaMontoAvanceEntregable)) throw BreakException.montosuperado;
      if (datosFormulario.value.nombre_archivo == "") throw BreakException.controles;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  closeModal() {
    this.modalRef.hide();
  }

}
