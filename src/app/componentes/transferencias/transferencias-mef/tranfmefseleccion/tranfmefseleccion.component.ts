import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TransferenciaConvenioRequest } from 'src/app/models/request/transferencia-convenio-request';
import { FacadeService } from 'src/app/patterns/facade.service';
import { TransferenciaRealizada } from 'src/app/models/response/transferencia-realizada';
import { TranfmefseleccionmodalComponent } from '../tranfmefseleccionmodal/tranfmefseleccionmodal.component';

@Component({
  selector: 'app-tranfmefseleccion',
  templateUrl: './tranfmefseleccion.component.html',
  styleUrls: ['./tranfmefseleccion.component.css']
})
export class TranfmefseleccionComponent implements OnInit {
  @Output() emitEvent:EventEmitter<boolean> = new EventEmitter<boolean>();

  listTransferenciasSeleccion = [];
  numero_Pagina: number = 0;
  paginaActiva: number = 0;
  num_filas: number = 5;
  totalRegistrosProyectos;
  beConvenioSeleccionarRequest: TransferenciaConvenioRequest;
  bsModalRef: BsModalRef;
  activarConfirmacion: boolean = true;
  model_transferencia: TransferenciaRealizada;
  arrProyectosSeleccionados = [];
  arrProyectosSeleccionadosEnvioModal = [];
  mostrarOrdenamiento: boolean = false;
  ordenamiento: string ="";
  constructor(private modalService: BsModalService, private fs: FacadeService) { }

  ngOnInit() {
    this.beConvenioSeleccionarRequest = new TransferenciaConvenioRequest();
    this.beConvenioSeleccionarRequest.codproy_snip = "";
    this.beConvenioSeleccionarRequest.nombre_proyecto = "";
    this.listarProyectos(this.beConvenioSeleccionarRequest);
  }

  
  
  listarProyectos(pbeConvenioSeleccionarRequest: TransferenciaConvenioRequest) {
    this.fs.transferenciaRealizadaService.listarConvenioFaseProyectoMef(pbeConvenioSeleccionarRequest.codproy_snip.toString(),pbeConvenioSeleccionarRequest.nombre_proyecto).subscribe(
      respuesta => {
        let transferenciaReturn;
        transferenciaReturn = respuesta as any;
        if (transferenciaReturn.length == 0) {
          this.listTransferenciasSeleccion = [];
        } else {
          this.listTransferenciasSeleccion = transferenciaReturn;
          this.ordenarConveniosSeleccion(this.ordenamiento);
          this.asignarEstadoListadoConvenios(this.listTransferenciasSeleccion);
        }
      }
    );
  }

  asignarEstadoListadoConvenios(pListadoConvenios) {
    if (pListadoConvenios != null) {
      for (let i = 0; i < pListadoConvenios.length; i++) {
        if (this.arrProyectosSeleccionados != null) {
          if (this.arrProyectosSeleccionados.indexOf(pListadoConvenios[i].id_convenio) != -1) {
            this.listTransferenciasSeleccion[i].Estado = true;
          } else {
            this.listTransferenciasSeleccion[i].Estado = false;
          }
        } else {
          this.listTransferenciasSeleccion[i].Estado = false;
        }
      }
    }
  }
  ordenarConveniosSeleccion(pFiltro) {
    this.ordenamiento = pFiltro;
    if (pFiltro == "ascendente") {
      this.mostrarOrdenamiento = true;
      this.transform(this.listTransferenciasSeleccion,"cod_snip",pFiltro);
    } else {
      this.mostrarOrdenamiento = false;
      this.transform(this.listTransferenciasSeleccion,"cod_snip",pFiltro);
    }
  }

  transform(array: Array<string>, args: string, orden: string): Array<string> {
    array.sort((a: any, b: any) => {
	    if ( a[args] < b[args] ){
	    	return (orden == "ascendente" ? -1 : 1); // -1
	    }else if( a[args] > b[args] ){
        return (orden == "ascendente" ? 1 : -1); // 1
	    }else{
	    	return 0;	
	    }
    });
    return array;
  }


  ConsultarConveniosSeleccionar(modelConvenioRequest) {
    this.listarProyectos(modelConvenioRequest);
  }
  idTransferencia: number;
  config;
  opnModConfirmarTransferencia() {
    this.model_transferencia = new TransferenciaRealizada();
    this.model_transferencia.id_transferencia = 0;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class:'modal-detalle-transferencia',
      initialState: {
        modelTransferencia: this.model_transferencia, arrProyectosSeleccionadosEnvioModal: this.arrProyectosSeleccionadosEnvioModal
        , activarTransferencia: false,arrArchivosCargados: []
      }
    };

    this.bsModalRef = this.modalService.show(TranfmefseleccionmodalComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.arrProyectosSeleccionados = [];
        this.arrProyectosSeleccionadosEnvioModal = [];
        this.activarConfirmacion =true;
        this.listarProyectos(this.beConvenioSeleccionarRequest);
        this.asignarEstadoListadoConvenios(this.listTransferenciasSeleccion);  
        this.emitEvent.emit(true);
      }
    )
  }
  seleccionProyecto(estado: any, index, pIdConvenio) {
    if (this.arrProyectosSeleccionados != null) {
      if (estado.target.checked) {
        this.arrProyectosSeleccionados.push(pIdConvenio);
        this.arrProyectosSeleccionadosEnvioModal.push({
          "cod_unificado": this.listTransferenciasSeleccion[index].cod_unificado
          , "cod_snip": this.listTransferenciasSeleccion[index].cod_snip
          , "nombre_proyecto": this.listTransferenciasSeleccion[index].nombre_proyecto
          , "id_convenio": this.listTransferenciasSeleccion[index].id_convenio
          , "fuente_financiamiento_convenio": this.listTransferenciasSeleccion[index].fuente_financiamiento_convenio
          , "unidad_ejecutora": this.listTransferenciasSeleccion[index].unidad_ejecutora
          , "monto": this.listTransferenciasSeleccion[index].monto
          , "id_fuente_financiamiento_transferencia": this.listTransferenciasSeleccion[index].id_fuente_financiamiento_convenio
          , "monto_transferido": this.listTransferenciasSeleccion[index].monto
        });
      } else {
        if (this.arrProyectosSeleccionados != null && this.arrProyectosSeleccionados != undefined) {
          for (let i = 0; i < this.arrProyectosSeleccionados.length; i++) {
            if (this.arrProyectosSeleccionados[i] == pIdConvenio) { //this.listTransferenciasSeleccion[index]
              this.arrProyectosSeleccionados.splice(i, 1);
              this.arrProyectosSeleccionadosEnvioModal.splice(i, 1);
            }
          }
        }
      }
      this.asignarEstadoListadoConvenios(this.listTransferenciasSeleccion);
      if (this.arrProyectosSeleccionados != null) {
        if (this.arrProyectosSeleccionados.length > 0) {
          this.activarConfirmacion = false;
        } else {
          this.activarConfirmacion = true;
        }
      } else {
        this.activarConfirmacion = true;
      }
    }
  }


  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.num_filas);
    //this.beConvenioSeleccionarRequest.num_pagina = this.paginaActiva;
    this.listarProyectos(this.beConvenioSeleccionarRequest);
  }

}
