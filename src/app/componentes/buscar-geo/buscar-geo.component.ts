import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { Functions } from '../../appSettings';
import { ModalGeoComponent } from './modal-geo/modal-geo.component';
import { GeoTramoService } from '../../services/geo-tramo.service';
import { GeoTramo } from '../../models/GEO';
import { ModalIframeGeoComponent } from './modal-iframe-geo/modal-iframe-geo.component';

@Component({
  selector: 'app-buscar-geo',
  templateUrl: './buscar-geo.component.html',
  styleUrls: ['./buscar-geo.component.css']
})
export class BuscarGeoComponent implements OnInit {
  totalGeos:number = 0;
  campoBusqueda:string
  bsModalRef: BsModalRef;
  arregloGeos:any = [];
  lstParametros:any;
  response:any;
  config:any;
  paginaActual:number =1;
  constructor(private modalService: BsModalService, private funciones : Functions, private svcGeotramo : GeoTramoService) { }
  
  ngOnInit() {
    this.ListadoPrincipal()
  }

  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    this.svcGeotramo.ListarGEOPaginado(busqueda,skip,take).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response.cantidad != 0){
              this.arregloGeos = this.response.geo_tramo;
              this.totalGeos = this.response.cantidad
            }else{
              this.arregloGeos = [];
              this.totalGeos = 0;
            };
          }else{
            this.arregloGeos = [];
            this.totalGeos = 0;
          }
      }
    )
  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    this.svcGeotramo.ListarGEOPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response.cantidad != 0){
            this.arregloGeos = this.response.geo_tramo;
            this.totalGeos = this.response.cantidad
          }else{
            this.arregloGeos = [];
            this.totalGeos = 0;
          };
        }else{
          this.arregloGeos = [];
          this.totalGeos = 0;
        }
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    this.svcGeotramo.ListarGEOPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response.cantidad != 0){
            this.arregloGeos = this.response.geo_tramo;
            this.totalGeos = this.response.cantidad;
          }else{
            this.arregloGeos = [];
            this.totalGeos = 0;
          }
        }else{
          this.arregloGeos = [];
          this.totalGeos = 0;
        }
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
    let entidadEliminar = new  GeoTramo();
    entidadEliminar.id_geo_tramo = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.svcGeotramo.anularGeoTramo(entidadEliminar).subscribe(
      data => {        
        if(data == true){
            this.funciones.alertaSimple("success","Se eliminó el registro!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento eliminar el registro","",true);
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
    this.bsModalRef = this.modalService.show(ModalGeoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

modalEditarGeoTramo(obj){
  this.config = {
    ignoreBackdropClick: true,
    keyboard: false,
    initialState: {
      entidadEditar: obj
    }
  };
  this.bsModalRef = this.modalService.show(ModalGeoComponent,this.config);
  this.bsModalRef.content.retornoValores.subscribe(
    data => {
      let pagina = {page:this.paginaActual}
      this.cambiarPagina(pagina);
    }
  )
}
modalGeoTramo(codigo){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idGeoTramo: codigo
      }
    };
    this.bsModalRef = this.modalService.show(ModalIframeGeoComponent,this.config);
  }

}
