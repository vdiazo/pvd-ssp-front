import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalLiquidacionExpedienteComponent } from './modal-liquidacion-expediente/modal-liquidacion-expediente.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { LiquidacionContratoExpedienteService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/liquidacion-contrato-expediente.service';
import { InformacionFinancieraSigatService } from 'projects/sspssi/src/servicios/informacion-financiera-sigat.service';
import { EstadoFinancieroComponent } from '../../seguimiento-expediente/estado-financiero/estado-financiero.component';
import { DatosContratoService } from 'projects/sspssi/src/servicios/datos-contrato.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'ssi-liquidacion-expediente',
  templateUrl: './liquidacion-expediente.component.html',
  styleUrls: ['./liquidacion-expediente.component.css']
})
export class LiquidacionExpedienteComponent implements OnInit {

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() codSnip: number;
  @Input() idFase: number;
  @Input() bEstado: boolean;


  rptaListaLiquidacionExpediente: any = [];
  listaLiquidacionExpediente: any = [];
  consultaSigat: any;
  rptaDatosProyecto: any;
  datosProyecto: any;
  ultimaActualizacionAprobacionLiquidacion: string;
  totalRegistros: number;
  existeLiquidacion = false;
  bsModalRef: BsModalRef;
  config;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;

  constructor(private modalService: BsModalService, public funciones: Functions, private sMant: MaestraSsiService, private liquidacionExpedienteService: LiquidacionContratoExpedienteService,
    private infoSigat: InformacionFinancieraSigatService, private datosContratoService: DatosContratoService) { }

  ngOnInit() {
    this.listarSeguimientoLiquidacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.ultimaActualizacionAprobacionLiquidacion = this.obtenerDatosAuditoria('Liquidacion');
  }

  obtenerInformacionSigatEstadoFinanciero() {
    this.obtenerinformacionProyecto(this.codSnip, this.idFase).then(
      () => {
        let nroContrato = this.datosProyecto.numero_contrato.trim();
        nroContrato = this.transformarNroContrato(nroContrato);
        if (this.validarNumeroContrato(nroContrato)) {
          this.obtenerInformacionSigat(nroContrato);
        } else {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        }
      }
    );
  }

  transformarNroContrato(nroContrato: string): String {
    let contrato = nroContrato;
    let contratoReturn;
    let pos = contrato.indexOf('-MTC');
    if (pos == -1) {
      let pos1 = contrato.indexOf('-');
      let anio = parseInt(contrato.slice(0, pos1), 10) > 1998 ? contrato.slice(0, pos1) : contrato.slice(pos1 + 1);
      let contratoExtraido = parseInt(contrato.slice(0, pos1), 10) < 1998 ? contrato.slice(0, pos1) : contrato.slice(pos1 + 1);
      contratoExtraido = this.PadLeft(parseInt(contratoExtraido, 10), 5);
      contratoReturn = `${anio}-${contratoExtraido}`;
      return contratoReturn;
    } else {
      contrato = contrato.slice(0, pos);
      let pos1 = contrato.indexOf('-');
      let anio = parseInt(contrato.slice(0, pos1), 10) > 1998 ? contrato.slice(0, pos1) : contrato.slice(pos1 + 1);
      let contratoExtraido = parseInt(contrato.slice(0, pos1), 10) < 1998 ? contrato.slice(0, pos1) : contrato.slice(pos1 + 1);
      contratoExtraido = this.PadLeft(parseInt(contratoExtraido, 10), 5);
      contratoReturn = `${anio}-${contratoExtraido}`;
      return contratoReturn;
    }
  }

  PadLeft(value, length) {
    return (value.toString().length < length) ? this.PadLeft(`0${value}`, length) :
      value;
  }

  obtenerinformacionProyecto(codSnip: number, idFase: number): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.datosContratoService.listarDatosContrato(codSnip, idFase).subscribe(
        respuesta => {
          this.rptaDatosProyecto = respuesta;
          if (this.rptaDatosProyecto.contrato.length > 0) {
            this.datosProyecto = this.rptaDatosProyecto.contrato[0];
            resolve();
          } else {
            this.funciones.mensaje('info', 'No se encontraron datos para la consulta efectuada.');
          }
        }, () => {
          reject(new Error('Error de ejecución . . . :( '));
        }
      );
    });
    return promise;
  }

  validarNumeroContrato(nroContrato: string) {
    let esValido = false;
    if (nroContrato.length == 10) {
      esValido = true;
    }
    return esValido;
  }
  listarSeguimientoLiquidacionExpediente(id_SeguimientoExpediente: number, numero_pagina: number, numero_pagina_mostrar: number) {
    this.liquidacionExpedienteService.listarLiquidacionExpediente(id_SeguimientoExpediente, numero_pagina, numero_pagina_mostrar).subscribe(
      data => {
        this.rptaListaLiquidacionExpediente = data;
        this.totalRegistros = this.rptaListaLiquidacionExpediente.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaLiquidacionExpediente = this.rptaListaLiquidacionExpediente.data;
          this.existeLiquidacion = true;
        } else {
          this.listaLiquidacionExpediente = [];
          this.existeLiquidacion = false;
        }
      },
      error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
    );
  }
  nuevaLiquidacionExpediente() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        id_SeguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalLiquidacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresLiquidacion.subscribe(
      (data: number) => {
        this.listarSeguimientoLiquidacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('Liquidacion');
      }
    );
  }

  modalEditarLiquidacion(liquidacionExpediente) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: liquidacionExpediente,
        id_SeguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalLiquidacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresLiquidacion.subscribe(
      (data: number) => {
        this.listarSeguimientoLiquidacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('Liquidacion');
      }
    );
  }

  modalEstadoEconomicoSigat(estadoEconomicoSigat: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-reporte-financiero',
      initialState: {
        estadoFinancieroEnvio: estadoEconomicoSigat,
        datosProyecto: this.datosProyecto,
      },
    };
    this.bsModalRef = this.modalService.show(EstadoFinancieroComponent, this.config);
  }

  anularLiquidacion(idSeguimientoLiquidacion: number) {
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        const param = {
          id_liquidacion_seguimiento_expediente: idSeguimientoLiquidacion,
          usuario_eliminacion: sessionStorage.getItem('Usuario'),
        };
        this.liquidacionExpedienteService.anularLiquidacionExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarSeguimientoLiquidacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
              this.consultaAuditoria('Liquidacion');
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarSeguimientoLiquidacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.numero_Pagina);
  }

  obtenerInformacionSigat(nroContrato: string) {
    this.infoSigat.obtenerInformacionFinanciera(nroContrato).subscribe(
      data => {
        if (data != null) {
          this.consultaSigat = data;
          if (this.consultaSigat.Contrato[0] != null) {
            this.modalEstadoEconomicoSigat(this.consultaSigat);
          } else {
            this.funciones.mensaje('warning', 'El contrato elegido no contiene información')
          }
        }
      },
      error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
    );
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'Liquidacion') {
          this.ultimaActualizacionAprobacionLiquidacion = this.obtenerDatosAuditoria('Liquidacion');
        }
      }
    );
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      const infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return `${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        return '';
      }
    }
  }
}
