import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalTramoComponent } from '../modal-tramo/modal-tramo.component';
import { TramoService } from '../../services/tramo.service';
import { Functions } from '../../appSettings/functions';
import { _tramo } from '../../models/Convenio';

@Component({
  selector: 'app-buscar-tramo',
  templateUrl: './buscar-tramo.component.html',
  styleUrls: ['./buscar-tramo.component.css'],
  providers: [Functions]
})
export class BuscarTramoComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalTramo:number =0;
  arregloTramo = [];
  response;
  config;
  paginaActual:number =1;
  constructor(private modalService: BsModalService,private svcTramo:TramoService, private funciones : Functions) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }
  modalEditarTramo(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalTramoComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  modalAgregarTramo(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalTramoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    this.svcTramo.ListarTramoPaginado(busqueda,skip,take).subscribe(
      data =>{
          this.response = data;
          this.arregloTramo = this.response.proyectos;
          this.totalTramo = this.response.cantidad_registro;
      }
    );
  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    this.svcTramo.ListarTramoPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        this.arregloTramo = this.response.proyectos;
        this.totalTramo = this.response.cantidad_registro;
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    this.svcTramo.ListarTramoPaginado(busqueda,skip,take).subscribe(
      data => {
        this.response = data;
        this.arregloTramo = this.response.proyectos;
        this.totalTramo = this.response.cantidad_registro;
      }
    )
  }
  mostrarAlerta(codigo){
    this.funciones.alertaRetorno("danger","Deseas eliminar el siguiente registro?","",true,(respuesta) =>{
      if(respuesta.value){
        this.eliminar(codigo);
      }
    })
  }

  eliminar(codigo){
    let entidadEliminar = new  _tramo();
    entidadEliminar.id_tramo = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.svcTramo.anularTramo(entidadEliminar).subscribe(
      data => {
        
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó correctamente el registro!","",true);
            this.busqueda();
        }else if(data == 2){
          this.funciones.alertaSimple("warning","El registro no se puede eliminar porque tiene fase(s)!","",true);
          this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento de eliminar el registro","",true);
        }
      }
    )
  }
  abrirConsultaSnip(pSnip) {
    window.open("http://ofi4.mef.gob.pe/bp/ConsultarPIP/frmConsultarPIP.asp?accion=consultar&txtCodigo=" + pSnip, '_blank');
  }
}
