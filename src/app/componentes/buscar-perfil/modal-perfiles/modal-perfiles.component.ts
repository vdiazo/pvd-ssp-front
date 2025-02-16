import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { ModalPerfiles, Perfiles } from '../../../models/Perfil';
import { PerfilesService } from '../../../services/perfiles.service';
import { Functions } from '../../../appSettings/functions';
@Component({
  selector: 'app-modal-perfiles',
  templateUrl: './modal-perfiles.component.html',
  styleUrls: ['./modal-perfiles.component.css']
})
export class ModalPerfilesComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : ModalPerfiles;
  entidadEditar;
  cambiarEditar:boolean = true;
  constructor(public modalRef: BsModalRef, private svcPerfiles : PerfilesService, private funciones : Functions) { }

  ngOnInit() {
    this.entidadModal = new ModalPerfiles();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  administrarPerfil(){
    if(this.entidadEditar==null){
      this.guardarPerfil();
    }else{
      this.editarPerfil();
    }
  }
  setearCamposEditar(){
    this.entidadModal.id_perfil = this.entidadEditar.id_perfil;
    this.entidadModal.nombre_perfil = this.entidadEditar.nombre_perfil;
    this.entidadModal.estado = this.entidadEditar.estado;
    this.entidadModal.filtro_general = this.entidadEditar.filtro_general;
  }
  editarPerfil(){
    let entidadEditar = new Perfiles();
    entidadEditar.id_perfil = this.entidadEditar.id_perfil;
    entidadEditar.nombre_perfil = this.entidadModal.nombre_perfil;
    entidadEditar.estado = this.entidadModal.estado;
    entidadEditar.filtro_general = this.entidadModal.filtro_general;
    entidadEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcPerfiles.editarPerfil(entidadEditar).subscribe(
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
  guardarPerfil(){ 
    let entidadRegistrar = new Perfiles();
    entidadRegistrar.id_perfil = 0;
    entidadRegistrar.nombre_perfil = this.entidadModal.nombre_perfil;
    entidadRegistrar.estado = true;
    entidadRegistrar.filtro_general = this.entidadModal.filtro_general;
    entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    this.svcPerfiles.registrarPerfil(entidadRegistrar).subscribe(
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
