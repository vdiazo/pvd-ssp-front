import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuModal, Menu } from '../../../models/Menu';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { Functions } from '../../../appSettings/functions';
import { MenuService } from '../../../services/menu.service';
import { ModuloService } from 'src/app/services/modulo.service';

@Component({
  selector: 'app-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : MenuModal;
  arregloEstado = [{estado : true,nom_estado:"ACTIVO"},{estado:false,nom_estado:"INACTIVO"}]
  entidadEditar;
  cambiarEditar:boolean = true;
  entidadPadre;
  desOrden:boolean = false;
  modulos:any;
  ListadoSistemas:any=[];
  constructor(public modalRef: BsModalRef,private svcMenu:MenuService, public funciones: Functions, private srvModulo:ModuloService) { }

  ngOnInit() {
    //this.listarModulos();
    this.entidadModal = new MenuModal();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
    if(this.entidadPadre != null){
      //agregado para heredar modulo de padre
      this.entidadModal.id_modulo=this.entidadPadre.id_modulo;
      this.desOrden=true;
      this.entidadModal.nivel = this.entidadPadre.nivel + 1;
      this.entidadModal.id_menu_padre = this.entidadPadre.id_menu;
    }
  }

  administrarMenu(){
    if(this.entidadEditar==null){
      this.guardarMenu();
    }else{
      this.editarMenu();
    }
  }
  setearCamposEditar(){
    this.entidadModal.nombre_menu = this.entidadEditar.nombre_menu;
    this.entidadModal.id_menu_padre = this.entidadEditar.id_menu_padre;
    this.entidadModal.orden = this.entidadEditar.orden;
    this.entidadModal.nivel = this.entidadEditar.nivel;
    this.entidadModal.url = this.entidadEditar.url;
    this.entidadModal.icono = this.entidadEditar.icono;
    this.entidadModal.estado = this.entidadEditar.estado;
    this.entidadModal.id_modulo = this.entidadEditar.id_modulo;
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  editarMenu(){   
    let entidadEditar = new Menu();
    entidadEditar.id_menu = this.entidadEditar.id_menu;
    entidadEditar.nombre_menu = this.entidadModal.nombre_menu;
    entidadEditar.id_menu_padre = this.entidadModal.id_menu_padre;
    entidadEditar.icono = this.entidadModal.icono;
    entidadEditar.nivel = this.entidadModal.nivel;
    entidadEditar.orden = this.entidadModal.orden;
    entidadEditar.url = this.entidadModal.url;
    entidadEditar.estado = this.entidadModal.estado;
    entidadEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    entidadEditar.id_modulo=this.entidadModal.id_modulo;
    this.svcMenu.editarMenu(entidadEditar).subscribe(
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
  guardarMenu(){ 
    let entidadRegistrar = new Menu();
    //entidadRegistrar.id_menu = 0;
    entidadRegistrar.nombre_menu = this.entidadModal.nombre_menu;
    entidadRegistrar.id_menu_padre = this.entidadModal.id_menu_padre;
    entidadRegistrar.icono = this.entidadModal.icono;
    entidadRegistrar.nivel = this.entidadModal.nivel;
    entidadRegistrar.orden = this.entidadModal.orden;
    entidadRegistrar.url = this.entidadModal.url;
    entidadRegistrar.estado = true;
    entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    entidadRegistrar.id_modulo=this.entidadModal.id_modulo;
    this.svcMenu.registrarMenu(entidadRegistrar).subscribe(
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
  listarModulos() {
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.srvModulo.ListarModulos().subscribe(
      data => {
        let response= data as any;
        this.modulos=JSON.parse(response);
      }
    ) 
  }
}