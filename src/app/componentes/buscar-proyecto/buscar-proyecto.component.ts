import { Component, OnInit,Inject} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BuscarProyectoModalComponent } from '../buscar-proyecto-modal/buscar-proyecto-modal.component';
import { ConvenioService } from '../../services/convenio.service';
import { Busqueda, _convenio } from '../../models/Convenio';
import { EditarConvenioComponent } from '../editar-convenio/editar-convenio.component';
import { Functions } from '../../appSettings/functions';
import { AuthService } from '../auth/auth.service';
import { FacadeService } from '../../patterns/facade.service';
import { IConvenioListado, IConvenioData } from 'src/app/Interfaces';


@Component({
  selector: 'app-buscar-proyecto',
  templateUrl: './buscar-proyecto.component.html',
  styleUrls: ['./buscar-proyecto.component.css'],
  providers: [Functions]
})
export class BuscarProyectoComponent implements OnInit {
  bsModalRef: BsModalRef;
  bsModalEditar : BsModalRef;
  entidadBusqueda: Busqueda;
  ListaFases;
  ListaDispositivoTransferencia;
  arregloConvenio;
  totalConvenio;
  config;
  numIdfase:number;
  numIdTransferencia:number;
  strSiglas:string;
  strTramo:string;
  strProyecto:string;
  numcodProyecto:number;
  numcodSnip:number;
  paginaActual:number = 1;
  constructor(private modalService: BsModalService,
              private fs: FacadeService,
              public funciones : Functions) {}

  ngOnInit() {
    this.listarFases();
    this.listardispositivoTransferencia();
    this.listarConevioPaginado();
  }

  listarConevioPaginado() {
    this.fs.convenioService.ListarConvenios(0,0,"","",0,0,"",10,0).subscribe(
      data => {
        this.arregloConvenio = data[0].convenios;
        this.totalConvenio = data[0].cantidad_registro;
        this.arregloConvenio.forEach(element => {
          element.fecha_firma = this.funciones.formatDate(element.fecha_firma);
          element.fecha_vigencia = this.funciones.formatDate(element.fecha_vigencia);
        });
      }
    ) 
  }

  listarFases() {
    this.fs.maestraService.listarTipoFases().subscribe(
      data => {
        this.ListaFases = data;
      }
    ) 
  }

  listardispositivoTransferencia() {
    this.fs.maestraService.listarDispositivoTransferencia().subscribe(
      data => {
        this.ListaDispositivoTransferencia = data;
      }
    )
  }

  busqueda(){
    this.paginaActual = 1;
    this.entidadBusqueda = new Busqueda();
    this.entidadBusqueda.cod_Snip = this.numcodSnip == null || this.numcodSnip.toString() == "" ? 0 : this.numcodSnip;
    this.entidadBusqueda.cod_Proyecto = this.numcodProyecto == null || this.numcodProyecto.toString() == "" ? 0 : this.numcodProyecto;
    this.entidadBusqueda.proyecto = this.strProyecto == null ? "" :this.strProyecto;
    this.entidadBusqueda.tramo = this.strTramo == null ? "" : this.strTramo;
    this.entidadBusqueda.siglas = this.strSiglas == null ? "" : this.strSiglas;
    this.entidadBusqueda.id_fase = this.numIdfase == null || this.numIdfase.toString() == "" ? 0 : this.numIdfase;
    this.entidadBusqueda.id_transferencia = this.numIdTransferencia == null || this.numIdTransferencia.toString() == "" ? 0 : this.numIdTransferencia;
    let skip = 10;
    let take = 0;
    this.fs.convenioService.ListarConvenios(this.entidadBusqueda.cod_Snip,
                this.entidadBusqueda.cod_Proyecto,this.entidadBusqueda.proyecto,
                this.entidadBusqueda.tramo, this.entidadBusqueda.id_fase,this.entidadBusqueda.id_transferencia,
                this.entidadBusqueda.siglas,10,0).subscribe(
      data => {
        this.arregloConvenio = data[0].convenios;
        this.totalConvenio = data[0].cantidad_registro;
        
        this.arregloConvenio.forEach(element => {
          element.fecha_firma = this.funciones.formatDate(element.fecha_firma);
          element.fecha_vigencia = this.funciones.formatDate(element.fecha_vigencia);          
        });
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
    let entidadEliminar = new  _convenio();
    entidadEliminar.id_convenio = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.fs.convenioService.eliminarConvenioSosem(entidadEliminar).subscribe(
      data => {
        if(data == 1){
            this.funciones.alertaSimple("success","Se eliminó correctamente el registro!","",true);
            this.busqueda();
        }else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento de eliminar el registro","",true);
        }
      }
    )
  }
  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    this.entidadBusqueda = new Busqueda();
    this.entidadBusqueda.cod_Snip = this.numcodSnip == null || this.numcodSnip.toString() == "" ? 0 : this.numcodSnip;
    this.entidadBusqueda.cod_Proyecto = this.numcodProyecto == null || this.numcodProyecto.toString() == "" ? 0 : this.numcodProyecto;
    this.entidadBusqueda.proyecto = this.strProyecto == null ? "" :this.strProyecto;
    this.entidadBusqueda.tramo = this.strTramo == null ? "" : this.strTramo;
    this.entidadBusqueda.siglas = this.strSiglas == null ? "" : this.strSiglas;
    this.entidadBusqueda.id_fase = this.numIdfase == null || this.numIdfase.toString() == "" ? 0 : this.numIdfase;
    this.entidadBusqueda.id_transferencia = this.numIdTransferencia == null || this.numIdTransferencia.toString() == "" ? 0 : this.numIdTransferencia;
    let skip = 10;
    let take = (pagina.page * 10) - 10;;
    this.fs.convenioService.ListarConvenios(this.entidadBusqueda.cod_Snip,
                this.entidadBusqueda.cod_Proyecto,this.entidadBusqueda.proyecto,
                this.entidadBusqueda.tramo, this.entidadBusqueda.id_fase,
                this.entidadBusqueda.id_transferencia,
                this.entidadBusqueda.siglas,skip,take).subscribe(
      data => {
        this.arregloConvenio = data[0].convenios;
        this.totalConvenio = data[0].cantidad_registro;
        this.arregloConvenio.forEach(element => {
          element.fecha_firma = this.funciones.formatDate(element.fecha_firma);
          element.fecha_vigencia = this.funciones.formatDate(element.fecha_vigencia);
        });
      }
    )
  }

  mostrarConvenio(obj){

    let entidad: IConvenioData = Object.assign({}, obj);
    
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: entidad
      }
    };
    //this.bsModalEditar = this.modalService.show(EditarConvenioComponent,this.config);
    this.bsModalEditar = this.modalService.show(BuscarProyectoModalComponent,this.config);
    this.bsModalEditar.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
  
  openModal2(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      entidadEditar: null
    };
    this.bsModalRef = this.modalService.show(BuscarProyectoModalComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
}