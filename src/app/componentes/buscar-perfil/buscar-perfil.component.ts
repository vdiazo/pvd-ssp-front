import { Component, OnInit } from '@angular/core';
import { BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { Perfiles } from '../../models/Perfil';
import { ModalPerfilesComponent } from './modal-perfiles/modal-perfiles.component';
import { PerfilesService } from '../../services/perfiles.service';
import { ModalAsignarMenuComponent } from './modal-asignar-menu/modal-asignar-menu.component';
import { ModalAsignarMenuComponenteComponent } from './modal-asignar-menu-componente/modal-asignar-menu-componente.component';
import { ModalPerfilHijosComponent } from './modal-perfil-hijos/modal-perfil-hijos.component';

@Component({
  selector: 'app-buscar-perfil',
  templateUrl: './buscar-perfil.component.html',
  styleUrls: ['./buscar-perfil.component.css']
})
export class BuscarPerfilComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalPerfiles:number =0;
  arregloPerfil:any = [];
  lstParametros:any;
  response:any;
  config:any;
  paginaActual:number =1;
  constructor(private modalService: BsModalService, private funciones : Functions, private svcPerfiles : PerfilesService) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    this.svcPerfiles.ListarPerfilesPaginado(busqueda,skip,take).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response.cantidad_perfiles != 0){
              this.arregloPerfil = this.response.perfiles;
              this.totalPerfiles = this.response.cantidad_perfiles
            }else{
              this.arregloPerfil = [];
              this.totalPerfiles = 0;
            };
          }else{
            this.arregloPerfil = [];
            this.totalPerfiles = 0;
          }
      }
    )
  }
  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    this.svcPerfiles.ListarPerfilesPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response.cantidad_perfiles != 0){
            this.arregloPerfil = this.response.perfiles;
            this.totalPerfiles = this.response.cantidad_perfiles
          }else{
            this.arregloPerfil = [];
            this.totalPerfiles = 0;
          };
        }else{
          this.arregloPerfil = [];
          this.totalPerfiles = 0;
        }
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    this.svcPerfiles.ListarPerfilesPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;        
        if(this.response != ""){
          if(this.response.cantidad_perfiles != 0){
            this.arregloPerfil = this.response.perfiles;
            this.totalPerfiles = this.response.cantidad_perfiles;
          }else{
            this.arregloPerfil = [];
            this.totalPerfiles = 0;
          }
        }else{
          this.arregloPerfil = [];
          this.totalPerfiles = 0;
        }
      }
    )
  }
  modalAsignacionMenu(idPerfil){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idPerfil:idPerfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalAsignarMenuComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

  modalAsignacionComponente(idPerfil){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idPerfil:idPerfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalAsignarMenuComponenteComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

  modalEditarPerfil(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalPerfilesComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  mostrarAlerta(codigo){
    this.funciones.alertaRetorno("question","Deseas eliminar el siguiente registro?","",true,(respuesta) =>{
      if(respuesta.value){
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo){
    let entidadEliminar = new  Perfiles();
    entidadEliminar.id_perfil = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcPerfiles.anularPerfil(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó el perfil!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento eliminar el perfil","",true);
        }
      }
    )
  }
  modalAgregarPerfil(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalPerfilesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  modalAsignacionHijo(nombrePerfil:string,idPerfil:number){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idPerfilPadre:idPerfil,
        PerfilPadre:nombrePerfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalPerfilHijosComponent, this.config);
  }
}
