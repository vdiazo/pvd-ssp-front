import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from '../../../../patterns/facade.service';
import { Functions,sessionStorageItems } from 'projects/sspssi/src/appSettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalResolucionContratoComponent } from './modal-resolucion-contrato/modal-resolucion-contrato.component';
import { IResolucionContrato } from '../../../../interfaces/IResolucionContrato';
import { ModalHistorialComponent } from './modal-historial/modal-historial.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ssi-resolucion-contrato',
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

  constructor(private fs: FacadeService, public funciones: Functions, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.idFaseObra = this.route.snapshot.params.idFase;
    if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
      this.idSeguimientoMonitoreoObra = parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA))
    }
    else {
      this.idSeguimientoMonitoreoObra = this.route.snapshot.params.idSeguimientoMonitoreo;
    }
    isNaN(this.idSeguimientoMonitoreoObra) ? this.btnNuevo = true : this.btnNuevo = false;
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
    this.fs.resolucionContratoService.listarResolucionContrato(id_fase, filas, paginas).subscribe(
      (respuesta: any) => {
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
        idSeguimientoMonitoreo: model.id_seguimiento_monitoreo_obra,
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
