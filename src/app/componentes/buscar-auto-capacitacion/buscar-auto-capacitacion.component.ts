import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';
import { BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { Functions } from '../../appSettings/functions';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalCapacitacionComponent } from '../buscar-auto-capacitacion/modal-capacitacion/modal-capacitacion.component';
import { Capacitacion } from '../../models/Capacitacion';

@Component({
  selector: 'app-buscar-auto-capacitacion',
  templateUrl: './buscar-auto-capacitacion.component.html',
  styleUrls: ['./buscar-auto-capacitacion.component.css']
})
export class BuscarAutoCapacitacionComponent implements OnInit {
  campoBusqueda:string
  paginaActual:number =1;

  totalCapacitaciones:number=0;
  totalCapacitacion:number =0;
  arregloAutocapacitacion = [];

  config;
  bsModalRef: BsModalRef;

  paginaActiva: number = 10;
  numPaginasMostrar: number = 0;
  tipoCapacitacion : number=0;

  listaCapacitacionVideos;
  listaDetalleCapacitacion;

  constructor(
    private fs: FacadeService,
    private modalService: BsModalService,
     private funciones : Functions
  ) { }

  ngOnInit() {
    this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
  }

  listaCapacitacion(id,pNumPagina,pNumFilas){
    this.fs.autoCapacitacionService.listarCapacitacion(id,pNumPagina,pNumFilas).subscribe(
      data=>{
        this.listaCapacitacionVideos=data;
        this.listaDetalleCapacitacion=data[0].capacitacion;
        this.totalCapacitaciones=data[0].cantidad;
      }
    )
  }


 

  eliminarCapacitacion(idCapacitacion){
    this.funciones.alertaRetorno("question","Deseas eliminar el siguiente registro?","",true,(respuesta) =>{
      if(respuesta.value){
        this.eliminar(idCapacitacion);
      }
    })
  }

  eliminar(idCapacitacion){
    let entidadEliminar = new Capacitacion();
    entidadEliminar.id_capacitacion= idCapacitacion;
    entidadEliminar.usuario_eliminacion= sessionStorage.getItem("Usuario");
    this.fs.autoCapacitacionService.anularCapacitacion(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó la capacitación!","",true);
            let pagina = {page:this.paginaActual}
            this.cambiarPagina(pagina);
            //this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento eliminar la capacitación","",true);
        }
      }
    )
  }

  busqueda(){

  }

  modalAgregarCapacitacion(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalCapacitacionComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
        //this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
      }
    )

  }

  modalEditarCapacitacion(capacitacion){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: capacitacion
      }
    };
    this.bsModalRef = this.modalService.show(ModalCapacitacionComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
        //this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
      }
    )

  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    this.listaCapacitacion(this.tipoCapacitacion,skip,take);
  }

}
