import { Component, OnInit, Input } from '@angular/core';
import { ModalSupervisorComponent } from './modal-supervisor/modal-supervisor.component';
import { ModalResidenteComponent } from './modal-residente/modal-residente.component';
import { ModalInspectorComponent } from './modal-inspector/modal-inspector.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from '../../../patterns/facade.service';
import { MaestraService } from '../../../services/maestra.service';
import { Functions } from '../../../appSettings/functions';

@Component({
  selector: 'app-asignacion-responsable',
  templateUrl: './asignacion-responsable.component.html',
  styleUrls: ['./asignacion-responsable.component.css']
})
export class AsignacionResponsableComponent implements OnInit {
  UltimaActualizacionSupervisor: string = "";
  UltimaActualizacionResidente: string = "";
  UltimaActualizacionInspector: string = "";
  config;
  bsModalSupervisorRef: BsModalRef;
  bsModalResidenteRef: BsModalRef;
  bsModalInspectorRef: BsModalRef;
  id_seguimientoMonitoreoObra: number;
  rptaResponsable;
  supervisor;
  residente;
  inspector;
  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private fs: FacadeService, private sMant: MaestraService, public funciones: Functions) { }

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
        this.supervisor = this.rptaResponsable[0].supervisor != null ? this.rptaResponsable[0].supervisor[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].supervisor[0].nombres.toUpperCase() : "";
        this.residente = this.rptaResponsable[0].residente != null ? this.rptaResponsable[0].residente[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].residente[0].nombres.toUpperCase() : "";
        this.inspector = this.rptaResponsable[0].inspector != null ? this.rptaResponsable[0].inspector[0].apellidos.toUpperCase() + ", " + this.rptaResponsable[0].inspector[0].nombres.toUpperCase() : "";
      }
    )
  }

  openModalSupervisor() {
    this.setearIdSeguimientoMonitoreo();

    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalSupervisorRef = this.modalService.show(ModalSupervisorComponent, this.config);
    this.bsModalSupervisorRef.content.emitResponsable.subscribe(
      data => {
        this.listarResponsables(data);
        this.consultaAuditoria("Supervisor");
      }
    )
  }

  openModalResidente() {
    this.setearIdSeguimientoMonitoreo();

    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalResidenteRef = this.modalService.show(ModalResidenteComponent, this.config);
    this.bsModalResidenteRef.content.emitResponsable.subscribe(
      data => {
        this.listarResponsables(data);
        this.consultaAuditoria("Residente");
      }
    )
  }

  openModalInspector() {
    this.setearIdSeguimientoMonitoreo();

    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.id_seguimientoMonitoreoObra,
        bEstado: this.bEstado
      }
    };

    this.bsModalInspectorRef = this.modalService.show(ModalInspectorComponent, this.config);
    this.bsModalInspectorRef.content.emitResponsable.subscribe(
      data => {
        this.listarResponsables(data);
        this.consultaAuditoria("Inspector");
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
  consultaAuditoria(pNombreTipoAuditoria) {
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
  }
}
