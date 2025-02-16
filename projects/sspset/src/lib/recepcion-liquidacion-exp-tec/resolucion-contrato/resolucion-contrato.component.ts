import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalResolucionContratoComponent } from './modal-resolucion-contrato/modal-resolucion-contrato.component';
import { ModalHistorialComponent } from './modal-historial/modal-historial.component';
import { ActivatedRoute } from '@angular/router';
import { FacadeService } from '../../patterns/facade.service';
import { IResolucionContrato } from '../../Interfaces/IResolucionContrato';
import { sessionStorageItems } from './../../../appSettings/sessionStorage';
import { Funciones } from './../../../appSettings/funciones';

@Component({
  selector: 'set-resolucion-contrato',
  templateUrl: './resolucion-contrato.component.html',
  styleUrls: ['./resolucion-contrato.component.css']
})
export class ResolucionContratoComponent implements OnInit {

  listResolucionContrato: any;
  totalRegistros: number = 0;
  usuario_eliminacion: string = "";
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  config;
  bsModalResolucionContratoRef: BsModalRef;
  bsModalHistorialRef: BsModalRef;

  idFaseObra: number;
  idSeguimientoMonitoreoObra: number;
  btnNuevo: boolean;

  constructor(private fs: FacadeService, public funciones: Funciones, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    console.log("this.route.snapshot.params.idSeguimientoMonitoreo",this.route.snapshot.params.idSeguimientoMonitoreo);
    this.idFaseObra = parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);//this.route.snapshot.params.idFase;
    console.log("this.idFaseObra",this.idFaseObra);
    this.idSeguimientoMonitoreoObra = parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA));
    console.log("this.idFaseObra",this.idFaseObra);
    // if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
    //   this.idSeguimientoMonitoreoObra = parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA))
    // }
    // else {
    //   this.idSeguimientoMonitoreoObra = this.route.snapshot.params.idSeguimientoMonitoreo;
    // }

    console.log(sessionStorage.getItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA));
    console.log("this.idSeguimientoMonitoreoObra",this.idSeguimientoMonitoreoObra);
    console.log(sessionStorage.getItem("fecha_inicio_obra"));
    // isNaN(this.idSeguimientoMonitoreoObra) ? this.btnNuevo = true : this.btnNuevo = false;
    this.listarResolucionContrato(this.idFaseObra, this.num_filas, this.numero_Pagina);
  }

  opnNuevaResolucionContrato() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_fase: this.idFaseObra,
        id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra
      }
    };

    this.bsModalResolucionContratoRef = this.modalService.show(ModalResolucionContratoComponent, this.config);
    this.bsModalResolucionContratoRef.content.emitResolucionContrato.subscribe(
      () => {
        this.listarResolucionContrato(this.idFaseObra, this.num_filas, this.numero_Pagina);
      }
    )
  }

  listarResolucionContrato(id_fase, filas, paginas) {
    let param={
      id_fase:id_fase,
      skip:filas,
      take:paginas
    }
    this.fs.resolucionContratoService.listarResolucionContrato(param).subscribe(
      (respuesta: any) => {
      //   respuesta={
      //     cantidad_registro: 1,
      //     resolucion_contrato: [
      //         {
      //             id_resolucion_contrato: 1,
      //             id_seguimiento_monitoreo_obra: 194,
      //             id_fase: 892,
      //             id_tipo_documento: 2,
      //             nombre_tipo_documento: "CARTA",
      //             fecha_emision_documento: "28/08/2019",
      //             descripcion: "RESOLUCIÓN Nº 253-2019-G.R.PASCO/GGR, RESUELVE DE FORMA TOTAL EL CONTRATO Nº 008-2018-GRP/GR, POR HABER VALORIZADO MENOR AL OCHENTA POR CIENTO (80%).",
      //             nombre_archivo: "RESOLUCION_CONTRATO_20220512030843.pdf|",
      //             ruta_archivo: "http://10.4.0.22/QA_VASSP/archivos/obras/resolucion_contrato/"
      //         }
      //     ]
      // }
        if (respuesta.cantidad_registro != 0) {
          this.listResolucionContrato = respuesta.resolucion_contrato;
          this.totalRegistros = respuesta.cantidad_registro;
        }
        else {
          this.listResolucionContrato = null;
        }
      }
    );
  }

  editarResolucionContrato(model: IResolucionContrato) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        resolucionContrato: model
      }
    };

    this.bsModalResolucionContratoRef = this.modalService.show(ModalResolucionContratoComponent, this.config);
    this.bsModalResolucionContratoRef.content.emitResolucionContrato.subscribe(
      () => {
        this.listarResolucionContrato(this.idFaseObra, this.num_filas, this.numero_Pagina);
      }
    );
  }

  anularResolucionContrato(model) {
    let strData = { id_resolucion_contrato: model.id_resolucion_contrato, usuario_eliminacion: sessionStorage.getItem("Usuario") }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar la Resolución de Contrato?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.resolucionContratoService.eliminarResolucionContrato(strData).subscribe(
          () => {
            this.listarResolucionContrato(model.id_fase, this.num_filas, this.numero_Pagina);
          }
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarResolucionContrato(this.idFaseObra, this.num_filas, this.numero_Pagina);
  }

  opnHistorial(model: IResolucionContrato) {
    sessionStorage.setItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA_REGISTRO, sessionStorage.getItem("idSeguimiento"));
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idFase: model.id_fase,
        idSeguimientoMonitoreo: model.id_seguimiento_ejecucion_expediente,
        idTramo: 5
      }
    };

    this.bsModalHistorialRef = this.modalService.show(ModalHistorialComponent, this.config);
    this.bsModalHistorialRef.content.emitResolucionContrato.subscribe(
      () => {
        sessionStorage.setItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA, sessionStorage.getItem("idSeguimiento_registro"));
        sessionStorage.setItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA_REGISTRO, null);
      }
    );
  }
}
