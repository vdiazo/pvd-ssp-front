import { Component, OnInit, ViewChild } from '@angular/core';
import { TranfmefseleccionComponent } from './tranfmefseleccion/tranfmefseleccion.component';
import { TranfmefrecursosComponent } from './tranfmefrecursos/tranfmefrecursos.component';
import { TransferenciaRealizadaRequest } from 'src/app/models/request/transferencia-request';
import { TransferenciaConvenioRequest } from 'src/app/models/request/transferencia-convenio-request';

@Component({
  selector: 'app-transferencias-mef',
  templateUrl: './transferencias-mef.component.html',
  styleUrls: ['./transferencias-mef.component.css']
})
export class TransferenciasMefComponent implements OnInit {
  @ViewChild("seleccion") seleccion:TranfmefseleccionComponent;
  @ViewChild("lista") lista:TranfmefrecursosComponent;
  constructor() { }

  ngOnInit() {

  }
  listarConvenios(){
    let beConvenioSeleccionarRequest:TransferenciaConvenioRequest = new TransferenciaConvenioRequest();
    beConvenioSeleccionarRequest.codproy_snip = "";
    beConvenioSeleccionarRequest.nombre_proyecto = "";
    this.seleccion.listarProyectos(beConvenioSeleccionarRequest);
  } 

  listarTransferencias(){
    let beTrasferenciaRealizadaRequest:TransferenciaRealizadaRequest = new TransferenciaRealizadaRequest();
    beTrasferenciaRealizadaRequest.fecha_publicacion_desde = "";
    beTrasferenciaRealizadaRequest.fecha_publicacion_hasta = "";
    beTrasferenciaRealizadaRequest.num_filas = 5;
    beTrasferenciaRealizadaRequest.num_pagina = 0;
    this.lista.listarTransferencias(beTrasferenciaRealizadaRequest);

  } 
}
