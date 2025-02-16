import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalAprobacionExpedienteComponent } from './modal-aprobacion-expediente/modal-aprobacion-expediente.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { AprobacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/aprobacion-expediente.service';
import { MetasProyectoService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/metas-proyecto.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { ModalMetasExpedienteComponent } from './modal-metas-expediente/modal-metas-expediente.component';

@Component({
  selector: 'ssi-aprobacion-expediente',
  templateUrl: './aprobacion-expediente.component.html',
  styleUrls: ['./aprobacion-expediente.component.css']
})
export class AprobacionExpedienteComponent implements OnInit {

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() bEstado: boolean;


  rptaListaAprobacionExpediente: any = [];
  listaAprobacionExpediente: any = [];

  idAprobacionExpediente: number;
  listaMetasProyectoExpediente: any = [];
  rptaListaMetasProyectoExpediente: any = [];
  ultimaActualizacionAprobacionExpediente: string;
  ultimaActualizacionMetasProyecto: string;
  totalRegistros: number;
  totalRegistrosMetas: number;
  existeAprobacion = false;
  existeMetasProyecto = false;
  bsModalRef: BsModalRef;
  config;
  paginaActiva = 0;
  paginaActivaMetas = 0;
  numero_Pagina = 0;
  numero_PaginaMetas = 0;
  numPaginasMostrar = 5;
  numPaginasMostrarMetas = 5;
  constructor(private modalService: BsModalService, public funciones: Functions, private sMant: MaestraSsiService, private aprobacionExpedienteService: AprobacionExpedienteService, private metasProyectoService: MetasProyectoService) { }

  ngOnInit() {
    this.listarSeguimientoAprobacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.ultimaActualizacionAprobacionExpediente = this.obtenerDatosAuditoria('AprobacionExpediente');
  }

  listarSeguimientoAprobacionExpediente(id_seguimientoExpediente: number, num_filas: number, numero_pagina: number) {
    this.aprobacionExpedienteService.listarAprobacionExpediente(id_seguimientoExpediente, num_filas, numero_pagina).subscribe(
      data => {
        this.rptaListaAprobacionExpediente = data;
        this.totalRegistros = this.rptaListaAprobacionExpediente.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaAprobacionExpediente = this.rptaListaAprobacionExpediente.data;
          this.idAprobacionExpediente = this.listaAprobacionExpediente[0].id_aprobacion_expediente;
          this.listarRegistroMetasProyectoExpediente(this.idAprobacionExpediente, this.numPaginasMostrarMetas, this.paginaActivaMetas);
          this.consultaAuditoria('MetaAprobacionExpediente');

          this.existeAprobacion = true;
        } else {
          this.listaAprobacionExpediente = [];
          this.existeAprobacion = false;
        }
      },
      error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
    );
  }

  nuevaAprobacionExpediente() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalAprobacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAprobacionExpediente.subscribe(
      (data: number) => {
        this.listarSeguimientoAprobacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('AprobacionExpediente');
      }
    );
  }
  modalEditarAprobacion(aprobacionExpediente: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: aprobacionExpediente,
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalAprobacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAprobacionExpediente.subscribe(
      (data: number) => {
        this.listarSeguimientoAprobacionExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('AprobacionExpediente');
      }
    );
  }

  anularAprobacionExpediente(id_SeguimientoAprobacion: number) {
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        const param = {
          id_aprobacion_expediente: id_SeguimientoAprobacion,
          usuario_eliminacion: sessionStorage.getItem('Usuario'),
        };
        this.aprobacionExpedienteService.anularAprobacionExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarSeguimientoAprobacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
              this.consultaAuditoria('AprobacionExpediente');
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  listarRegistroMetasProyectoExpediente(idAprobacionExpediente: number, intSkip: number, intTake: number) {
    this.metasProyectoService.listarMetasProyectoExpediente(idAprobacionExpediente, intSkip, intTake).subscribe(
      data => {
        this.rptaListaMetasProyectoExpediente = data;
        this.totalRegistrosMetas = this.rptaListaMetasProyectoExpediente.cantidad_registro;
        if (this.totalRegistrosMetas > 0) {
          this.listaMetasProyectoExpediente = this.rptaListaMetasProyectoExpediente.meta_proyecto;
          this.existeMetasProyecto = true;

        } else {
          this.listaMetasProyectoExpediente = [];
          this.existeMetasProyecto = false;
        }
      }
    );
  }

  registrarMetasProyecto() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        idAprobacionExpediente: this.idAprobacionExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalMetasExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresMetasExpediente.subscribe(
      (data: number) => {
        this.listarRegistroMetasProyectoExpediente(data, this.numPaginasMostrarMetas, this.paginaActivaMetas);
        this.consultaAuditoria('MetaAprobacionExpediente');
      }
    );
  }

  modificarMetasProyecto(metaProyecto: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: metaProyecto,
        idAprobacionExpediente: this.idAprobacionExpediente
      }
    };
    this.bsModalRef = this.modalService.show(ModalMetasExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresMetasExpediente.subscribe(
      (data: number) => {
        this.listarRegistroMetasProyectoExpediente(data, this.numPaginasMostrarMetas, this.paginaActivaMetas);
        this.consultaAuditoria('MetaAprobacionExpediente');
      }
    );
  }

  anularMetaProyectoExpediente(id_metaProyecto: number) {
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        const param = {
          id_meta_proyecto: id_metaProyecto,
          usuario_eliminacion: sessionStorage.getItem('Usuario'),
        };
        this.metasProyectoService.anularMetasProyectoExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarRegistroMetasProyectoExpediente(this.idAprobacionExpediente, this.numPaginasMostrarMetas, this.paginaActivaMetas);
              this.consultaAuditoria('MetaAprobacionExpediente');
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

    this.listarSeguimientoAprobacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.numero_Pagina);
  }

  cambiarPaginaMetas(pagina) {
    this.paginaActivaMetas = ((pagina.page - 1) * this.numPaginasMostrarMetas);
    this.numero_PaginaMetas = this.paginaActivaMetas;

    this.listarSeguimientoAprobacionExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrarMetas, this.numero_PaginaMetas);
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'AprobacionExpediente') {
          this.ultimaActualizacionAprobacionExpediente = this.obtenerDatosAuditoria('AprobacionExpediente');
        } else if (pNombreTipoAuditoria == 'MetaAprobacionExpediente') {
          this.ultimaActualizacionMetasProyecto = this.obtenerDatosAuditoria('MetaAprobacionExpediente');
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
