import { Component, OnInit, ViewChild } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SeguimientoMonitoreoExpediente } from 'projects/sspssi/src/models/expediente/seguimiento-monitoreo/seguimiento-monitoreo-expediente.model';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { EntregablesExpedienteComponent } from './entregables-expediente/entregables-expediente.component';

@Component({
  selector: 'ssi-seguimiento-expediente',
  templateUrl: './seguimiento-expediente.component.html',
  styleUrls: ['./seguimiento-expediente.component.css']
})
export class SeguimientoExpedienteComponent implements OnInit {

  UltimaActualizacionInfExpediente = '';
  UltimaActualizacionValorizacion = '';

  separator = '';
  divSegMonitoreo = false; // comienza en false
  bsModalRef: BsModalRef;
  isOpen = true;
  model: SeguimientoMonitoreoExpediente;
  // model_Accion_Paralizacion: ParalizacionAccion;
  plazo_ejecucion = 0;
  guid = '';
  parametro: string;
  idProyecto: number;
  idFase: number;
  idTramo: number;
  codSnip: number;
  idSeguimientoMonitoreo: number;

  fecha_termino_contractual_temporal: Date;
  segMonitoreo: number;
  bTramo = false;
  Proyecto;
  Nombre_Proyecto: string;

  totalAccionSeguimientoMonitoreo = 0;
  has_seguimientoMonitoreoExpediente = false;
  bValorizacion = false;
  bParalizacion = false;
  bAvanceInforme = false;
  fecha_inicio_contractual: Date;
  @ViewChild(EntregablesExpedienteComponent) avance: EntregablesExpedienteComponent;

  constructor(public funciones: Functions, private route: ActivatedRoute, private sMant: MaestraSsiService) {
    this.model = new SeguimientoMonitoreoExpediente();
  }

  ngOnInit() {
    this.idFase = this.route.snapshot.params.idFase;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.codSnip = this.route.snapshot.params.snip;

    if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
      if (sessionStorage.getItem('idSeguimiento_registro') != undefined && sessionStorage.getItem('idSeguimiento') == undefined) {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      } else {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento_registro'), 10);
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo, 10);
    }

    this.has_seguimientoMonitoreoExpediente = this.idSeguimientoMonitoreo != 0;

    // validar acordeones valorizacion y paralizacion
    if (this.idSeguimientoMonitoreo > 0) {
      this.bValorizacion = true;
      this.bParalizacion = true;
      this.divSegMonitoreo = true;
    } else {
      this.bValorizacion = false;
      this.bParalizacion = false;
      this.divSegMonitoreo = false;
    }
    this.idProyecto = this.route.snapshot.params.idProyecto;

    if (this.idFase === 0 && this.idSeguimientoMonitoreo === 0) {
      this.bTramo = true;
    } else {
      this.bTramo = false;
    }

    // Datos Auditoria
    this.UltimaActualizacionInfExpediente = this.obtenerDatosAuditoria('InformacionExpediente');
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria('Valorizaciones');
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

  setIdSegMonitoreo(respuesta) {
    this.divSegMonitoreo = respuesta.id_seguimiento_ejecucion_expediente > 0;
    this.idSeguimientoMonitoreo = respuesta.id_seguimiento_ejecucion_expediente;
    this.fecha_inicio_contractual = respuesta.fecha_inicio_contractual;
  }

  actualizaSeguimientoInforme(respuesta) {
    if (respuesta) {
      this.avance.listarAvanceInformeExpediente(this.idSeguimientoMonitoreo, this.codSnip, this.idFase, 5, 0);
    }
  }
}
