import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LiquidacionModal, Liquidacion } from '../../../../../models/Liquidacion';
import { BsModalRef } from 'node_modules/ngx-bootstrap/modal';
import { tipoArchivo } from '../../../../../appSettings/enumeraciones';
import { ProcesoLiquidacionService } from '../../../../../servicios/recepcion-liquidacion/proceso-liquidacion.service';
import { Functions } from '../../../../../appSettings/functions';
import { ActivatedRoute } from 'node_modules/@angular/router';

@Component({
  selector: 'app-liquidacion-modal',
  templateUrl: './liquidacion-modal.component.html',
  styleUrls: ['./liquidacion-modal.component.css']
})
export class LiquidacionModalComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  entidadModal: LiquidacionModal;
  entidadEditar;
  cambiarEditarLiquidacion: boolean = true;
  mostrarAprobar: boolean = true;
  estados;
  documentos;
  idSeguimientoObra;
  ruta_seguimiento;
  ruta_obra;
  ruta_supervision;
  aprobado;
  id_aprobado;
  IdTipoArchivoSeguimiento: number = tipoArchivo.liquidacion;
  IdTipoArchivoObra: number = tipoArchivo.ResolucionLiquidacionObra;
  IdTipoArchivoSupervision: number = tipoArchivo.ResolucionLiquidacionSupervicion;
  desArchivo: boolean = false;
  supervisor;

  constructor(public modalRef: BsModalRef, private svcLiquidacion: ProcesoLiquidacionService, public funciones: Functions, private route: ActivatedRoute) { }

  ngOnInit() {
    this.entidadModal = new LiquidacionModal();
    this.listarEstadoLiquidacion();
    this.listarTipoDocumento();
    if (this.entidadEditar != null) {
      this.setearCamposEditar();
      this.cambiarEditarLiquidacion = false;
    }
  }


  setearCamposEditar(){
    this.entidadModal.estadoLiquidacion = this.entidadEditar.id_estado_liquidacion;
    this.entidadModal.nombreEstadoLiquidacion = this.entidadEditar.nombre_estado_liquidacion;
    this.entidadModal.tipoDocumento = this.entidadEditar.id_tipo_documento_liquidacion;
    this.entidadModal.fecha = this.entidadEditar.fecha_seguimiento;
    this.entidadModal.observaciones = this.entidadEditar.observaciones;
    this.ruta_seguimiento = this.entidadEditar.ruta_archivo_seguimiento;
    if (this.entidadEditar.nombre_estado_liquidacion == "APROBADO") {
      let arreglo = { nombre_estado_liquidacion: "APROBADO" }
      this.SeleccionarEstado(arreglo);
      this.ruta_obra = this.entidadEditar.ruta_archivo_liquidacion_obra;
      this.ruta_supervision = this.entidadEditar.ruta_archivo_liquidacion_supervicion;
      this.entidadModal.nombreLiquidacionObra = this.entidadEditar.resolucion_liquidacion_obra;
      this.entidadModal.fechaLiquidacionObra = this.entidadEditar.fecha_liquidacion_obra
      this.entidadModal.textoMontoObra = this.entidadEditar.monto_liquidacion_obra == null ? null : this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.monto_liquidacion_obra.toString()));

      this.entidadModal.nombreLiquidacionSupervision = this.entidadEditar.resolucion_liquidacion_supervicion;
      this.entidadModal.fechaLiquidacionSupervision = this.entidadEditar.fecha_liquidacion_supervicion;
      this.entidadModal.textoMontoSupervision = this.entidadEditar.monto_liquidacion_supervicion == null ? null : this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.monto_liquidacion_supervicion.toString()));
    }
  }
  // calcularMontoSupervision(monto) {
  //   let vmonto: string;
  //   vmonto = this.funciones.format(monto);
  //   this.entidadModal.textoMontoSupervision = vmonto;
  // }

  // calcularMontoObra(monto) {
  //   let vmonto: string;
  //   vmonto = this.funciones.format(monto);
  //   this.entidadModal.textoMontoObra = vmonto;
  // }

  fileChangeEventSeguimiento(evento: any) {
    if (evento.uploaded != null) {
      this.entidadModal.nombreArchivo = evento.uploaded._body;
    }
  }

  fileChangeEventObra(evento: any) {
    if (evento.uploaded != null) {
      this.entidadModal.archivoLiquidacionObra = evento.uploaded._body;
    }
  }

  fileChangeEventSupervision(evento: any) {
    if (evento.uploaded != null) {
      this.entidadModal.archivoLiquidacionSupervision = evento.uploaded._body;
    }
  }


  listarEstadoLiquidacion() {
    this.svcLiquidacion.listarEstadoLiquidacion().subscribe(
      data => {
        this.estados = data;
      }
    )
  }
  listarTipoDocumento() {
    this.svcLiquidacion.listarTipoDocumentoLiquidacion().subscribe(
      data => {
        this.documentos = data;
      }
    )
  }
  administrarTramo() {
    if (this.entidadEditar == null) {
      this.guardarLiquidacion();
    } else {
      this.editarLiquidacion();
    }
  }
  SeleccionarEstado(estado) {
    if (estado == null) {
      this.mostrarAprobar = true;
      return;
    }
    if (estado.nombre_estado_liquidacion == "APROBADO") {
      this.entidadModal.nombreEstadoLiquidacion = estado.nombre_estado_liquidacion;
      this.mostrarAprobar = false;
      this.desArchivo = true;
    } else {
      this.entidadModal.nombreEstadoLiquidacion = estado.nombre_estado_liquidacion;
      if (this.entidadEditar != null) {
        this.entidadModal.nombreLiquidacionObra = null;
        this.entidadModal.fechaLiquidacionObra = null;
        this.entidadModal.textoMontoObra = null;
        this.entidadModal.archivoLiquidacionObra = null;
        this.entidadEditar.ruta_archivo_liquidacion_obra = null;

        this.entidadModal.nombreLiquidacionSupervision = null;
        this.entidadModal.fechaLiquidacionSupervision = null;
        this.entidadModal.textoMontoSupervision = null;
        this.entidadModal.archivoLiquidacionSupervision = null;
        this.entidadEditar.ruta_archivo_liquidacion_supervicion = null;
      }
      this.mostrarAprobar = true;
      this.desArchivo = false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  
  editarLiquidacion() {
    if (this.id_aprobado != this.entidadEditar.id_liquidacion_seguimiento) {
      if (this.entidadModal.nombreEstadoLiquidacion == "APROBADO" && this.aprobado == true) {
        this.funciones.mensaje("info", "Ya existe un Proceso de Liquidación aprobado.");
        return;
      }
    }
    if (this.entidadModal.nombreEstadoLiquidacion == "APROBADO") {
      if (this.entidadModal.nombreLiquidacionObra == "" || this.entidadModal.nombreLiquidacionObra == null) {
        this.funciones.mensaje("warning", "Debe de ingresar resolución de liquidación de obra");
        return;
      }
      if (this.entidadModal.textoMontoObra == "" || this.entidadModal.textoMontoObra == null) {
        this.funciones.mensaje("warning", "Debe de ingresar un monto de liquidación de obra");
        return;
      }
      if (this.entidadModal.fechaLiquidacionObra == null) {
        this.funciones.mensaje("warning", "Debe de seleccionar una fecha de liquidación de obra");
        return;
      }
      if (this.entidadModal.archivoLiquidacionObra == null || this.entidadModal.archivoLiquidacionObra == "") {
        if (this.entidadEditar.ruta_archivo_liquidacion_obra == null) {
          this.funciones.mensaje("warning", "Debe de adjuntar un archivo en liquidación de obra");
          return;
        }
      }
      // if(this.entidadModal.nombreLiquidacionSupervision == "" || this.entidadModal.nombreLiquidacionSupervision == null){
      //   this.funciones.mensaje("warning","Debe de ingresar resolución de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.textoMontoSupervision == "" || this.entidadModal.textoMontoSupervision == null){
      //   this.funciones.mensaje("warning","Debe de ingresar un monto de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.fechaLiquidacionSupervision == null){
      //   this.funciones.mensaje("warning","Debe de seleccionar una fecha de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.archivoLiquidacionSupervision == null || this.entidadModal.archivoLiquidacionSupervision == ""){
      //   if(this.entidadEditar.ruta_archivo_liquidacion_supervicion == null){
      //     this.funciones.mensaje("warning","Debe de adjuntar un archivo en liquidación de supervisión");
      //     return;
      //   }
      // }
    }
    let enviarEditar = new Liquidacion();
    enviarEditar.id_liquidacion_seguimiento = this.entidadEditar.id_liquidacion_seguimiento;
    enviarEditar.id_seguimiento_monitoreo_obra = this.entidadEditar.id_seguimiento_monitoreo_obra;
    enviarEditar.id_estado_liquidacion = this.entidadModal.estadoLiquidacion;
    enviarEditar.id_tipo_documento_liquidacion = this.entidadModal.tipoDocumento;
    enviarEditar.fecha_seguimiento = this.entidadModal.fecha.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fecha) : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fecha));
    enviarEditar.observaciones = this.entidadModal.observaciones;
    enviarEditar.nombre_archivo_seguimiento = this.entidadModal.nombreEstadoLiquidacion == "APROBADO" ? null : this.entidadModal.nombreArchivo == null ? this.entidadEditar.ruta_archivo_seguimiento : this.entidadModal.nombreArchivo;
    //si es aprobado
    //Obra
    enviarEditar.resolucion_liquidacion_obra = this.entidadModal.nombreLiquidacionObra;
    enviarEditar.monto_liquidacion_obra = this.entidadModal.textoMontoObra == null || this.entidadModal.textoMontoObra == "" ? null : Number.parseFloat(this.entidadModal.textoMontoObra.toString().replace(/,/g, ""));
    enviarEditar.fecha_liquidacion_obra = this.entidadModal.fechaLiquidacionObra == null ? null : this.entidadModal.fechaLiquidacionObra.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaLiquidacionObra) : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionObra));
    enviarEditar.nombre_archivo_liquidacion_obra = this.entidadModal.archivoLiquidacionObra == null ? this.entidadEditar.ruta_archivo_liquidacion_obra : this.entidadModal.archivoLiquidacionObra;

    //Supervision
    enviarEditar.resolucion_liquidacion_supervicion = this.entidadModal.nombreLiquidacionSupervision;
    enviarEditar.monto_liquidacion_supervicion = this.entidadModal.textoMontoSupervision == null || this.entidadModal.textoMontoSupervision == "" ? null : Number.parseFloat(this.entidadModal.textoMontoSupervision.toString().replace(/,/g, ""));
    enviarEditar.fecha_liquidacion_supervicion = this.entidadModal.fechaLiquidacionSupervision == null ? null : this.entidadModal.fechaLiquidacionSupervision.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaLiquidacionSupervision) : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionSupervision));
    enviarEditar.nombre_archivo_liquidacion_supervicion = this.entidadModal.archivoLiquidacionSupervision == null ? this.entidadEditar.ruta_archivo_liquidacion_supervicion : this.entidadModal.archivoLiquidacionSupervision;

    enviarEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcLiquidacion.editarLiquidacion(enviarEditar).subscribe(
      response => {
        if (response == 0) {
          this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
        }
        else {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )
  }

  guardarLiquidacion() {
    if (this.entidadModal.nombreEstadoLiquidacion == "APROBADO") {
      if (this.entidadModal.nombreLiquidacionObra == "" || this.entidadModal.nombreLiquidacionObra == null) {
        this.funciones.mensaje("warning", "Debe de ingresar resolución de liquidación de obra");
        return;
      }
      if (this.entidadModal.textoMontoObra == "" || this.entidadModal.textoMontoObra == null) {
        this.funciones.mensaje("warning", "Debe de ingresar un monto de liquidación de obra");
        return;
      }
      if (this.entidadModal.fechaLiquidacionObra == null) {
        this.funciones.mensaje("warning", "Debe de seleccionar una fecha de liquidación de obra");
        return;
      }
      if (this.entidadModal.archivoLiquidacionObra == null || this.entidadModal.archivoLiquidacionObra == "") {
        this.funciones.mensaje("warning", "Debe de adjuntar un archivo en liquidación de obra");
        return;
      }
      // if(this.entidadModal.nombreLiquidacionSupervision == "" || this.entidadModal.nombreLiquidacionSupervision == null){
      //   this.funciones.mensaje("warning","Debe de ingresar resolución de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.textoMontoSupervision == "" || this.entidadModal.textoMontoSupervision == null){
      //   this.funciones.mensaje("warning","Debe de ingresar un monto de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.fechaLiquidacionSupervision == null){
      //   this.funciones.mensaje("warning","Debe de seleccionar una fecha de liquidación de supervisión");
      //   return;
      // }
      // if(this.entidadModal.archivoLiquidacionSupervision == null || this.entidadModal.archivoLiquidacionSupervision == ""){
      //   this.funciones.mensaje("warning","Debe de adjuntar un archivo en liquidación de supervisión");
      //   return;
      // }
    }
    let enviarRegistrar = new Liquidacion();
    enviarRegistrar.id_seguimiento_monitoreo_obra = this.idSeguimientoObra;
    enviarRegistrar.id_estado_liquidacion = this.entidadModal.estadoLiquidacion;
    enviarRegistrar.id_tipo_documento_liquidacion = this.entidadModal.tipoDocumento;
    enviarRegistrar.fecha_seguimiento = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fecha));
    enviarRegistrar.observaciones = this.entidadModal.observaciones;
    enviarRegistrar.nombre_archivo_seguimiento = this.entidadModal.nombreEstadoLiquidacion == "APROBADO" ? null : this.entidadModal.nombreArchivo;
    //si es aprobado
    //Obra
    enviarRegistrar.resolucion_liquidacion_obra = this.entidadModal.nombreLiquidacionObra;
    enviarRegistrar.monto_liquidacion_obra = this.entidadModal.textoMontoObra == null || this.entidadModal.textoMontoObra == "" ? null : Number.parseFloat(this.entidadModal.textoMontoObra.toString().replace(/,/g, ""));
    enviarRegistrar.fecha_liquidacion_obra = this.entidadModal.fechaLiquidacionObra == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionObra));
    enviarRegistrar.nombre_archivo_liquidacion_obra = this.entidadModal.archivoLiquidacionObra;
    //Supervision
    enviarRegistrar.resolucion_liquidacion_supervicion = this.entidadModal.nombreLiquidacionSupervision;
    enviarRegistrar.monto_liquidacion_supervicion = this.entidadModal.textoMontoSupervision == null || this.entidadModal.textoMontoSupervision == "" ? null : Number.parseFloat(this.entidadModal.textoMontoSupervision.toString().replace(/,/g, ""));
    enviarRegistrar.fecha_liquidacion_supervicion = this.entidadModal.fechaLiquidacionSupervision == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionSupervision));
    enviarRegistrar.nombre_archivo_liquidacion_supervicion = this.entidadModal.archivoLiquidacionSupervision;

    enviarRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    this.svcLiquidacion.registrarLiquidacion(enviarRegistrar).subscribe(
      response => {
        if (response == 0) {
          this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
        }
        else {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )
  }

}
