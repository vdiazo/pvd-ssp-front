import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { Functions, TipoObjeto } from 'projects/sspssi/src/appSettings';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { SeguimientoMonitoreoExpedienteService } from 'projects/sspssi/src/servicios/expediente/seguimiento-monitoreo-expediente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalAmpliacionExpedienteComponent } from './modal-ampliacion-expediente/modal-ampliacion-expediente.component';
import { ModalAdelantoExpedienteComponent } from './modal-adelanto-expediente/modal-adelanto-expediente.component';
import { ExpedienteComponent as MenuTabsComponent } from 'projects/sspssi/src/lib/expediente/expediente.component';
import { SeguimientoMonitoreoExpediente } from 'projects/sspssi/src/models/expediente/seguimiento-monitoreo/seguimiento-monitoreo-expediente.model';
import { ModalEntregaTerrenoComponent } from './modal-entrega-terreno/modal-entrega-terreno.component';
import { DatosContratoService } from 'projects/sspssi/src/servicios/datos-contrato.service';
import { ProcesoSeleccionBienesServiciosRequest } from 'projects/sspssi/src/models/request/proceso-seleccion-bs-request';


@Component({
  selector: 'ssi-informacion-expediente',
  templateUrl: './informacion-expediente.component.html',
  styleUrls: ['./informacion-expediente.component.css']
})
export class InformacionExpedienteComponent implements OnInit {

  model: SeguimientoMonitoreoExpediente;
  divSegMonitoreo = false; // comienza en false
  idMunicipalidad: number;
  fecha_inicio_contractual: Date;
  fecha_termino_contractual_temporal: Date;
  fecha_entrega_terreno: Date;
  seguimientoExpediente;
  guid = '';
  bTramo = false;
  bMostrar = false;
  UltimaActualizacionInfExpediente = '';
  UltimaActualizacionAvanceInforme = '';
  UltimaActualizacionParalizacion = '';
  entidadBusqueda: ProcesoSeleccionBienesServiciosRequest;
  idProyecto: number;
  snip: number;
  codigo_unificado: number;
  rptaDatosContrato: any;
  rptaDetalleSeace: any;
  monto_contrato = 0;
  verDatosContrato = false;
  verDatosFinContrato = false;
  @Input() bEstado: boolean;
  @Input() idFase: number;
  @Input() idTramo: number;
  @Input() idSeguimientoMonitoreoExpediente: number;
  @Output() eventInformacionExpediente = new EventEmitter();

  config;
  bsModalRef: BsModalRef;
  menuTabs: MenuTabsComponent;

  constructor(public funciones: Functions, private sMant: MaestraSsiService, private route: ActivatedRoute, private modalService: BsModalService, private injector: Injector,
    private router: Router, private segExpService: SeguimientoMonitoreoExpedienteService, private datosContratoService: DatosContratoService) {
    this.model = new SeguimientoMonitoreoExpediente();
  }

  ngOnInit() {
    this.snip = this.route.snapshot.params.snip;
    this.idProyecto = this.route.snapshot.params.idProyecto; 
    this.codigo_unificado = parseInt(sessionStorage.getItem('CodUnificado'), 10);
    // this.obtenerInformacionSeace(this.snip);

    if (this.idFase === 0 && this.idSeguimientoMonitoreoExpediente === 0) {
      this.bTramo = true;
    } else {
      this.listarSeguimientoMonitoreoExpediente(this.idSeguimientoMonitoreoExpediente, this.bEstado);
      this.bTramo = false;
    }

    // Datos Auditoria
    this.UltimaActualizacionInfExpediente = this.obtenerDatosAuditoria('InformacionExpediente');
    this.UltimaActualizacionAvanceInforme = this.obtenerDatosAuditoria('AvanceInforme');
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
  }

  obtenerInformacionSeace(codSnip: number) {
    this.datosContratoService.obtenerDatosContrato(codSnip).subscribe(
      data => {
        this.rptaDatosContrato = data;
        if (this.rptaDatosContrato.contrato.length > 0) {
          let datosContrato = this.rptaDatosContrato.contrato[0];
          this.model.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(datosContrato.fecha_contrato);
          this.model.monto_contrato = datosContrato.valor_adjudicado_item;
          this.verDatosContrato = true;
          if (this.model.plazo_ejecucion > 0) {
            let tempo = this.funciones.SumDaytoDate(this.model.fecha_inicio_contractual, this.model.plazo_ejecucion);
            this.model.fecha_termino_contractual = tempo;
            this.verDatosFinContrato = true;
          }
        }
      }
    );
  }

  listarSeguimientoMonitoreoExpediente(idSegMonitoreo, bEstado) {
    this.segExpService.listarSeguimientoMonitoreoExpediente(idSegMonitoreo, bEstado).subscribe(
      respuesta => {
        this.seguimientoExpediente = respuesta;
        if (this.seguimientoExpediente == '{ "data":[{}]}') {
        } else {
          this.model.monto_adelanto_directo = this.seguimientoExpediente[0].monto_adelanto_directo;
          this.model.fecha_inicio_servicio = this.funciones.ConvertStringtoDateDB(this.seguimientoExpediente[0].fecha_inicio_contractual);
          this.model.fecha_termino_servicio = this.funciones.ConvertStringtoDateDB(this.seguimientoExpediente[0].fecha_termino_contractual);
          this.fecha_termino_contractual_temporal = this.funciones.ConvertStringtoDateDB(this.seguimientoExpediente[0].fecha_termino_contractual);
          this.model.fecha_entrega_terreno = this.seguimientoExpediente[0].fecha_entrega_terreno == null ? '' : this.funciones.ConvertStringtoDateDB(this.funciones.formatDateAAAAMMDD(this.seguimientoExpediente[0].fecha_entrega_terreno));
          this.model.plazo_ejecucion = this.seguimientoExpediente[0].plazo_ejecucion;
          this.model.ampliacion = this.seguimientoExpediente[0].ampliacion;
          this.model.fecha_term_cont_ampl = this.funciones.ConvertStringtoDateDB(this.seguimientoExpediente[0].fecha_term_cont_ampl);
          sessionStorage.setItem('idSeguimiento', this.seguimientoExpediente[0].id_seguimiento_ejecucion_expediente);
          this.divSegMonitoreo = true;
          this.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          const param = {
            id_seguimiento_ejecucion_expediente: idSegMonitoreo,
            id_fase: this.idFase,
            fecha_inicio_contractual: this.funciones.formatDateAAAAMMDD(this.model.fecha_inicio_servicio),
            plazo_ejecucion: this.model.plazo_ejecucion,
            usuario_modificacion: sessionStorage.getItem('Usuario')
          };
          this.eventInformacionExpediente.emit(param);
        }
      });
  }

  modificarSegMonitoreoExpediente(model) {
    this.model.fecha_termino = null;
    this.model.fecha_termino_contractual = null;
    this.model.fecha_termino_servicio = null;
    this.model.id_fase = parseInt(this.idFase.toString(), 10);

    if (this.divSegMonitoreo) {
      // actualizar
      this.funciones.alertaRetorno('question', '<strong>¿Está seguro de actualizar el registro?</strong>',
        '<div style="color: #E53935; font - weight: 400; "><strong>¡Importante!<br>Se eliminarán las Ampliaciones, Adelanto Directo, ' +
        'Cronograma y Valorizaciones relacionadas a este proyecto.</strong></div>', true,
        (respuesta) => {
          if (respuesta.value) {
            this.bMostrar = true;
            this.model.id_seguimiento_monitoreo_expediente = this.idSeguimientoMonitoreoExpediente;
            this.model.usuario_modificacion = sessionStorage.getItem('Usuario');

            const param = {
              id_seguimiento_ejecucion_expediente: this.model.id_seguimiento_monitoreo_expediente,
              id_fase: model.id_fase,
              fecha_inicio_contractual: this.funciones.formatDateAAAAMMDD(this.model.fecha_inicio_servicio),
              plazo_ejecucion: model.plazo_ejecucion,
              usuario_modificacion: sessionStorage.getItem('Usuario')
            };
            this.segExpService.modificarSeguimientoMonitoreo(param).subscribe(
              rpta => {
                if (rpta > 0) {
                  this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
                  this.consultaAuditoria('InformacionExpediente');
                  this.listarSeguimientoMonitoreoExpediente(this.idSeguimientoMonitoreoExpediente, this.bEstado);
                  this.router.navigate(['/ssi/monitoreo']);
                  this.eventInformacionExpediente.emit(param);
                } else {
                  this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
                }
              },
              error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
            );
          }
        });
    } else {
      // insertar
      this.bMostrar = true;
      const param = {
        id_seguimiento_ejecucion_expediente: 0,
        id_fase: model.id_fase,
        plazo_ejecucion: model.plazo_ejecucion,
        fecha_inicio_contractual: this.funciones.formatDateAAAAMMDD(this.model.fecha_inicio_servicio),
        usuario_creacion: sessionStorage.getItem('Usuario')
      };

      if (!this.bTramo) {
        this.segExpService.registrarSeguimientoMonitoreoExpediente(param).subscribe(
          (respuesta: number) => {
            if (respuesta > 0) {
              sessionStorage.setItem('idSeguimiento_registro', respuesta.toString());
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
              this.consultaAuditoria('InformacionExpediente');
              this.listarSeguimientoMonitoreoExpediente(respuesta, this.bEstado);
              this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
              param.id_seguimiento_ejecucion_expediente = respuesta;
              this.eventInformacionExpediente.emit(param);
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );

      } else {

      }
    }
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'InformacionExpediente') {
          this.UltimaActualizacionInfExpediente = this.obtenerDatosAuditoria('InformacionExpediente');
        } else if (pNombreTipoAuditoria == 'AvanceInforme') {
          this.UltimaActualizacionAvanceInforme = this.obtenerDatosAuditoria('AvanceInforme');
        } else if (pNombreTipoAuditoria == 'Paralizacion') {
          this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria('Paralizacion');
        }
      }
    );
  } 

  obtenerDatosAuditoria(pNombreAuditoria) {
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

  setFecTerContractual(fecha, dias) {
    if (dias != null) {
      dias = dias > 0 ? dias - 1 : dias;
      this.model.fecha_termino_contractual = this.funciones.SumDaytoDate(fecha, dias);
    } else {
      this.model.fecha_termino_contractual = this.fecha_termino_contractual_temporal;
    }
  }

  opnModRegAmpliacion() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        fecha_inicio_contractual: this.model.fecha_inicio_servicio,
        bEstado: this.bEstado
      },
      class: 'modal-ampliacion-plazo'
    };

    this.bsModalRef = this.modalService.show(ModalAmpliacionExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data: number) => {
        this.listarSeguimientoMonitoreoExpediente(data, this.bEstado);
      }
    );
  }

  opnModAdelantoDirecto() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado
      },
      class: 'modal-adelanto-directo-expediente'
    };

    this.bsModalRef = this.modalService.show(ModalAdelantoExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValorAdelanto.subscribe(
      (data: number) => {
        this.listarSeguimientoMonitoreoExpediente(data, this.bEstado);
      }
    );
  }

  opnModActaEntregaTerreno() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado
      },
      class: 'modal-adelanto-directo'
    };

    this.bsModalRef = this.modalService.show(ModalEntregaTerrenoComponent, this.config);
    this.bsModalRef.content.retornoValoresTerreno.subscribe(
      (data: number) => {
        this.listarSeguimientoMonitoreoExpediente(data, this.bEstado);
      }
    );
  }

  eventoInformacionExpediente(idSegExpediente) {
    this.eventInformacionExpediente.emit(idSegExpediente);
  }

  public get getMenuTabsComponents(): MenuTabsComponent {
    this.menuTabs = this.injector.get(MenuTabsComponent);
    return this.menuTabs;
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
