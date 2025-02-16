import { Component, OnInit, Input } from '@angular/core';
import { ModalSupervisorComponent } from '../modales/modal-supervisor/modal-supervisor.component';
import { ModalInspectorComponent } from '../modales/modal-inspector/modal-inspector.component';
import { FacadeService } from '../../patterns/facade.service';
import { Funciones } from '../../../appSettings/funciones';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalSupervisorEstudioComponent } from '../modales/modal-supervisor-estudio/modal-supervisor-estudio.component';


@Component({
  selector: 'set-asignacion-responsable-exp-tec',
  templateUrl: './asignacion-responsable-exp-tec.component.html',
  styleUrls: ['./asignacion-responsable-exp-tec.component.css']
})
export class AsignacionResponsableExpTecComponent implements OnInit {
  UltimaActualizacionSupervisor: string = "";
  UltimaActualizacionResidente: string = "";
  UltimaActualizacionInspector: string = "";
  config;
  bsModalSupervisorRef: BsModalRef;
  bsModalResidenteRef: BsModalRef;
  bsModalInspectorRef: BsModalRef;

  bsModalSupervisorEstudioRef: BsModalRef;
  // id_seguimientoMonitoreoObra: number;
  rptaResponsable;
  supervisor;
  supervisorEstudio;
  residente;
  inspector;
  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;
  @Input() id_seguimientoMonitoreoObra: number;
  @Input() bEstadoHistorial: boolean;

  constructor(
    private modalService: BsModalService, 
    private fs: FacadeService,
     public funciones: Funciones) { }

  ngOnInit() {
    this.setearIdSeguimientoMonitoreo();
    this.listarResponsables(this.id_seguimientoMonitoreoObra);
    //Datos Auditoria
    this.UltimaActualizacionSupervisor = this.obtenerDatosAuditoria("Supervisor");
    this.UltimaActualizacionResidente = this.obtenerDatosAuditoria("Residente");
    this.UltimaActualizacionInspector = this.obtenerDatosAuditoria("Inspector");
  }


  setearIdSeguimientoMonitoreo() {
    if (this.idSeguimientoMonitoreoObra == 0) {
      this.id_seguimientoMonitoreoObra = parseInt(sessionStorage.getItem("idSeguimiento"));
      if (isNaN(this.id_seguimientoMonitoreoObra)) {
        this.id_seguimientoMonitoreoObra = 0;
      }
    } else {
      this.id_seguimientoMonitoreoObra = parseInt(this.idSeguimientoMonitoreoObra);
    }
  }

  listarResponsables(idSegMonObra) {
    this.fs.maestraService.listarResponsables(idSegMonObra).subscribe(
      respuesta => {
        this.rptaResponsable = respuesta as any;
        this.supervisor =this.rptaResponsable[0].supervisor != null ? this.rptaResponsable[0].supervisor[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].supervisor[0].nombres.toUpperCase() : "";
        this.residente = this.rptaResponsable[0].residente != null ? this.rptaResponsable[0].residente[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].residente[0].nombres.toUpperCase() : "";
        this.inspector = this.rptaResponsable[0].inspector != null ? this.rptaResponsable[0].inspector[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].inspector[0].nombres.toUpperCase() : "";
        this.supervisorEstudio=this.rptaResponsable[0].supervisorestudio != null ? this.rptaResponsable[0].supervisorestudio[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].supervisorestudio[0].nombres.toUpperCase() : "";
      }
    )
  }


  openModalInspector() {
    this.setearIdSeguimientoMonitoreo();
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
      initialState: {
        //id_seguimientoMonitoreoObra:12,
        id_seguimientoEjecucionExpediente:this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalInspectorRef = this.modalService.show(ModalInspectorComponent, this.config);
    this.bsModalInspectorRef.content.emitResponsable.subscribe(
        data => {
          this.listarResponsables(data);
          //this.consultaAuditoria("Inspector");
          }
        )
  } 

  openModalSupervisor() {
    this.setearIdSeguimientoMonitoreo();
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
      initialState: {
        id_seguimientoMonitoreoExpediente:this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalInspectorRef = this.modalService.show(ModalSupervisorComponent, this.config);
    this.bsModalInspectorRef.content.emitResponsable.subscribe(
      data => {
        this.listarResponsables(data);
      }
    )
  }

  openModalSupervisorEstudio() {
    this.setearIdSeguimientoMonitoreo();
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
      initialState: {
        id_seguimientoMonitoreoExpediente:this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalSupervisorEstudioRef = this.modalService.show(ModalSupervisorEstudioComponent, this.config);
    this.bsModalSupervisorEstudioRef.content.emitResponsable.subscribe(
      data => {
        this.listarResponsables(data);
      }
    )
  }













  obtenerDatosAuditoria(pNombreAuditoria) {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return " " + (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        return "";
      }
    }
    //Fin
  }
  /*consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == "Supervisor") {
          this.UltimaActualizacionSupervisor = this.obtenerDatosAuditoria("Supervisor");
        } else if (pNombreTipoAuditoria == "Residente") {
          this.UltimaActualizacionResidente = this.obtenerDatosAuditoria("Residente");
        } else if (pNombreTipoAuditoria == "Inspector") {
          this.UltimaActualizacionInspector = this.obtenerDatosAuditoria("Inspector");
        }
      }
    );
  }*/

}
