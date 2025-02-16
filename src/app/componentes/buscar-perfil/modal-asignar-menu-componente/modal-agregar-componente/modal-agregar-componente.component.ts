import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PerfilesService } from '../../../../services/perfiles.service';
import { Functions } from '../../../../appSettings/functions';
import { ModalAsignacionComponente } from '../../../../models/Perfil';
@Component({
  selector: 'app-modal-agregar-componente',
  templateUrl: './modal-agregar-componente.component.html',
  styleUrls: ['./modal-agregar-componente.component.css']
})
export class ModalAgregarComponenteComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  idDetallePerfilMenu:number;
  arregloDetalleComponente:any = [];
  arregloEnvio:any = [];
  response:any;
  ocultarRegistrar:boolean = true;
  todos:boolean = false;
  constructor(public modalRef: BsModalRef, private svcPerfiles : PerfilesService, private funciones: Functions) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

  ComponentesTodo(){
    if(this.todos){
      let check: NodeList = document.getElementsByName("componente") as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element["checked"] = true;
      }
      this.arregloDetalleComponente.forEach(element => {
        this.arregloEnvio.push({visible: true, id_componente: element.id_componente, id_detalle_perfil_menu : this.idDetallePerfilMenu, usuario_creacion : sessionStorage.getItem("Usuario")});
      });
      let ckbtodo: NodeList = document.getElementsByClassName("ckbtodo") as NodeList;
      for (let index = 0; index < ckbtodo.length; index++) {
        const element = ckbtodo[index];
        element["style"] = "font-size: 11px";
      }
    }else{
      let check: NodeList = document.getElementsByName("componente") as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element["checked"] = false;
      }
      this.arregloEnvio = [];
      let ckbtodo: NodeList = document.getElementsByClassName("ckbtodo") as NodeList;
      for (let index = 0; index < ckbtodo.length; index++) {
        const element = ckbtodo[index];
        element["style"] = "display:none;font-size: 11px";
      }
    }
    if(this.arregloEnvio.length == 0){
      this.ocultarRegistrar = true;
    }else{
      this.ocultarRegistrar=false;
    }
  }

  asignarVisible(codigo,componente){
    let check: NodeList = document.getElementsByName(componente) as NodeList;
    this.arregloEnvio.forEach(element => {
      if(element.id_componente == codigo){        
        for (let index = 0; index < check.length; index++) {
          const valor = check[index];
          element.visible = valor["checked"];
        }
      }
    });
  }

  asignarComponente(codigo,componente){
    let existe = this.arregloEnvio.find(x => x.id_componente === codigo);
    if(existe == undefined){
      this.arregloEnvio.push({visible: true, id_componente: codigo, id_detalle_perfil_menu : this.idDetallePerfilMenu, usuario_creacion : sessionStorage.getItem("Usuario")});
      let check: NodeList = document.getElementsByName(componente) as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element["style"] = "";
      }
      let span: HTMLElement = document.getElementById(componente) as HTMLElement;
      span.setAttribute("style","font-size: 11px;");
    }else{
      var eliminar = this.arregloEnvio.indexOf(existe);
      if(eliminar != -1) {
        this.arregloEnvio.splice(eliminar, 1);
      }      
      let check: NodeList = document.getElementsByName(componente) as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element["style"] = "display:none";
      }
      let span: HTMLElement = document.getElementById(componente) as HTMLElement;
      span.setAttribute("style","display:none;font-size: 11px;");
    }
    if(this.arregloEnvio.length == 0){
      this.ocultarRegistrar = true;
    }else{
      this.ocultarRegistrar=false;
    }
  }

  ListadoPrincipal(){
    this.svcPerfiles.ListarComponentePendientes(this.idDetallePerfilMenu).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response.length != 0){
              this.arregloDetalleComponente = this.response;
            }else{
              this.arregloDetalleComponente = [];
            };
          }else{
            this.arregloDetalleComponente = [];
          }
      }
    )
  }

  guardarAsignacionComponente(){
    this.svcPerfiles.registrarDetalleMenuComponente(this.arregloEnvio).subscribe(
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


}
