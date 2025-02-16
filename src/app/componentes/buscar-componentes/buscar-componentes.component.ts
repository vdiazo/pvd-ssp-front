import { Component, OnInit } from '@angular/core';
import { BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { ComponenteService } from '../../services/componente.service';
import { ModalComponentesComponent } from './modal-componentes/modal-componentes.component';
import { Componente } from '../../models/Componente';

@Component({
  selector: 'app-buscar-componentes',
  templateUrl: './buscar-componentes.component.html',
  styleUrls: ['./buscar-componentes.component.css']
})
export class BuscarComponentesComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalComponentes:number =0;
  arregloComponente = [];
  lstParametros;
  response;
  config;
  paginaActual:number =1;
  constructor(private modalService: BsModalService, private funciones : Functions, private svcComponente : ComponenteService) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    this.svcComponente.ListarComponentePaginado(busqueda,skip,take).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response[0].cantidad_componentes != 0){
              this.arregloComponente = this.response[0].componentes;
              this.totalComponentes = this.response[0].cantidad_componentes
            }else{
              this.arregloComponente = [];
              this.totalComponentes = 0;
            };
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          }
      }
    )
  }
  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    this.svcComponente.ListarComponentePaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response[0].cantidad_perfiles != 0){
            this.arregloComponente = this.response[0].componentes;
            this.totalComponentes = this.response[0].cantidad_componentes
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          };
        }else{
          this.arregloComponente = [];
          this.totalComponentes = 0;
        }
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    this.svcComponente.ListarComponentePaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;        
        if(this.response != ""){
          if(this.response[0].cantidad_componentes != 0){
            this.arregloComponente = this.response[0].componentes;
            this.totalComponentes = this.response[0].cantidad_componentes;
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          }
        }else{
          this.arregloComponente = [];
          this.totalComponentes = 0;
        }
      }
    )
  }
  // modalAgregarMenuPadre(objpadre){
  //   this.config = {
  //     ignoreBackdropClick: true,
  //     keyboard: false,
  //     initialState: {
  //       entidadEditar: null,
  //       entidadPadre:objpadre
  //     }
  //   };
  //   // this.bsModalRef = this.modalService.show(ModalPerfilesComponent, this.config);
  //   // this.bsModalRef.content.retornoValores.subscribe(
  //   //   data => {
  //   //     let pagina = {page:this.paginaActual}
  //   //     this.cambiarPagina(pagina);
  //   //   }
  //   // )
  // }

  modalEditarComponente(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalComponentesComponent,this.config);
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
    let entidadEliminar = new  Componente();
    entidadEliminar.id_componente = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcComponente.anularComponente(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó el componente!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento eliminar el componente","",true);
        }
      }
    )
  }
  modalAgregarComponente(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalComponentesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
}
