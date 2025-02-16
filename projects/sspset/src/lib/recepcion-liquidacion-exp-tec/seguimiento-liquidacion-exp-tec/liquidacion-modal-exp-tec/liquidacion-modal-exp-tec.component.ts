import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Liquidacion, LiquidacionModal } from '../../../../models/liquidacion';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { ProcesoLiquidacionService } from '../../../services/proceso-liquidacion.service';
import { Funciones } from '../../../../appSettings/funciones';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'set-liquidacion-modal-exp-tec',
  templateUrl: './liquidacion-modal-exp-tec.component.html',
  styleUrls: ['./liquidacion-modal-exp-tec.component.css']
})
export class LiquidacionModalExpTecComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  entidadModal : LiquidacionModal;
  entidadEditar;
  cambiarEditarLiquidacion:boolean = true;
  mostrarAprobar:boolean = true;
  estados;
  documentos;
  idSeguimientoObra;
  ruta_seguimiento;
  ruta_obra;
  ruta_supervision;
  ruta_informe_aprobacion;
  ruta_resolucion_aprobacion;
  aprobado;
  id_aprobado;
  IdTipoArchivoSeguimiento: number = tipoArchivo.liquidacion;
  IdTipoArchivoObra: number = tipoArchivo.ResolucionLiquidacionObra;
  IdTipoArchivoSupervision: number = tipoArchivo.ResolucionLiquidacionSupervicion;
  IdTipoArchivoInformeAprobacion:number = tipoArchivo.IdTipoArchivoInformeAprobacion;
  IdTipoArchivoAprobacionResolucion:number = tipoArchivo.IdTipoArchivoAprobacionResolucion;
  desArchivo:boolean = false;
  supervisor;

  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  constructor(public modalRef: BsModalRef, private svcLiquidacion : ProcesoLiquidacionService, public funciones : Funciones, private route: ActivatedRoute) { }

  ngOnInit() {
    this.diaHoy=new Date();
    this.diaInicial=new Date(this.diaHoy.getFullYear(), this.diaHoy.getMonth(), this.diaHoy.getDate());
    this.fechaDesignaconMax=this.diaInicial;
    this.entidadModal = new LiquidacionModal();
     this.listarEstadoLiquidacion();
     this.listarTipoDocumento();   
     if(this.entidadEditar != null){
      this.setearCamposEditar();
      this.cambiarEditarLiquidacion = false;
     }
  }


  setearCamposEditar(){
    //this.entidadModal.id_estado_liquidacion_expediente = this.entidadEditar.id_estado_liquidacion_expediente;
    //this.entidadModal.nombreEstadoLiquidacion = this.entidadEditar.estado_liquidacion_expediente;
    //this.entidadModal.tipoDocumento = this.entidadEditar.id_tipo_documento_liquidacion_expediente;
    //this.entidadModal.fecha = this.entidadEditar.fecha_seguimiento_expediente;
    //this.entidadModal.observaciones = this.entidadEditar.observaciones;
    //this.ruta_seguimiento = this.entidadEditar.ruta_archivo_seguimiento; 
    this.entidadModal.fechaInformeAprobacion=this.entidadEditar.fecha_informe_aprobacion;
    this.entidadModal.fechaAprobacionResolucion=this.entidadEditar.fecha_aprobacion_expediente; 


    //if(this.entidadEditar.estado_liquidacion_expediente == "APROBADO"){
      let arreglo = {denominacion : "APROBADO"}
      this.SeleccionarEstado(arreglo);

      this.ruta_obra = this.entidadEditar.nombre_archivo_liquidacion_expediente;
      this.ruta_supervision = this.entidadEditar.ruta_archivo_liquidacion_supervicion_expediente ;
      this.ruta_informe_aprobacion=this.entidadEditar.nombre_archivo_informe_expediente;
      this.ruta_resolucion_aprobacion=this.entidadEditar.nombre_archivo_aprobacion_expediente;

      this.entidadModal.nombreLiquidacionObra = this.entidadEditar.resolucion_liquidacion_expediente;
      this.entidadModal.fechaLiquidacionObra = this.entidadEditar.fecha_liquidacion_expediente
      this.entidadModal.textoMontoObra = this.entidadEditar.monto_liquidacion_expediente == null ? null : this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.monto_liquidacion_expediente.toString()));

      //this.entidadModal.nombreLiquidacionSupervision = this.entidadEditar.resolucion_liquidacion_supervicion_expediente;
      //this.entidadModal.fechaLiquidacionSupervision = this.entidadEditar.fecha_liquidacion_supervicion_expediente;
      //this.entidadModal.textoMontoSupervision = this.entidadEditar.monto_liquidacion_supervicion_expediente == null? null : this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.monto_liquidacion_supervicion_expediente.toString()));
    //}    
  }

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
  fileChangeEventInformeAprobacion(evento : any){
    if (evento.uploaded != null) {
      this.entidadModal.archivoInformeAprobacion = evento.uploaded._body;  
    }
  }
  fileChangeEventAprobacionResolucion(evento : any){
    if (evento.uploaded != null) {
      this.entidadModal.archivoAprobacionResoluion = evento.uploaded._body;  
    }
  }

  listarEstadoLiquidacion(){
    this.svcLiquidacion.listarEstadoLiquidacion().subscribe(
      data =>{
        this.estados = data;
      }
    )
  }
  listarTipoDocumento(){
    this.svcLiquidacion.listarTipoDocumentoLiquidacion().subscribe(
      data =>{
        this.documentos = data;
      }
    )
  }
  administrarTramo(){
    if(this.entidadEditar==null){
      this.guardarLiquidacion();
    }else{
      this.editarLiquidacion();
    }
  }


  SeleccionarEstado(estado){
    if(estado == null){
      this.mostrarAprobar = true;
      return;
    }
    if(estado.denominacion == "APROBADO"){
      this.entidadModal.nombreEstadoLiquidacion = estado.denominacion;
      this.mostrarAprobar = false;
      this.desArchivo = true;
    }else{
      this.entidadModal.nombreEstadoLiquidacion = estado.denominacion;
      if(this.entidadEditar != null){
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
  editarLiquidacion(){

    /*if(this.id_aprobado != this.entidadEditar.id_liquidacion_seguimiento_expediente){
      if(this.entidadModal.nombreEstadoLiquidacion == "APROBADO" && this.aprobado == true){
        this.funciones.mensaje("info","Ya existe un Proceso de Liquidación aprobado.");
        return;
      }
    }  */

    //if(this.entidadModal.nombreEstadoLiquidacion == "APROBADO"){
      if(this.entidadModal.fechaInformeAprobacion == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de Informe de Aprobación");
        return;
      }
      if(this.entidadModal.archivoInformeAprobacion == null || this.entidadModal.archivoInformeAprobacion == ""){
        if(this.entidadEditar.ruta_archivo_informe_expediente == null){
          this.funciones.mensaje("warning","Debe de adjuntar un archivo en Informe de Aprobación");
         return;
        }
        
      }
      if(this.entidadModal.fechaAprobacionResolucion == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de Aprobación de Resolución");
        return;
      }
      if(this.entidadModal.archivoAprobacionResoluion == null || this.entidadModal.archivoAprobacionResoluion == ""){
        if(this.entidadEditar.ruta_archivo_aprobacion_expediente == null){
          this.funciones.mensaje("warning","Debe de adjuntar un archivo de aprobación de resolución");
          return;
        }
      }

      if(this.entidadModal.nombreLiquidacionObra == "" || this.entidadModal.nombreLiquidacionObra == null){
        this.funciones.mensaje("warning","Debe de ingresar resolución de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.textoMontoObra == "" || this.entidadModal.textoMontoObra == null){
        this.funciones.mensaje("warning","Debe de ingresar un monto de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.fechaLiquidacionObra == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.archivoLiquidacionObra == null || this.entidadModal.archivoLiquidacionObra == ""){
        if(this.entidadEditar.ruta_archivo_liquidacion_expediente == null){
          this.funciones.mensaje("warning","Debe de adjuntar un archivo en liquidación de elaboración de expediente técnico");
          return;
        }
      }

   // }

    let enviarEditar = new Liquidacion();
    enviarEditar.id_liquidacion_seguimiento_expediente = this.entidadEditar.id_liquidacion_seguimiento_expediente;
    enviarEditar.id_seguimiento_ejecucion_expediente = this.entidadEditar.id_seguimiento_ejecucion_expediente;
    //enviarEditar.id_estado_liquidacion_expediente = this.entidadModal.id_estado_liquidacion_expediente;
    //enviarEditar.id_tipo_documento_liquidacion_expediente = this.entidadModal.tipoDocumento;
    //enviarEditar.fecha_seguimiento_expediente =this.entidadModal.fecha.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fecha):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fecha));
    //enviarEditar.observaciones = this.entidadModal.observaciones;
    //enviarEditar.nombre_archivo_seguimiento_expediente = this.entidadModal.nombreEstadoLiquidacion == "APROBADO" ? null: this.entidadModal.nombreArchivo==null? this.entidadEditar.ruta_archivo_seguimiento : this.entidadModal.nombreArchivo;
    //si es aprobado
    //Obra
    enviarEditar.resolucion_liquidacion_expediente = this.entidadModal.nombreLiquidacionObra;
    enviarEditar.monto_liquidacion_expediente = this.entidadModal.textoMontoObra == null || this.entidadModal.textoMontoObra == "" ? null : Number.parseFloat(this.entidadModal.textoMontoObra.toString().replace(/,/g, ""));
    enviarEditar.fecha_liquidacion_expediente = this.entidadModal.fechaLiquidacionObra == null ? null : this.entidadModal.fechaLiquidacionObra .toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaLiquidacionObra):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionObra));
    //if(enviarEditar.id_estado_liquidacion_expediente==1){
     // enviarEditar.nombre_archivo_liquidacion_expediente ="";
    //}else{
      enviarEditar.nombre_archivo_liquidacion_expediente=this.entidadModal.archivoLiquidacionObra==null? this.entidadEditar.nombre_archivo_liquidacion_expediente :this.entidadModal.archivoLiquidacionObra;
    //}
    
    //Supervision
    //enviarEditar.resolucion_liquidacion_supervicion_expediente = this.entidadModal.nombreLiquidacionSupervision;
    //enviarEditar.monto_liquidacion_supervicion_expediente = this.entidadModal.textoMontoSupervision == null || this.entidadModal.textoMontoSupervision == "" ? null : Number.parseFloat(this.entidadModal.textoMontoSupervision.toString().replace(/,/g, ""));
    //enviarEditar.fecha_liquidacion_supervicion_expediente = this.entidadModal.fechaLiquidacionSupervision == null ? null : this.entidadModal.fechaLiquidacionSupervision .toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaLiquidacionSupervision):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionSupervision));
    
    /*if(enviarEditar.id_estado_liquidacion_expediente==1){
      enviarEditar.nombre_archivo_liquidacion_supervicion_expediente = "";
    }else{
      enviarEditar.nombre_archivo_liquidacion_supervicion_expediente=this.entidadModal.archivoLiquidacionSupervision==null? this.entidadEditar.ruta_archivo_liquidacion_supervicion_expediente : this.entidadModal.archivoLiquidacionSupervision;
    }*/

    //
    enviarEditar.fecha_informe_aprobacion = this.entidadModal.fechaInformeAprobacion == null ? null : this.entidadModal.fechaInformeAprobacion .toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaInformeAprobacion):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaInformeAprobacion));
    enviarEditar.nombre_archivo_informe = this.entidadModal.archivoInformeAprobacion==null? this.entidadEditar.nombre_archivo_informe_expediente :this.entidadModal.archivoInformeAprobacion;

    enviarEditar.fecha_aprobacion_expediente = this.entidadModal.fechaAprobacionResolucion == null ? null : this.entidadModal.fechaAprobacionResolucion .toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadModal.fechaAprobacionResolucion):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaAprobacionResolucion));
    enviarEditar.nombre_archivo_aprobacion =this.entidadModal.archivoAprobacionResoluion==null? this.entidadEditar.nombre_archivo_aprobacion_expediente :this.entidadModal.archivoAprobacionResoluion;;

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

  guardarLiquidacion(){
   // if(this.entidadModal.nombreEstadoLiquidacion == "APROBADO"){

      if(this.entidadModal.fechaInformeAprobacion == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de Informe de Aprobación");
        return;
      }
      if(this.entidadModal.archivoInformeAprobacion == null || this.entidadModal.archivoInformeAprobacion == ""){
        this.funciones.mensaje("warning","Debe de adjuntar un archivo en Informe de Aprobación");
        return;
      }
      if(this.entidadModal.fechaAprobacionResolucion == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de Aprobación de Resolución");
        return;
      }
      if(this.entidadModal.archivoAprobacionResoluion == null || this.entidadModal.archivoAprobacionResoluion == ""){
        this.funciones.mensaje("warning","Debe de adjuntar un archivo de aprobación de resolución");
        return;
      }


      if(this.entidadModal.nombreLiquidacionObra == "" || this.entidadModal.nombreLiquidacionObra == null){
        this.funciones.mensaje("warning","Debe de ingresar resolución de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.textoMontoObra == "" || this.entidadModal.textoMontoObra == null){
        this.funciones.mensaje("warning","Debe de ingresar un monto de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.fechaLiquidacionObra == null){
        this.funciones.mensaje("warning","Debe de seleccionar una fecha de liquidación de elaboración de expediente técnico");
        return;
      }
      if(this.entidadModal.archivoLiquidacionObra == null || this.entidadModal.archivoLiquidacionObra == ""){
        this.funciones.mensaje("warning","Debe de adjuntar un archivo en liquidación de expediente técnico");
        return;
      }




    //}
    let enviarRegistrar = new Liquidacion();
    enviarRegistrar.id_seguimiento_ejecucion_expediente =this.idSeguimientoObra;
    //enviarRegistrar.id_estado_liquidacion_expediente = this.entidadModal.id_estado_liquidacion_expediente;
    //enviarRegistrar.id_tipo_documento_liquidacion_expediente = this.entidadModal.tipoDocumento;
    //enviarRegistrar.fecha_seguimiento_expediente == null ? null :  this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fecha));
    //enviarRegistrar.observaciones = this.entidadModal.observaciones;
    //enviarRegistrar.nombre_archivo_seguimiento_expediente = this.entidadModal.nombreEstadoLiquidacion == "APROBADO" ? null: this.entidadModal.nombreArchivo;

    enviarRegistrar.fecha_informe_aprobacion = this.entidadModal.fechaInformeAprobacion == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaInformeAprobacion));
    enviarRegistrar.nombre_archivo_informe = this.entidadModal.archivoInformeAprobacion;

    enviarRegistrar.fecha_aprobacion_expediente = this.entidadModal.fechaAprobacionResolucion == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaAprobacionResolucion));
    enviarRegistrar.nombre_archivo_aprobacion =this.entidadModal.archivoAprobacionResoluion;

    //si es aprobado
    //Obra
    enviarRegistrar.resolucion_liquidacion_expediente = this.entidadModal.nombreLiquidacionObra;
    enviarRegistrar.monto_liquidacion_expediente = this.entidadModal.textoMontoObra == null || this.entidadModal.textoMontoObra == "" ? null : Number.parseFloat(this.entidadModal.textoMontoObra.toString().replace(/,/g, ""));
    enviarRegistrar.fecha_liquidacion_expediente = this.entidadModal.fechaLiquidacionObra == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionObra));
    enviarRegistrar.nombre_archivo_liquidacion_expediente = this.entidadModal.archivoLiquidacionObra;
    //Supervision
    //enviarRegistrar.resolucion_liquidacion_supervicion_expediente = this.entidadModal.nombreLiquidacionSupervision;
    //enviarRegistrar.monto_liquidacion_supervicion_expediente = this.entidadModal.textoMontoSupervision == null || this.entidadModal.textoMontoSupervision == "" ? null : Number.parseFloat(this.entidadModal.textoMontoSupervision.toString().replace(/,/g, ""));
    //enviarRegistrar.fecha_liquidacion_supervicion_expediente = this.entidadModal.fechaLiquidacionSupervision == null ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadModal.fechaLiquidacionSupervision));
    //enviarRegistrar.nombre_archivo_liquidacion_supervicion_expediente = this.entidadModal.archivoLiquidacionSupervision;

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
