import { Component, OnInit, Input } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalEntregableExpedienteComponent } from './modal-entregable-expediente/modal-entregable-expediente.component';
import { AvanceSeguimientoExpedienteService } from 'projects/sspssi/src/servicios/expediente/avance-expediente/avance-seguimiento-expediente.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'ssi-entregables-expediente',
  templateUrl: './entregables-expediente.component.html',
  styleUrls: ['./entregables-expediente.component.css']
})
export class EntregablesExpedienteComponent implements OnInit {

  UltimaActualizacionAvanceInforme: string;
  listaEntregablesAvance: any = [];

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() fechaInicioContractual: Date;
  @Input() bEstado: boolean;
  @Input() idFase: number;
  @Input() snip: number;
  @Input() bAvanceInforme: boolean;

  bsModalEntregableRef: BsModalRef;
  config;
  rptaListaEntregablesAvance: any = [];
  totalRegistros: number;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;
  mostrarDetalleCronograma = false;
  avanceFinanciero: any = [];
  montoTotalFinancieroAcumulado: number;
  porcentajeAvanceFisicoAcumulado: number;
  esCambio = false;

  constructor(public funciones: Functions, private modalService: BsModalService, private sMant: MaestraSsiService, private avanceSeguimientoExpedienteService: AvanceSeguimientoExpedienteService) { }

  ngOnInit() {
    this.listarAvanceInformeExpediente(this.idSeguimientoMonitoreoExpediente, this.snip, this.idFase, this.numPaginasMostrar, this.paginaActiva);
    this.UltimaActualizacionAvanceInforme = this.obtenerDatosAuditoria('AvanceInforme');
  }

  listarAvanceInformeExpediente(id_seguimiento: number, codSnip: number, idFase: number, numeroPagina: number, nroFilas: number) {
    this.avanceSeguimientoExpedienteService.listarAvanceEntregableExpediente(id_seguimiento, codSnip, idFase, numeroPagina, nroFilas).subscribe(
      data => {
        this.rptaListaEntregablesAvance = data;
        this.totalRegistros = this.rptaListaEntregablesAvance.cantidad;
        if (this.totalRegistros > 0) {
          this.listaEntregablesAvance = this.rptaListaEntregablesAvance.avance_informe;
          this.montoTotalFinancieroAcumulado = this.rptaListaEntregablesAvance.avance_financiero_acumulado;
          this.porcentajeAvanceFisicoAcumulado = this.rptaListaEntregablesAvance.porcentaje_fisico_acumulado;
        } else {
          this.listaEntregablesAvance = [];
          this.montoTotalFinancieroAcumulado = 0;
          this.porcentajeAvanceFisicoAcumulado = 0;
        }

      }
    );
  }

  openModalValEntregable() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        fecha_inicio_contractual: this.fechaInicioContractual,
        entidadEditar: null,
      }
    };
    this.bsModalEntregableRef = this.modalService.show(ModalEntregableExpedienteComponent, this.config);
    this.bsModalEntregableRef.content.retornoValoresAvance.subscribe(
      (data: number) => {
        this.listarAvanceInformeExpediente(data, this.snip, this.idFase, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('AvanceInforme');
      }
    );
  }

  editarAvanceEntregable(entregable) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        fecha_inicio_contractual: this.fechaInicioContractual,
        entidadEditar: entregable,
      }
    };
    this.bsModalEntregableRef = this.modalService.show(ModalEntregableExpedienteComponent, this.config);
    this.bsModalEntregableRef.content.retornoValoresAvance.subscribe(
      (data: number) => {
        this.listarAvanceInformeExpediente(data, this.snip, this.idFase, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('AvanceInforme');
      }
    );
  }

  anularAvanceEntregable(idAvanceEntregable: any) {
    const param = {
      id_avance_informe: idAvanceEntregable,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };

    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.avanceSeguimientoExpedienteService.anularAvanceEntregableExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarAvanceInformeExpediente(this.idSeguimientoMonitoreoExpediente, this.snip, this.idFase, this.numPaginasMostrar, this.paginaActiva);
              this.consultaAuditoria('AvanceInforme');
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  verDetalleEntregable() {
    this.mostrarDetalleCronograma = true;
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarAvanceInformeExpediente(this.idSeguimientoMonitoreoExpediente, this.snip, this.idFase, this.numero_Pagina, this.numPaginasMostrar);
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    // Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return ` ${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        return '';
      }
    }
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'AvanceInforme') {
          this.UltimaActualizacionAvanceInforme = this.obtenerDatosAuditoria('AvanceInforme');
        }
      }
    );
  }
}
