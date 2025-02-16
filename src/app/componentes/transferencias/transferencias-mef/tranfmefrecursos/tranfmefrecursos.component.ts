import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TransferenciaRealizadaRequest } from 'src/app/models/request/transferencia-request';
import { FacadeService } from 'src/app/patterns/facade.service';
import { Functions, ExcelService } from 'src/app/appSettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranfmefseleccionmodalComponent } from '../tranfmefseleccionmodal/tranfmefseleccionmodal.component';

@Component({
  selector: 'app-tranfmefrecursos',
  templateUrl: './tranfmefrecursos.component.html',
  styleUrls: ['./tranfmefrecursos.component.css']
})
export class TranfmefrecursosComponent implements OnInit {
  @Output() emitEventListadoTransferencias:EventEmitter<boolean> = new EventEmitter<boolean>();
  //@Input() estado:boolean = false;

  listTransferencias = [];
  bsModalRef: BsModalRef;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  totalRegistrosTransferencia;
  beTrasferenciaRealizadaRequest: TransferenciaRealizadaRequest;
  constructor(private fs: FacadeService,public funciones: Functions,private modalService: BsModalService,private excelService:ExcelService) { }

  ngOnInit() {
    this.beTrasferenciaRealizadaRequest = new TransferenciaRealizadaRequest();
    this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde = "";
    this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta = "";
    this.beTrasferenciaRealizadaRequest.num_filas = this.num_filas;
    this.beTrasferenciaRealizadaRequest.num_pagina = this.numero_Pagina;
    this.listarTransferencias(this.beTrasferenciaRealizadaRequest);
  }

  verDetalleTransferencia(transferencia){
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class:'modal-detalle-transferencia',
      initialState: {
        modelTransferencia: transferencia,arrProyectosSeleccionadosEnvioModal: transferencia.data_transferencia
        ,activarTransferencia: true,arrArchivosCargados: transferencia.data_archivo
      }
    };

    this.bsModalRef = this.modalService.show(TranfmefseleccionmodalComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarTransferencias(this.beTrasferenciaRealizadaRequest);
      }
    ) 
  }

  anularTransferencia(model){
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let strData = { id_transferencia_mef: model.id_transferencia_mef, usuario_eliminacion: model.usuario_eliminacion }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.transferenciaRealizadaService.anularTransferenciaMef(strData).subscribe(
          () => {
            this.listarTransferencias(this.beTrasferenciaRealizadaRequest);
            this.emitEventListadoTransferencias.emit(true);
          }
        );
      }
    });
  }
  listarTransferencias(pbeTransferenciaRealizadaRequest: TransferenciaRealizadaRequest){
    this.fs.transferenciaRealizadaService.listarTransferenciaMefPrincipal(pbeTransferenciaRealizadaRequest).subscribe(
      respuesta => {
        let transferenciaReturn;
        transferenciaReturn = respuesta as any;
        if (transferenciaReturn.cantidad_registro == 0) {
          this.listTransferencias = [];
        } else {
          this.listTransferencias = transferenciaReturn.transferencia;
          this.totalRegistrosTransferencia = transferenciaReturn.cantidad_registro;
        }
        if(pbeTransferenciaRealizadaRequest.fecha_publicacion_desde.toString().trim() != ""){
          pbeTransferenciaRealizadaRequest.fecha_publicacion_desde = this.funciones.ConvertStringtoDateDB(pbeTransferenciaRealizadaRequest.fecha_publicacion_desde);
        }
        if(pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta.toString().trim() != ""){
          pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta = this.funciones.ConvertStringtoDateDB(pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta);
        }
      }
    );
  }

  cambiarPagina(pagina) {
    this.numero_Pagina = ((pagina.page - 1) * this.num_filas);
    this.beTrasferenciaRealizadaRequest.num_pagina = this.numero_Pagina;
    if(this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde != null){
      if(this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde.toString().trim() != ""){
        this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde = this.funciones.formatDateAAAAMMDD(this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde);
      }
    }else{
      this.beTrasferenciaRealizadaRequest.fecha_publicacion_desde = "";
    }
    if(this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta != null){
      if(this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta.toString().trim() != ""){
        this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta = this.funciones.formatDateAAAAMMDD(this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta);
      }
    }else{
      this.beTrasferenciaRealizadaRequest.fecha_publicacion_hasta = "";
    }

    this.listarTransferencias(this.beTrasferenciaRealizadaRequest);
  }
  ConsultarTransferencias(pbeTransferenciaRealizadaRequest : TransferenciaRealizadaRequest){
    if(pbeTransferenciaRealizadaRequest.fecha_publicacion_desde != null){
      if(pbeTransferenciaRealizadaRequest.fecha_publicacion_desde.toString().trim() != ""){
        pbeTransferenciaRealizadaRequest.fecha_publicacion_desde = this.funciones.formatDateAAAAMMDD(pbeTransferenciaRealizadaRequest.fecha_publicacion_desde);
      }
    }else{
      pbeTransferenciaRealizadaRequest.fecha_publicacion_desde = "";
    }
    if(pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta != null){
      if(pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta.toString().trim() != ""){
        pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta = this.funciones.formatDateAAAAMMDD(pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta);
      }
    }else{
      pbeTransferenciaRealizadaRequest.fecha_publicacion_hasta = "";
    }
  
    pbeTransferenciaRealizadaRequest.num_pagina = 0;
    this.listarTransferencias(pbeTransferenciaRealizadaRequest);
  }

  LimpiarFecha(element:any, campo:string){
    element[campo] = "";
  }

  exportarTransferencia(transferenciaSeleccionada) {
    let arrDetalle = [];
    if(transferenciaSeleccionada.data_transferencia != null){
      for(let i=0; i< transferenciaSeleccionada.data_transferencia.length; i++){
        arrDetalle.push([transferenciaSeleccionada.data_transferencia[i].cod_unificado
        ,transferenciaSeleccionada.data_transferencia[i].cod_snip
        ,transferenciaSeleccionada.data_transferencia[i].nombre_proyecto
        ,transferenciaSeleccionada.data_transferencia[i].fuente_financiamiento_convenio
        ,transferenciaSeleccionada.data_transferencia[i].unidad_ejecutora
        ,this.funciones.format(this.funciones.setearValorDecimal(transferenciaSeleccionada.data_transferencia[i].monto.toString())) 
        ,transferenciaSeleccionada.data_transferencia[i].fuente_financiamiento_transferencia
        ,this.funciones.format(this.funciones.setearValorDecimal(transferenciaSeleccionada.data_transferencia[i].monto_transferido.toString())) 
      ]);
      }
    }
    let arrCabecera = ["CÓDIGO DEL PROYECTO", "CÓDIGO SNIP", "NOMBRE DEL PROYECTO", "F.F. CONVENIO", "UNIDAD EJECUTORA", "MONTO DE CONVENIO S/","F.F. TRANSFERENCIA","MONTO DE LA TRANSFERENCIA S/"];
    let arrDatosCabecera = ["Dispositivo:",transferenciaSeleccionada.dispositivo,"Fecha de Publicación:",this.funciones.formatDateMDY(transferenciaSeleccionada.fecha_publicacion.toString())];
    this.excelService.generateExcel(arrDetalle, "Reporte de Transferencia",arrCabecera,arrDatosCabecera);
  }

}
