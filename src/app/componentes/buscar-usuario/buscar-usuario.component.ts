import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css'],
  providers: [Functions]
})
export class BuscarUsuarioComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalUsuario:number =0;
  arregloUsuario = [];
  response;
  config;
  paginaActual:number =1;
  constructor(private modalService: BsModalService, private svcUsuario : UsuarioService, private funciones : Functions) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.svcUsuario.ListarUsuarioPaginado(busqueda,usuario,perfil,skip,take).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response.cantidad_registro != 0){
              this.arregloUsuario = this.response.data;
              this.totalUsuario = this.response.cantidad_registro
            }else{
              this.arregloUsuario = [];
              this.totalUsuario = 0;
            };
          }else{
            this.arregloUsuario = [];
            this.totalUsuario = 0;
          }
      }
    );
  }

  estado(evento,objActivar){
    let envioActivar = new Usuario();
    envioActivar.estado = evento;
    envioActivar.id_usuario = objActivar.id_usuario;
    envioActivar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.cambiarEstado(envioActivar).subscribe(
      data =>{
        if(data == 1){
          if(evento){
            this.funciones.alertaSimple("success","Se habilitó al usuario!","",true);
          }else{
            this.funciones.alertaSimple("success","Se deshabilitó al usuario!","",true);
          }
          
          this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un problema al deshabilitar al usuario","",true);
        }
      }
    );
  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.svcUsuario.ListarUsuarioPaginado(busqueda,usuario,perfil,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response.cantidad_registro != 0){
            this.arregloUsuario = this.response.data;
            this.totalUsuario = this.response.cantidad_registro
          }else{
            this.arregloUsuario = [];
            this.totalUsuario = 0;
          };
        }else{
          this.arregloUsuario = [];
          this.totalUsuario = 0;
        }
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.svcUsuario.ListarUsuarioPaginado(busqueda,usuario,perfil,skip,take).subscribe(
      data => {
        this.response = data;        
        if(this.response != ""){
          if(this.response.cantidad_registro != 0){
            this.arregloUsuario = this.response.data;
            this.totalUsuario = this.response.cantidad_registro;
          }else{
            this.arregloUsuario = [];
            this.totalUsuario = 0;
          }
        }else{
          this.arregloUsuario = [];
          this.totalUsuario = 0;
        }
      }
    )
  }

  modalEditarUsuario(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalUsuarioComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  consultaResetear(entidad){
    this.funciones.alertaRetorno("question","Deseas restablecer la contraseña?","",true,(respuesta) =>{
      if(respuesta.value){
        this.resetarClave(entidad);
      }
    })
  }
  mostrarAlerta(codigo){
    this.funciones.alertaRetorno("question","Deseas eliminar el siguiente registro?","",true,(respuesta) =>{
      if(respuesta.value){
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo){
    let entidadEliminar = new  Usuario();
    entidadEliminar.id_usuario = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.anularUsuario(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se deshabilitó al usuario!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento deshabilitar al usuario","",true);
        }
      }
    )
  }
  resetarClave(entidad){
      let envio = new Usuario();
      envio.id_usuario = entidad.id_usuario;
      envio.usuario = entidad.usuario;
      envio.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.svcUsuario.restablecerClave(envio).subscribe(
        data=>{
          if(data == 1){
            this.funciones.alertaSimple("success","Se restablecio la contraseña correctamente!","",true);
            this.busqueda();
          }
          else{
              this.funciones.alertaSimple("error","Ocurrio un error al momento de restablecer la contraseña","",true);
          }
        }
      );
  }
  modalAgregarUsuario(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalUsuarioComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
}
