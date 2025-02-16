import { Component, OnInit } from '@angular/core';
import { UsuarioPerfil,UsuarioClaveModal,Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Functions } from '../../appSettings/functions';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [Functions]
})
export class PerfilComponent implements OnInit {
entidadBusqueda;
entidad:UsuarioPerfil;
entidadClave : UsuarioClaveModal;
idusuario;
usuario;
response;
desGerencia:boolean = true;
  constructor(private svcUsuario : UsuarioService, public funciones : Functions) { }

  ngOnInit() {
    this.entidad = new UsuarioPerfil();
    this.entidadClave = new UsuarioClaveModal();
    this.mostrarDatos();
    if(sessionStorage.getItem("Nombre_Perfil") == "RESPONSABLE"){
      this.desGerencia = false;
    }
  }
  administrarClave(){
    this.actualizarContraseña();
  }
  mostrarDatos(){
    let usuario = sessionStorage.getItem("Usuario");
    this.svcUsuario.ObtenerUsuario(usuario).subscribe(
      data=>{
        this.entidadBusqueda = data[0]
        this.entidad = new UsuarioPerfil();
        this.entidad.nombreUsuario = this.entidadBusqueda.nombre_usuario;
        this.entidad.municipalidad = this.entidadBusqueda.nombre_municipalidad;
        this.entidad.dni = this.entidadBusqueda.dni_usuario;
        this.entidad.correo = this.entidadBusqueda.correo_electronico;
        this.entidad.celular = this.entidadBusqueda.celular;
        this.entidad.gerencia = this.entidadBusqueda.ger_ofi_res_ejecucion_proyecto;
        this.idusuario = this.entidadBusqueda.id_usuario
        this.usuario = this.entidadBusqueda.usuario;
      }
    );
  }
  preguntarCambios(){
    this.funciones.alertaRetorno("question","Deseas guardar los cambios","",true,(respuesta)=>{
      if(respuesta.value){
        this.actualizarDatos();
      }
    });
  }
  actualizarDatos(){
    let entidadEditar = new Usuario();
    entidadEditar.id_usuario = this.entidadBusqueda.id_usuario;
    entidadEditar.nombre_usuario = this.entidad.nombreUsuario;
    entidadEditar.usuario = this.entidadBusqueda.usuario;
    entidadEditar.celular = this.entidad.celular;
    entidadEditar.correo_electronico = this.entidad.correo;
    entidadEditar.dni_usuario = this.entidadBusqueda.dni_usuario;
    entidadEditar.ger_ofi_res_ejecucion_proyecto = this.entidad.gerencia == null ? "":this.entidad.gerencia;
    entidadEditar.id_area = this.entidadBusqueda.id_area == 0 ? null : this.entidadBusqueda.id_area;
    entidadEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.editarUsuario(entidadEditar).subscribe(
      data=>{
        if(data == 0){
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
        else{
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("actualizar",""));
        }
      }
    );
  }

  actualizarContraseña(){
    if(this.entidadClave.repetirClave != this.entidadClave.nuevaClave){
      this.funciones.mensaje("warning","Deben de coincidir las contraseñas");
      return;
    }
    let enviar = new Usuario();
    enviar.id_usuario = this.idusuario;
    enviar.nombre_usuario=this.entidad.nombreUsuario;
    enviar.contrasenia = this.entidadClave.nuevaClave;
    enviar.correo_electronico = this.entidad.correo;
    enviar.celular = this.entidad.celular;
    enviar.usuario_modificacion = this.usuario;
    let token = sessionStorage.getItem("token");
    this.svcUsuario.cambiarClaveIngreso(enviar,token).subscribe(
      data =>{
        this.response = data
        if(this.response._body == 1){
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("actualizar",""));
        }else{
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
      }
    );
  }

}
