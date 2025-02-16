import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UsuarioModal, Usuario } from '../../models/Usuario';
import { Functions } from '../../appSettings/functions';
import { FacadeService } from '../../patterns/facade.service';


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
  providers: [Functions]
})
export class ModalUsuarioComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : UsuarioModal;
  entidadEditar;
  areas;
  cambiarEditar:boolean = true;
  //deshabilitar

  constructor(public modalRef: BsModalRef,private fs: FacadeService, public funciones: Functions) { }

  ngOnInit() {
    this.entidadModal = new UsuarioModal();
    this.listarArea();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
  }
  administrarTramo(){
    if(this.entidadEditar==null){
      this.guardarUsuario();
    }else{
      this.editarUsuario();
    }
  }
  setearCamposEditar(){
    this.entidadModal.usuario = this.entidadEditar.usuario;
    this.entidadModal.nombre = this.entidadEditar.nombre_usuario;
    this.entidadModal.correo = this.entidadEditar.correo_electronico;
    this.entidadModal.celular = this.entidadEditar.celular;
    this.entidadModal.dni = this.entidadEditar.dni_usuario;
    this.entidadModal.codArea = this.entidadEditar.id_area == 0 ? null: this.entidadEditar.id_area;    
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  listarArea() {
    this.fs.maestraService.listarArea().subscribe(
      data => {
        this.areas = data;
      }
    ) 
  }
  editarUsuario(){
      if(this.entidadModal.nombre == null || this.entidadModal.nombre == ""){
        this.funciones.mensaje("warning","Debe de ingresar un nombre");
        return;
      }   
    let entidadEditar = new Usuario();
    entidadEditar.id_usuario = this.entidadEditar.id_usuario;
    entidadEditar.nombre_usuario = this.entidadModal.nombre;
    entidadEditar.usuario = this.entidadModal.usuario;
    entidadEditar.celular = this.entidadModal.celular;
    entidadEditar.correo_electronico = this.entidadModal.correo;
    entidadEditar.dni_usuario = this.entidadModal.dni;
    entidadEditar.id_area = this.entidadModal.codArea == null ? null : this.entidadModal.codArea;
    entidadEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.fs.usuarioService.editarUsuario(entidadEditar).subscribe(
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
  guardarUsuario(){
      if(this.entidadModal.nombre == null || this.entidadModal.nombre == ""){
        this.funciones.mensaje("warning","Debe de ingresar un nombre");
        return;
      }   
    let entidadRegistrar = new Usuario();
    entidadRegistrar.id_usuario = 0;
    entidadRegistrar.nombre_usuario = this.entidadModal.nombre;
    entidadRegistrar.usuario = this.entidadModal.usuario;
    entidadRegistrar.contrasenia = this.entidadModal.usuario;
    entidadRegistrar.celular = this.entidadModal.celular;
    entidadRegistrar.correo_electronico = this.entidadModal.correo;
    entidadRegistrar.dni_usuario = this.entidadModal.dni;
    entidadRegistrar.id_area = this.entidadModal.codArea == null || this.entidadModal.codArea == undefined ? null : this.entidadModal.codArea;
    entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    let existe;
    this.fs.usuarioService.ObtenerUsuario(this.entidadModal.usuario).subscribe(
      data=>{
        existe = data;
        if(existe == ""){
          this.fs.usuarioService.registrarUsuario(entidadRegistrar).subscribe(
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
          );
        }else{
          this.funciones.mensaje("warning","El usuario ya existe");
        }
      }
    )
    
  }

}
