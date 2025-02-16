import { Component, OnInit, ViewChild } from '@angular/core';
import { TransferenciasListadoComponent } from './transferencias-listado/transferencias-listado.component';
import { TransferenciasSeleccionComponent } from './transferencias-seleccion/transferencias-seleccion.component';
import { TransferenciaRealizadaRequest } from '../../models/request/transferencia-request';
import { TransferenciaConvenioRequest } from '../../models/request/transferencia-convenio-request';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {
  @ViewChild(TransferenciasSeleccionComponent) cTransferenciasSeleccionComponent: TransferenciasSeleccionComponent;
  @ViewChild(TransferenciasListadoComponent) cTransferenciasListadoComponent: TransferenciasListadoComponent;
  beTrasferenciaRealizadaRequest: TransferenciaRealizadaRequest;
  beConvenioSeleccionarRequest: TransferenciaConvenioRequest;
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    
  }
  listarConvenios(){
    this.beConvenioSeleccionarRequest = new TransferenciaConvenioRequest();
    this.beConvenioSeleccionarRequest.codproy_snip = "";
    this.beConvenioSeleccionarRequest.nombre_proyecto = "";
    this.cTransferenciasSeleccionComponent.listarProyectos(this.beConvenioSeleccionarRequest);
  }
  listarTransferencias(){
    this.beTrasferenciaRealizadaRequest = new TransferenciaRealizadaRequest();
    this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde = "";
    this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta = "";
    this.beTrasferenciaRealizadaRequest.num_filas = 5;
    this.beTrasferenciaRealizadaRequest.num_pagina = 0;
    this.cTransferenciasListadoComponent.listarTransferencias(this.beTrasferenciaRealizadaRequest);
  }
}
