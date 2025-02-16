import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioClaveModal, Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-modal-cambiar-clave',
  templateUrl: './modal-cambiar-clave.component.html',
  styleUrls: ['./modal-cambiar-clave.component.css'],
  providers: [Functions]
})
export class ModalCambiarClaveComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadClave;
  stringToken;
  entidadModal : UsuarioClaveModal;
  response;
  municipalidad:boolean=true;
  constructor(public modalRef: BsModalRef,private svcUsuario:UsuarioService, public funciones: Functions) { }

  ngOnInit() {
    this.entidadModal = new UsuarioClaveModal();
    if(this.entidadClave.perfil[0].nombre_perfil == "RESPONSABLE"){
      this.municipalidad =false;
    }
  }
  administrarCambioClave(){
    if(this.entidadClave.perfil[0].nombre_perfil == "RESPONSABLE"){
      this.actualizarContraseñaMuni();
    }else{
      this.actualizarContraseña();
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

  actualizarContraseñaMuni(){
    if(this.entidadModal.repetirClave != this.entidadModal.nuevaClave){
      this.funciones.mensaje("warning","Deben de coincidir las contraseñas");
      return;
    }
    let enviar = new Usuario();
    enviar.id_usuario = this.entidadClave.id_usuario;
    enviar.nombre_usuario = this.entidadModal.nombreUsuario;
    enviar.contrasenia = this.entidadModal.nuevaClave;
    enviar.correo_electronico = this.entidadModal.correo;
    enviar.celular = this.entidadModal.celular;
    enviar.usuario_modificacion = this.entidadClave.usuario;
    enviar.ger_ofi_res_ejecucion_proyecto = this.entidadModal.gerencia;
    this.svcUsuario.cambiarClaveIngreso(enviar,this.stringToken).subscribe(
      data =>{
        this.response = data
        if(this.response._body == 1){
          this.funciones.alertaSimple("success","Se guardó la nueva contraseña","Debe de volver a loguearse al sistema",true);
          this.closeModal();
        }else{
          this.funciones.mensaje("danger",this.funciones.mostrarMensaje("error",""));
        }
      }
    );
  }

  actualizarContraseña(){
    if(this.entidadModal.repetirClave != this.entidadModal.nuevaClave){
      this.funciones.mensaje("warning","Deben de coincidir las contraseñas");
      return;
    }
    let enviar = new Usuario();
    enviar.id_usuario = this.entidadClave.id_usuario;
    enviar.contrasenia = this.entidadModal.nuevaClave;
    enviar.correo_electronico = this.entidadClave.correo_electronico;
    enviar.celular = this.entidadModal.celular;
    enviar.usuario_modificacion = this.entidadClave.usuario;
    this.svcUsuario.cambiarClaveIngreso(enviar,this.stringToken).subscribe(
      data =>{
        this.response = data
        if(this.response._body == 1){
          this.funciones.alertaSimple("success","Se guardó la nueva contraseña","Debe de volver a loguearse al sistema",true);
          this.retornoValores.emit(0);
          this.closeModal();
        }else{
          this.funciones.mensaje("danger",this.funciones.mostrarMensaje("error",""));
        }
      }
    );
  }

}
