import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalParalizacionExpedienteComponent } from './modal-paralizacion-expediente/modal-paralizacion-expediente.component';
import { ModalAccionParalizacionExpComponent } from './modal-accion-paralizacion-exp/modal-accion-paralizacion-exp.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ParalizacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/periodo-paralizacion/paralizacion-expediente.service';
import { AccionParalizacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/periodo-paralizacion/accion-paralizacion-expediente.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'ssi-periodo-paralizacion-expediente',
  templateUrl: './periodo-paralizacion-expediente.component.html',
  styleUrls: ['./periodo-paralizacion-expediente.component.css']
})
export class PeriodoParalizacionExpedienteComponent implements OnInit {
  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() fechaInicioContractual: Date;
  @Input() bEstado: boolean;
  ultimaActualizacionParalizacion: string;
  ultimaActualizacionAccionParalizacion: string;
  mostrarAuditoriaAccionParalizacion = true;
  rptaListadoParalizaciones: any = [];
  listParalizaciones: any = [];
  totalRegistrosParalizacion: number;
  totalRegistrosParalizacionAccion: number;
  rptaListadoAccionParalizaciones: any = [];
  listaAccionesParalizacion: any = [];
  numPaginasMostrar = 5;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrarAccionParalizacion = 5;
  numPaginaAccionParalizacion = 0;
  paginaActivaAccionParalizacion = 0;
  idParalizacionAccionExpedienteParametro = 0;

  verDetalleAcciones = false;
  bsModalRef: BsModalRef;
  config;

  constructor(private modalService: BsModalService, public funciones: Functions, private sMant: MaestraSsiService, private periodoParalizacionService: ParalizacionExpedienteService, private accionParalizacionService: AccionParalizacionExpedienteService) { }

  ngOnInit() {
    this.listarParalizacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.ultimaActualizacionParalizacion = this.obtenerDatosAuditoria('Paralizacion');
    this.ultimaActualizacionAccionParalizacion = this.obtenerDatosAuditoria('AccionParalizacion');
  }

  listarParalizacionExpediente(id_seguimiento: number, nro_pagina: number, paginas_mostrar: number) {
    this.periodoParalizacionService.listarParalizacionesExpediente(id_seguimiento, nro_pagina, paginas_mostrar).subscribe(
      data => {
        this.rptaListadoParalizaciones = data;
        this.totalRegistrosParalizacion = this.rptaListadoParalizaciones.cantidad_registro;
        if (this.totalRegistrosParalizacion > 0) {
          this.listParalizaciones = this.rptaListadoParalizaciones.paralizacion_expediente;
        } else {
          this.listParalizaciones = [];
        }
      }
    );
  }

  listarAccionParalizacionExpediente(id_paralizacionAccionExpediente: number, num_paginasMostrarAccionParalizacion: number, num_paginaAccionParalizacion: number) {
    this.accionParalizacionService.listarAccionesParalizacionExpediente(id_paralizacionAccionExpediente, num_paginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion).subscribe(
      data => {
        this.rptaListadoAccionParalizaciones = data;
        this.totalRegistrosParalizacionAccion = this.rptaListadoAccionParalizaciones.cantidad_registro;
        if (this.totalRegistrosParalizacionAccion > 0) {
          this.listaAccionesParalizacion = this.rptaListadoAccionParalizaciones.paralizacion_accion_expediente;
        } else {
          this.listaAccionesParalizacion = [];
        }
      }
    );
  }

  openModalNuevaParalizacion() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        id_SeguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        fecha_inicio_contractual: this.fechaInicioContractual,
      }
    };
    this.bsModalRef = this.modalService.show(ModalParalizacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresParalizacion.subscribe(
      (data: number) => {
        this.listarParalizacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('Paralizacion');
      }
    );
  }

  obtenerDetalleAccionesParalizacion(idParalizacionExpediente: number) {
    if (this.verDetalleAcciones) {
      this.verDetalleAcciones = false;
    } else {
      this.verDetalleAcciones = true;
      this.idParalizacionAccionExpedienteParametro = idParalizacionExpediente;
      this.listarAccionParalizacionExpediente(this.idParalizacionAccionExpedienteParametro, this.numPaginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion);
    }
  }

  openModalNuevaAccionParalizacion(idParalizacion: number) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        idParalizacionExpediente: idParalizacion,
        fecha_inicio_contractual: this.fechaInicioContractual,
      }
    };
    this.bsModalRef = this.modalService.show(ModalAccionParalizacionExpComponent, this.config);
    this.bsModalRef.content.retornoValoresAccionParalizacion.subscribe(
      (data: number) => {
        this.listarAccionParalizacionExpediente(data, this.numPaginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion);
        this.consultaAuditoria('AccionParalizacion');
      }
    );

  }

  editarParalizacion(paralizacion: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: paralizacion,
        id_SeguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        fecha_inicio_contractual: this.fechaInicioContractual,
      }
    };
    this.bsModalRef = this.modalService.show(ModalParalizacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresParalizacion.subscribe(
      (data: number) => {
        this.listarParalizacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('Paralizacion');
      }
    );
  }

  eliminarParalizacion(idParalizacion: number) {
    const param = {
      id_paralizacion_expediente: idParalizacion,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta) {
        this.periodoParalizacionService.anularPeriodoParalizacionExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarParalizacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
              this.verDetalleAcciones = false;
              this.consultaAuditoria('Paralizacion');
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  editarAccionParalizacion(accionParalizacion: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: accionParalizacion,
        fecha_inicio_contractual: this.fechaInicioContractual,
      }
    };
    this.bsModalRef = this.modalService.show(ModalAccionParalizacionExpComponent, this.config);
    this.bsModalRef.content.retornoValoresAccionParalizacion.subscribe(
      (data: number) => {
        this.listarAccionParalizacionExpediente(data, this.numPaginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion);
        this.consultaAuditoria('AccionParalizacion');
      }
    );
  }

  eliminarAccionParalizacion(idAccionParalizacion: number) {
    const param = {
      id_paralizacion_accion_expediente: idAccionParalizacion,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta) {
        this.accionParalizacionService.anularAccionPeriodoParalizacionExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarAccionParalizacionExpediente(this.idParalizacionAccionExpedienteParametro, this.numPaginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion);
              this.consultaAuditoria('AccionParalizacion');
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  cambiarPaginaParalizacion(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = ((pagina.page - 1) * this.numPaginasMostrar);
    this.listaAccionesParalizacion = [];
    this.totalRegistrosParalizacionAccion = 0;
    this.listarParalizacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
  }

  cambiarPaginaAccionParalizacion(pagina) {
    this.paginaActivaAccionParalizacion = ((pagina.page - 1) * this.numPaginasMostrarAccionParalizacion);
    this.numPaginaAccionParalizacion = ((pagina.page - 1) * this.numPaginasMostrarAccionParalizacion);
    this.listarAccionParalizacionExpediente(this.idParalizacionAccionExpedienteParametro, this.numPaginasMostrarAccionParalizacion, this.numPaginaAccionParalizacion);
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
        if (pNombreTipoAuditoria == 'Paralizacion') {
          this.ultimaActualizacionParalizacion = this.obtenerDatosAuditoria('Paralizacion');
        } else if (pNombreTipoAuditoria == 'AccionParalizacion') {
          this.ultimaActualizacionAccionParalizacion = this.obtenerDatosAuditoria('AccionParalizacion');
        }
      }
    );
  }
}
