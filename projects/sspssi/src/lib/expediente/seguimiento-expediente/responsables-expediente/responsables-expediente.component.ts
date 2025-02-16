import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalContratistaExpedienteComponent } from './modal-contratista-expediente/modal-contratista-expediente.component';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { ModalAdministradorExpedienteComponent } from './modal-administrador-expediente/modal-administrador-expediente.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ResponsablesExpedienteService } from 'projects/sspssi/src/servicios/expediente/responsables/responsables-expediente.service';

@Component({
  selector: 'ssi-responsables-expediente',
  templateUrl: './responsables-expediente.component.html',
  styleUrls: ['./responsables-expediente.component.css']
})
export class ResponsablesExpedienteComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  rptaResponsable: any;
  contratistaExpediente;
  administradorContrato;

  UltimaActualizacionContratista = '';
  UltimaActualizacionAdministradorContrato = '';

  config;
  bsModalContratistaExpRef: BsModalRef;
  bsModalAdministradorExpedienteRef: BsModalRef;

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() fecha_inicio_contractual: Date;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private sMant: MaestraSsiService, public funciones: Functions, private responsablesService: ResponsablesExpedienteService) { }

  ngOnInit() {
    this.setearIdSeguimientoMonitoreo();
    this.listarResponsables(this.id_seguimientoMonitoreoExpediente);
    this.UltimaActualizacionContratista = this.obtenerDatosAuditoria('Contratista');
    this.UltimaActualizacionAdministradorContrato = this.obtenerDatosAuditoria('AdmContrato');
  }

  setearIdSeguimientoMonitoreo() {
    if (this.idSeguimientoMonitoreoExpediente == 0) {
      this.id_seguimientoMonitoreoExpediente = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
      if (isNaN(this.id_seguimientoMonitoreoExpediente)) {
        this.id_seguimientoMonitoreoExpediente = 0;
      }
    } else {
      this.id_seguimientoMonitoreoExpediente = this.idSeguimientoMonitoreoExpediente;
    }
  }

  listarResponsables(id_segMonitoreoExpediente: number) {
    this.responsablesService.listarResponsablesExpediente(id_segMonitoreoExpediente).subscribe(
      data => {
        this.rptaResponsable = data as any;
        this.administradorContrato = this.rptaResponsable[0].adm_contrato != '' ? `${this.rptaResponsable[0].adm_contrato[0].apellido_paterno.toUpperCase()} ${this.rptaResponsable[0].adm_contrato[0].apellido_materno.toUpperCase()}, ${this.rptaResponsable[0].adm_contrato[0].nombres.toUpperCase()}` : '';
        this.contratistaExpediente = this.rptaResponsable[0].contratista != '' ? `${this.rptaResponsable[0].contratista[0].razon_social.toUpperCase()}` : '';
      }
    );
  }

  openModalContratista() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.id_seguimientoMonitoreoExpediente,
        bEstado: this.bEstado
      }
    };
    this.bsModalContratistaExpRef = this.modalService.show(ModalContratistaExpedienteComponent, this.config);

    this.bsModalContratistaExpRef.content.emitResponsableContratista.subscribe(
      data => {
        this.listarResponsables(data);
        this.consultaAuditoria('Contratista');
      }
    )
  }

  openModalAdministradorExpediente() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.id_seguimientoMonitoreoExpediente,
        fecha_inicio_contractual: this.fecha_inicio_contractual,
        bEstado: this.bEstado
      }
    };
    this.bsModalAdministradorExpedienteRef = this.modalService.show(ModalAdministradorExpedienteComponent, this.config);

    this.bsModalAdministradorExpedienteRef.content.emitResponsableAdministrador.subscribe(
      data => {
        this.listarResponsables(data);
        this.consultaAuditoria('AdmContrato');
      }
    )
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
        if (pNombreTipoAuditoria == 'Contratista') {
          this.UltimaActualizacionContratista = this.obtenerDatosAuditoria('Contratista');
        } else if (pNombreTipoAuditoria == 'AdmContrato') {
          this.UltimaActualizacionAdministradorContrato = this.obtenerDatosAuditoria('AdmContrato');
        }
      }
    );
  }
}
