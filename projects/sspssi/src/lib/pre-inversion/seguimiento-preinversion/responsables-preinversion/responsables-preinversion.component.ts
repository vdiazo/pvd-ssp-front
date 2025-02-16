import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudResponsablesPreComponent } from '../modals/modal-crud-responsables-pre/modal-crud-responsables-pre.component';
import { ResponsablesPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/responsables-preinversion.service';
import { ModalCrudContratistaPreComponent } from '../modals/modal-crud-contratista-pre/modal-crud-contratista-pre.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-responsables-preinversion',
  templateUrl: './responsables-preinversion.component.html',
  styleUrls: ['./responsables-preinversion.component.css']
})
export class ResponsablesPreinversionComponent implements OnInit {

  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() fecha_inicio_contractual: Date = null;
  @Input() bEstado: boolean = true;
  @Input() idFase: number = 0;
  administrador: string = '';
  contratista: string = '';
  bsModal: BsModalRef;
  UltimaActualizacionContratista: string = '';
  UltimaActualizacionAdministrador: string = '';

  constructor(private modalSvc: BsModalService, private responsableSvc: ResponsablesPreinversionService, private seguimientoPreSvc: SeguimientoPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.listarResponsablesEstudioUltimoRegistro();
  }

  listarResponsablesEstudioUltimoRegistro() {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion };
    this.responsableSvc.listarResponsablesUltimoRegistroPreInv(param).subscribe((data: any) => {
      this.administrador = data.administrador.length > 0 ? data.administrador[0].nombre_completo : '';
      this.contratista = data.contratista.length > 0 ? data.contratista[0].razon_social : '';
      this.UltimaActualizacionContratista = data.contratista.length > 0 ? this.obtenerDatosAuditoria('Contratista') : '';
      this.UltimaActualizacionAdministrador = data.administrador.length > 0 ? this.obtenerDatosAuditoria('Responsable') : '';
    })
  }

  opnModRegResponsable() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        id_tipo_responsable: 4,
        cod_responsable: 'TR004'
      }
    };
    this.bsModal = this.modalSvc.show(ModalCrudResponsablesPreComponent, config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarResponsablesEstudioUltimoRegistro();
        this.consultaAuditoria('Responsable');
      }
    );
  }

  opnModRegContratista() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
      }
    };
    this.bsModal = this.modalSvc.show(ModalCrudContratistaPreComponent, config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarResponsablesEstudioUltimoRegistro();
        this.consultaAuditoria('Contratista');
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

  consultaAuditoria(pNombreTipoAuditoria) {
    const param = { id_fase: this.idFase };
    this.seguimientoPreSvc.listarAuditoriaPreinversion(param).subscribe(
      (respuesta: any) => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'Contratista') {
          this.UltimaActualizacionContratista = this.obtenerDatosAuditoria('Contratista');
        } else if (pNombreTipoAuditoria == 'Responsable') {
          this.UltimaActualizacionAdministrador = this.obtenerDatosAuditoria('Responsable');
        }
      }
    );
  }
}
