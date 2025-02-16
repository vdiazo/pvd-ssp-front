import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PerfilesService } from '../../../services/perfiles.service';
import { Functions } from '../../../appSettings/functions';
import { ModalAgregarComponenteComponent } from './modal-agregar-componente/modal-agregar-componente.component';
import { AsignacionComponente } from '../../../models/Perfil';
@Component({
  selector: 'app-modal-asignar-menu-componente',
  templateUrl: './modal-asignar-menu-componente.component.html',
  styleUrls: ['./modal-asignar-menu-componente.component.css']
})
export class ModalAsignarMenuComponenteComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  idPerfil:number;
  bsModalRef: BsModalRef;
  menuDetalles:any;
  totalDetalleComponente:number =0;
  arregloDetalleComponente:any = [];
  paginaActual:number =1;
  campoBusqueda:number;
  response:any;
  config:any;
  mostrarRegistrar:boolean = true;
  //campos de busqueda
  paginas:any;
  modulos:any;
  seccion:any;
  nombreComponentes:any;
  constructor(private modalService: BsModalService,public modalRef: BsModalRef, private svcPerfiles : PerfilesService, private funciones: Functions) { }

  ngOnInit() {
    this.listarMenus();
  }
  listarMenus() {
    this.svcPerfiles.ListarDetalleMenuCombo(this.idPerfil).subscribe(
      data => {
        this.menuDetalles = data;
      }
    ) 
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  habilitar(evento){
    if(evento == null || evento == undefined){
      this.mostrarRegistrar = true;
      this.paginas = null;
      this.modulos = null;
      this.nombreComponentes = null;
      this.seccion = null;
    }else{
      this.mostrarRegistrar = false;
      this.BusquedaDetalleComponente();
    }
  }
  BusquedaDetalleComponente(){
    this.paginaActual = 1;
    let pagina = this.paginas == null ? "" : this.paginas;
    let secciones =  this.seccion == null ? "" : this.seccion;
    let modulo = this.modulos == null ? "" : this.modulos;
    let componente = this.nombreComponentes == null ? "" : this.nombreComponentes;
    let skip = 5;
    let take = 0;
    this.svcPerfiles.ListarDetalleComponentePaginado(this.campoBusqueda,pagina,secciones,modulo,componente,skip,take).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response[0].cantidad_detalle != 0){
              this.arregloDetalleComponente = this.response[0].detalle_perfil_menu_componente;
              this.totalDetalleComponente = this.response[0].cantidad_detalle
            }else{
              this.arregloDetalleComponente = [];
              this.totalDetalleComponente = 0;
            };
          }else{
            this.arregloDetalleComponente = [];
            this.totalDetalleComponente = 0;
          }
      }
    )
  }
  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let pag = this.paginas == null ? "" : this.paginas;
    let secciones =  this.seccion == null ? "" : this.seccion;
    let modulo = this.modulos == null ? "" : this.modulos;
    let componente = this.nombreComponentes == null ? "" : this.nombreComponentes;
    let skip = 5;
    let take = (pagina.page * 5) - 5;
    this.svcPerfiles.ListarDetalleComponentePaginado(this.campoBusqueda,pag,secciones,modulo,componente,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response[0].cantidad_detalle != 0){
            this.arregloDetalleComponente = this.response[0].detalle_perfil_menu_componente;
            this.totalDetalleComponente = this.response[0].cantidad_detalle
          }else{
            this.arregloDetalleComponente = [];
            this.totalDetalleComponente = 0;
          };
        }else{
          this.arregloDetalleComponente = [];
          this.totalDetalleComponente = 0;
        }
      }
    )
  }
  modalAgregarMenuComponente(idDetallePerfilMenu){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idDetallePerfilMenu:idDetallePerfilMenu
      }
    };
    this.bsModalRef = this.modalService.show(ModalAgregarComponenteComponent, this.config);
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
    let entidadEliminar = new  AsignacionComponente();
    entidadEliminar.id_detalle_perfil_menu_componente = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcPerfiles.anularDetalleComponente(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó el registro!","",true);
            this.BusquedaDetalleComponente();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento eliminar el registro","",true);
        }
      }
    )
  }

  estado(evento,objActivar){
    let envioActivar = new AsignacionComponente();
    envioActivar.visible = evento;
    envioActivar.id_detalle_perfil_menu_componente = objActivar.id_detalle_perfil_menu_componente;
    envioActivar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcPerfiles.modificarDetalleComponente(envioActivar).subscribe(
      data =>{
        if(data == 1){
          if(evento){
            this.funciones.alertaSimple("success","Se habilitó el componente!","",true);
          }else{
            this.funciones.alertaSimple("success","Se deshabilitó el componente!","",true);
          }
          
          this.BusquedaDetalleComponente();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un problema al deshabilitar el componente","",true);
        }
      }
    );
  }

}
