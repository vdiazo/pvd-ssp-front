import { Component, OnInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../appSettings/functions';
import { Capacitacion, CapacitacionModal, detalleCapacitacion } from '../../../models/Capacitacion';
import { tipoArchivo } from '../../../appSettings/enumeraciones';
import { FacadeService } from '../../../patterns/facade.service';


@Component({
  selector: 'app-modal-capacitacion',
  templateUrl: './modal-capacitacion.component.html',
  styleUrls: ['./modal-capacitacion.component.css']
})
export class ModalCapacitacionComponent implements OnInit {
  
  entidadModal:CapacitacionModal;
  entidadEditar
  cambiarEditar:boolean = true;
  nombreArchivoFoto:string ="";
  listArchivosSeleccionados = [];
  listArchivosSeleccionadosTemporal = [];
  listTipoCapacitacion
  tipoArchivoSave:string="";

  IdTipoArchivo: number = tipoArchivo.capacitacionDetalle;

  @Output() retornoValores = new EventEmitter();

  constructor(
    public modalRef: BsModalRef,
    private funciones : Functions,
    private fs : FacadeService
  ) { }

  ngOnInit() {
    this.entidadModal = new CapacitacionModal();
    if(this.entidadEditar !=null){
      if(this.entidadEditar.id_tipo_capacitacion==1){
        this.tipoArchivoSave=".pdf,.pptx,.docx"
      }
      if(this.entidadEditar.id_tipo_capacitacion==2){
        this.tipoArchivoSave=".mp4,.avi,.flv,.mpeg,.wmv"
      }


    //  if(this.entidadEditar.detalle_capacitacion!=null){
    //     this.listArchivosSeleccionados=this.entidadEditar.detalle_capacitacion;
    //   }
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
    this.listarControles();


  }

  listarControles(){
    this.fs.autoCapacitacionService.listarCapacitacionControl().subscribe(
      (data:any)=>{
        this.listTipoCapacitacion=data.tipo_capacitacion;
      }
    )
  }

  administrarCapacitacion(){
    if(this.entidadEditar==null){
        this.guardarCapacitacion();
    }else{
        this.editarCapacitacion();
    }
  }

  setearCamposEditar(){
    this.entidadModal.id_capacitacion=this.entidadEditar.id_capacitacion;
    this.entidadModal.id_tipo_capacitacion=this.entidadEditar.id_tipo_capacitacion;
    this.entidadModal.denominacion=this.entidadEditar.denominacion;
    if(this.entidadEditar.detalle_capacitacion != null){
      for(let i=0;i <= this.entidadEditar.detalle_capacitacion.length -1;i++){
        this.listArchivosSeleccionados.push({"id_detalle_capacitacion": this.entidadEditar.detalle_capacitacion[i].id_detalle_capacitacion,"nombre_archivo":this.entidadEditar.detalle_capacitacion[i].nombre_archivo,"activo":true,"ruta_archivo": this.entidadEditar.detalle_capacitacion[i].ruta_archivo,"denominacion":this.entidadEditar.detalle_capacitacion[i].denominacion});
      }
    }
  }

  modelDetalleCapacitacionEnvio: Array<detalleCapacitacion>;
  asignarDetalle(){
    this.modelDetalleCapacitacionEnvio = new Array<detalleCapacitacion>();
    this.listArchivosSeleccionados.forEach(element => {
      if(element.id_detalle_capacitacion == 0){
        this.modelDetalleCapacitacionEnvio.push({
          id_detalle_capacitacion: 0,
          nombre_archivo: element.nombre_archivo,
          denominacion: element.denominacion,
          activo: true 
        });
      }else{
        this.modelDetalleCapacitacionEnvio.push({
          id_detalle_capacitacion: element.id_detalle_capacitacion,
          nombre_archivo: element.nombre_archivo,
          denominacion: element.denominacion,
          activo: true
        });
      }
    });

    this.listArchivosEliminados.forEach(q => { 
      if(q.id_detalle_capacitacion>0){
        this.modelDetalleCapacitacionEnvio.push({
          id_detalle_capacitacion: q.id_detalle_capacitacion,
          nombre_archivo: q.nombre_archivo,
          denominacion: q.denominacion,
          activo: q.activo
        });
      }
      
    });
  }

  guardarCapacitacion(){
    let entidadRegistrar = new Capacitacion();
    entidadRegistrar.id_capacitacion=0;
    entidadRegistrar.id_tipo_capacitacion=this.entidadModal.id_tipo_capacitacion;
    entidadRegistrar.denominacion=this.entidadModal.denominacion;
    entidadRegistrar.usuario_creacion=sessionStorage.getItem("Usuario");
    if(this.listArchivosSeleccionados!=null){
      if(this.listArchivosSeleccionados.length==0){
        this.funciones.mensaje("info", "Debe seleccionar un archivo.");
        return false;
      }
    }

    this.asignarDetalle();
    let param={
      "_BE_Tm_Ssppvd_Capacitacion":entidadRegistrar,
      "_List_BE_Td_Ssppvd_Detalle_Capacitacion":this.modelDetalleCapacitacionEnvio
    }
    this.fs.autoCapacitacionService.insertarCapacitacion(param).subscribe(
      data=>{
        if(data == 0){
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
        else{
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("insertar",""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )

    
  }

  editarCapacitacion(){
    let entidadEditar = new Capacitacion();
    entidadEditar.id_capacitacion = this.entidadEditar.id_capacitacion;
    entidadEditar.id_tipo_capacitacion=this.entidadModal.id_tipo_capacitacion;
    entidadEditar.denominacion=this.entidadModal.denominacion;
    entidadEditar.usuario_modificacion=sessionStorage.getItem("Usuario");

    this.asignarDetalle();
    let paramUpdate={
      "_BE_Tm_Ssppvd_Capacitacion":entidadEditar,
      "_List_BE_Td_Ssppvd_Detalle_Capacitacion": this.modelDetalleCapacitacionEnvio,
    }
    
    this.fs.autoCapacitacionService.modificarCapacitacion(paramUpdate).subscribe(
      data=>{
        if(data == 0){
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
        else{
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("actualizar",""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );

  }

  SeleccionarArchivo(evento){
    if(evento.id_tipo_capacitacion==1){
      this.tipoArchivoSave=".pdf,.pptx,.docx"
    }
    if(evento.id_tipo_capacitacion==2){
      this.tipoArchivoSave=".mp4,.avi,.flv,.mpeg,.wmv"
    }
  }
  


  fileChangeEventFotoVideo(evento: any){
    if (evento.uploaded != null) {
      this.nombreArchivoFoto = evento.uploaded._body;
    }
  }

  formData: FormData = new FormData();
  //arrArchivosEnvio = [];
  contador: number = 0;

  comentario:string="";
  fileChangeEvent(evento: any) {
    let InputComentario: HTMLInputElement
    /*if(this.entidadEditar==null){
      InputComentario = document.getElementsByName("descripcionArchivo")[0] as HTMLInputElement;
      if(InputComentario.value==""){
        this.funciones.mensaje("info", "Ingrese la descripción del archivo.");
        return false;
      }
    }else{
      InputComentario = document.getElementsByName("descripcionArchivo")[1] as HTMLInputElement;
      if(InputComentario.value==""){
        this.funciones.mensaje("info", "Ingrese la descripción del archivo.");
        return false;
      }
    }*/

    
   
    



    if(this.entidadModal.id_tipo_capacitacion==2 && this.listArchivosSeleccionados!=null){
      if(this.listArchivosSeleccionados.length>0){
        this.funciones.mensaje("info", "Solo puede registrar un video.");
        return false;
      }
    }
    if (evento.sizeOK == true) {
      if (this.listArchivosSeleccionadosTemporal != null && this.listArchivosSeleccionadosTemporal != undefined && evento.uploaded!= null) {
        if (this.listArchivosSeleccionadosTemporal.indexOf(evento.uploaded._body) == -1) {
          let InputSalida: HTMLInputElement = document.getElementsByName("fileCapacitacionmodal")[0] as HTMLInputElement;
          let InputComentario: HTMLInputElement
          if(this.entidadEditar==null){
            InputComentario = document.getElementsByName("descripcionArchivo")[0] as HTMLInputElement;
          }else{
            InputComentario = document.getElementsByName("descripcionArchivo")[1] as HTMLInputElement;
          }
          /*if(InputComentario.value==""){
            this.funciones.mensaje("info", "Ingrese la descripción del archivo.");
            InputSalida.value = "";
            return false;
          }*/
            this.comentario = InputComentario.value;

          this.listArchivosSeleccionados.push({"id_detalle_capacitacion":0,"nombre_archivo": evento.uploaded._body,"activo":true,"ruta_archivo": "","denominacion":InputComentario.value});
          //this.listArchivosSeleccionados.push({"id_detalle_capacitacion":0,"nombre_archivo": InputSalida.value,"activo":true,"ruta_archivo": ""});



          

          this.listArchivosSeleccionadosTemporal.push(evento.uploaded._body);
          InputSalida.value = "";
          evento.target.value = '';
          InputComentario.value="";
        }else{
          this.funciones.mensaje("info", "Ya existe un archivo con el nombre ingresado.");
        }
      }
    }
  }
  
  listArchivosEliminados=[];
  eliminarArchivoSeleccionado(aSeleccionado){
    if (this.listArchivosSeleccionados != null && this.listArchivosSeleccionados != undefined) {
      for (let i = 0; i < this.listArchivosSeleccionados.length; i++) {
        if (this.listArchivosSeleccionados[i].nombre_archivo == aSeleccionado.nombre_archivo) {
          this.listArchivosEliminados.push({"id_detalle_capacitacion":this.listArchivosSeleccionados[i].id_detalle_capacitacion,"nombre_archivo": this.listArchivosSeleccionados[i].nombre_archivo,"activo":false,"denominacion":this.listArchivosSeleccionados[i].denominacion});
          this.listArchivosSeleccionados.splice(i, 1);
          this.listArchivosSeleccionadosTemporal.splice(i, 1);
          //this.arrArchivosEnvio.splice(i, 1);
        }
      }
    }
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

}
