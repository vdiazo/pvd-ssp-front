import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'; 
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { AvanceEntregable } from '../../../../models/response/avanceEntregable';

@Component({
  selector: 'set-modal-update-avance-entregable',
  templateUrl: './modal-update-avance-entregable.component.html',
  styleUrls: ['./modal-update-avance-entregable.component.css']
})
export class ModalUpdateAvanceEntregableComponent implements OnInit {
  listaValorizacion: any;
  listaEntregable:any;

  fecha_inicio_contractual: Date;
  bMostrar: boolean = false;

  tipoArchivo: number = tipoArchivo.documento_avance_entregable;
  nombreArchivo: string = "";

  idSeguimientoMonitoreoObra: number;

  AvanceEntregableEditar: AvanceEntregable=new  AvanceEntregable();

  esValidoSumaMontosAvanceProgramado: boolean = true;

  entregableAvanceForm: FormGroup;
  @Output() retornoValores = new EventEmitter();

  montoTotalEntregable:number=0;
  sumatoriaMontoAvanceEntregable:number=0;

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
    this.entregableAvanceForm = this.fb.group({
      id_avance_entregable:this.AvanceEntregableEditar.id_avance_entregable,
      id_entregable_detalle_expediente:this.AvanceEntregableEditar.id_entregable_detalle_expediente,
      fecha_presentacion:this.funciones.formatDate(this.AvanceEntregableEditar.fecha_presentacion),
      fecha_conformidad:this.funciones.formatDate(this.AvanceEntregableEditar.fecha_conformidad),
      descripcion: this.AvanceEntregableEditar.descripcion,
      monto_pagado:this.AvanceEntregableEditar.monto_pagado,
      nombre_archivo: this.AvanceEntregableEditar.nombre_archivo,
      usuario_modificacion: sessionStorage.getItem("Usuario"),
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
        this.montoTotalEntregable=data[0].monto_total;
        let idSegActividad=data[0].id_seguimiento_actividad;
        this.fs.avanceEntregableExpTecService.listarEntregableDetalleExpedienteEntregable(idSegActividad).subscribe(
          data => {
            this.listaEntregable = data;
          }
        );
        this.listaValorizacion=data;
      }
    )
  }

  grabar() {
    this.bMostrar = true;
    let fechaPresentacion: string = this.entregableAvanceForm.get("fecha_presentacion").value;
    let fechaPresentacionValue: Date
    let fechaConformidad: string =this.entregableAvanceForm.get("fecha_conformidad").value;
    let fechaConformidadValue:Date


    if (fechaPresentacion.toString().length == 10) {
      fechaPresentacionValue = this.funciones.ConvertStringtoDate(fechaPresentacion)
    } else {
      fechaPresentacionValue = this.funciones.ConvertStringtoDate(this.funciones.formatDate(fechaPresentacion))
    }

    if (fechaConformidad.toString().length == 10) {
      fechaConformidadValue = this.funciones.ConvertStringtoDate(fechaConformidad)
    } else {
      fechaConformidadValue = this.funciones.ConvertStringtoDate(this.funciones.formatDate(fechaConformidad))
    }
    
    if (this.entregableAvanceForm.value.id_entregable_detalle_expediente != undefined) {
      this.entregableAvanceForm.patchValue({
        nombre_archivo: (this.nombreArchivo == '' ? this.AvanceEntregableEditar.nombre_archivo : this.nombreArchivo),
        monto_pagado:this.castToFloat(this.entregableAvanceForm.value.monto_pagado),
        fecha_presentacion:fechaPresentacionValue,
        fecha_conformidad:fechaConformidadValue
      })
    }
    //this.modificarMontos();
    if (this.validarControles(this.entregableAvanceForm)) {
      this.fs.avanceEntregableExpTecService.modificarAvanceEntregable(this.entregableAvanceForm.value).subscribe(
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

  castToFloat(monto: number | string): number {
    if (monto == 0 || monto == "") {
      return 0;
    }
    let valueWithReplace = monto.toString().replace(/,/g, "");
    let value = Number.parseFloat(valueWithReplace);
    return value;
  }

  validarControles(datosFormulario: FormGroup) {
    let sumaValidadar=this.montoTotalEntregable - (this.sumatoriaMontoAvanceEntregable-this.AvanceEntregableEditar.monto_pagado);
    try {
      let BreakException = {
        controles: 'Ingrese todos los campos con (*)',
        tipoDefinicion: 'Ingrese al menos un moto perteneciente a un entregable',
        montoValidado: 'El monto pagado no puede ser mayor al monto total del informe o entregable',
        montosuperado: 'La sumatoria del monto pagado ya superó al monto total del informe o entregable'
      };
      if (datosFormulario.value.fecha_presentacion == "") throw BreakException.controles;
      if (datosFormulario.value.fecha_conformidad == "") throw BreakException.controles;
      if (datosFormulario.value.descripcion == "") throw BreakException.controles;
      if (datosFormulario.value.monto_pagado === "") throw BreakException.controles;
      if (datosFormulario.value.monto_pagado>this.montoTotalEntregable) throw BreakException.montoValidado;
      if (datosFormulario.value.monto_pagado>sumaValidadar) throw BreakException.montosuperado;
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
