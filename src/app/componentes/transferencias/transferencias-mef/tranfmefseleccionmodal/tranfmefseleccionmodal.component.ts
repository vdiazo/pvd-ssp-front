import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TransferenciaRealizada, TransferenciaRealizadaMef } from 'src/app/models/response/transferencia-realizada';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TransferenciaRealizadaRequest } from 'src/app/models/request/transferencia-request';
import { Functions } from 'src/app/appSettings';
import { TransferenciaMaestra } from 'src/app/models/response/transferencia-maestra';
import { FacadeService } from 'src/app/patterns/facade.service';

@Component({
  selector: 'app-tranfmefseleccionmodal',
  templateUrl: './tranfmefseleccionmodal.component.html',
  styleUrls: ['./tranfmefseleccionmodal.component.css']
})
export class TranfmefseleccionmodalComponent implements OnInit {
  listSeleccionProyectos = [];
  listArchivosSeleccionados = [];
  listArchivosSeleccionadosTemporal = [];
  modelTransferencia;
  arrProyectosSeleccionadosEnvioModal;
  arrArchivosCargados;
  model: TransferenciaRealizadaMef;
  lstFuenteFinanTransferencia = [];
  nombreArchivo: string = null;
  activarTransferencia;
  maxDate = new Date();

  modelRequest:TransferenciaRealizadaRequest;

  constructor(public modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService) { }
  @Output() retornoValores = new EventEmitter();
  ngOnInit() {
    this.model = new TransferenciaRealizadaMef();
    this.model.id_transferencia = (this.modelTransferencia.id_transferencia_mef !=undefined)? this.modelTransferencia.id_transferencia_mef:0;
    this.listarFuenteFinanciamiento();
    this.model._BE_Tm_Ssppvd_Transferencia_Mef = new TransferenciaMaestra();
    if(this.model.id_transferencia > 0){
      this.editarTransferencia();
    }
    this.listSeleccionProyectos = this.arrProyectosSeleccionadosEnvioModal;
    this.listArchivosSeleccionados = this.arrArchivosCargados;
  }
  closeModal() {
    this.modalRef.hide();
  }
  administrarConfirmarTransferencia(model) {
    //registrar
    this.model._BE_Tm_Ssppvd_Transferencia_Mef.fecha_publicacion = model.fecha_publicacion;
    this.model._BE_Tm_Ssppvd_Transferencia_Mef.dispositivo = model.dispositivo;
    this.model._BE_Tm_Ssppvd_Transferencia_Mef.usuario_creacion = sessionStorage.getItem("Usuario");
    if(this.listSeleccionProyectos != null){
      if(this.arrArchivosEnvio != null){
        if(this.arrArchivosEnvio.length > 0){
          let sumMonto =0;
          for(let i=0; i < this.listSeleccionProyectos.length; i++){
            model.ListBE_Td_Ssppvd_Transferencia_Mef_Convenio.push({"id_convenio": this.listSeleccionProyectos[i].id_convenio
            , "monto_transferido": Number.parseFloat(this.listSeleccionProyectos[i].monto_transferido.toString().replace(/,/g, "")) 
            , "id_fuente_financiamiento_transferencia": this.listSeleccionProyectos[i].id_fuente_financiamiento_transferencia}); 
            sumMonto = sumMonto + Number.parseFloat(this.listSeleccionProyectos[i].monto_transferido.toString().replace(/,/g, ""));
          }
          // if(this.listArchivosSeleccionados != null){
          //   for(let j=0; j< this.listArchivosSeleccionados.length; j++){
          //     model.ListBE_Td_Ssppvd_Transferencia_Archivo.push({"nombre_archivo": this.listArchivosSeleccionados[j].nombre_archivo
          //     , "archivo": this.listArchivosSeleccionados[j].archivo.toString()});
          //   }
          // }
          if (model.id_transferencia == 0) {
            this.model._BE_Tm_Ssppvd_Transferencia_Mef.monto = sumMonto;
            // this.modelRequest = new TransferenciaRealizadaRequest();
            // this.modelRequest.ListBE_Td_Ssppvd_Transferencia_Archivo = new TransferenciaRealizadaRequest().ListBE_Td_Ssppvd_Transferencia_Archivo;
            // this.modelRequest.ListBE_Td_Ssppvd_Transferencia_Convenio = new TransferenciaRealizadaRequest().ListBE_Td_Ssppvd_Transferencia_Convenio;
    
            // this.modelRequest._BE_Tm_Ssppvd_Transferencia = this.model._BE_Tm_Ssppvd_Transferencia;
            // this.modelRequest.ListBE_Td_Ssppvd_Transferencia_Convenio = this.model.ListBE_Td_Ssppvd_Transferencia_Convenio;
            // this.modelRequest.ListBE_Td_Ssppvd_Transferencia_Archivo = this.model.ListBE_Td_Ssppvd_Transferencia_Archivo;
            this.formData.append('_BE_Tm_Ssppvd_Transferencia_Mef', this.devolverParametroJson(this.model._BE_Tm_Ssppvd_Transferencia_Mef));
            this.formData.append('ListBE_Td_Ssppvd_Transferencia_Mef_Convenio', this.devolverParametroJson(this.model.ListBE_Td_Ssppvd_Transferencia_Mef_Convenio));
            //this.formData.append('ListBE_Td_Ssppvd_Transferencia_Archivo', this.devolverParametroJson(this.arrArchivosEnvio));
            if(this.arrArchivosEnvio != null){
              for(let i=0; i< this.arrArchivosEnvio.length;i++){
                this.formData.append("uploadFile" + i.toString(), this.arrArchivosEnvio[i].archivo, this.arrArchivosEnvio[i].nombre_archivo);
              }
            }

            this.fs.transferenciaRealizadaService.insertarTransferenciaMef(this.formData).subscribe(
              respuesta => {
                this.retornoValores.emit(respuesta);
                this.modalRef.hide();
                this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              }
            );
          }
        }else{
          this.funciones.mensaje("info", "Debe adjuntar por lo menos un archivo.");
        }
      }else{
        this.funciones.mensaje("info", "Debe adjuntar por lo menos un archivo.");
      }
    }
    
  }

  editarTransferencia() {

    this.model.fecha_publicacion = this.funciones.ConvertStringtoDateDB(this.modelTransferencia.fecha_publicacion);
    this.model.dispositivo = this.modelTransferencia.dispositivo;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
  }

  listarFuenteFinanciamiento() {
    this.fs.transferenciaRealizadaService.listarFuenteFinanciamiento().subscribe(
      respuesta => {
        let lstFuenteFinanTransferenciaReturn;
        lstFuenteFinanTransferenciaReturn = respuesta as any;
        this.lstFuenteFinanTransferencia = lstFuenteFinanTransferenciaReturn;
      }
    );
  }
  // fileChangeEvent(evento: any) {
  //   if (evento.uploaded != null) {
  //     if (this.listArchivosSeleccionadosTemporal != null && this.listArchivosSeleccionadosTemporal != undefined) {
  //       if (this.listArchivosSeleccionadosTemporal.indexOf(evento.nombre) == -1) {
  //         this.listArchivosSeleccionados.push({"nombre_archivo": evento.nombre, "archivo": evento.uploaded});
  //         this.listArchivosSeleccionadosTemporal.push(evento.nombre);
  //         let InputSalida: HTMLInputElement = document.getElementsByName("fileTransferenciamodal")[0] as HTMLInputElement;
  //         InputSalida.value = "";
  //         evento.target.value = '';
  //       }else{
  //         this.funciones.mensaje("info", "Ya existe un archivo con el nombre ingresado.");
  //       }
  //     }
  //   }
  // }

  eliminarArchivoSeleccionado(aSeleccionado){
    if (this.listArchivosSeleccionados != null && this.listArchivosSeleccionados != undefined) {
      for (let i = 0; i < this.listArchivosSeleccionados.length; i++) {
        if (this.listArchivosSeleccionados[i].nombre_archivo == aSeleccionado.nombre_archivo) { //this.listTransferenciasSeleccion[index]
          this.listArchivosSeleccionados.splice(i, 1);
          this.listArchivosSeleccionadosTemporal.splice(i, 1);
          this.arrArchivosEnvio.splice(i, 1);
        }
      }
    }
  }

  formData: FormData = new FormData();
  arrArchivosEnvio = [];
  contador: number = 0;
  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true) {
      if (this.listArchivosSeleccionadosTemporal != null && this.listArchivosSeleccionadosTemporal != undefined) {
        if (this.listArchivosSeleccionadosTemporal.indexOf(evento.nombre) == -1) {
          this.listArchivosSeleccionados.push({"nombre_archivo": evento.nombre, "archivo": evento.uploaded});
          this.listArchivosSeleccionadosTemporal.push(evento.nombre);
          let InputSalida: HTMLInputElement = document.getElementsByName("fileTransferenciamodal")[0] as HTMLInputElement;
          InputSalida.value = "";
          evento.target.value = '';
          this.registrarArchivoData(evento.file);
        }else{
          this.funciones.mensaje("info", "Ya existe un archivo con el nombre ingresado.");
        }
      }
    }
  }

  registrarArchivoData(file: any) {
    //let formData: FormData = new FormData();
    //for(let i=0; i<file.length; i++){
      this.arrArchivosEnvio.push({"identificador":"uploadFile" + this.contador.toString(),"archivo": file ,"nombre_archivo": file.name });
    //}
    
    this.contador++;
  }

  devolverParametroJson(pList){
    let entidad = {
      data: JSON.stringify(pList)
    }
    return entidad.data;
  }

  verArchivoSeleccionado(){

  }
}
