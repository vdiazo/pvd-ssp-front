import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudAccionMonitoreoPreComponent } from '../modals/modal-crud-accion-monitoreo-pre/modal-crud-accion-monitoreo-pre.component';
import { AccionSeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/accion-seguimiento-preinversion.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-acciones-seguimiento-preinversion',
  templateUrl: './acciones-seguimiento-preinversion.component.html',
  styleUrls: ['./acciones-seguimiento-preinversion.component.css']
})
export class AccionesSeguimientoPreinversionComponent implements OnInit {

  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() fecha_inicio_contractual: Date = null;
  @Input() bEstado: boolean = true;
  @Input() idFase: number = 0;
  lstAccionMonitoreoPreinversion: any[] = [];
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  UltimaActualizacion: string = '';
  item: any[] = [];
  bsModal: BsModalRef;

  constructor(
    private modalSvc: BsModalService,
    private accionMonitoreoPreSvc: AccionSeguimientoPreinversionService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.listarAccionMonitoreoPreinversion(1);
  }

  listarAccionMonitoreoPreinversion(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.accionMonitoreoPreSvc.listarAccionMonitoreoPreinversion(param).subscribe((data: any) => {
      //data = JSON.parse(data);
      this.totalRegistros = data.cantidad_registro;
      if (this.totalRegistros > 0) {
        this.lstAccionMonitoreoPreinversion = data.accion_monitoreo;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('AccionMonitoreo');
      } else {
        this.lstAccionMonitoreoPreinversion = [];
      }
    });
  }

  nuevoRegistroAccionMonitoreoEstudio() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        id_fase: this.idFase,
        bEstado: this.bEstado,
        entidadEditar: null,
      },
      class: 'modal-accion-monitoreo',
    };
    this.bsModal = this.modalSvc.show(ModalCrudAccionMonitoreoPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarAccionMonitoreoPreinversion(1);
        this.consultaAuditoria('AccionMonitoreo');
      }
    );
  }

  modificarAccionMonitoreoEstudio(accion: any) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        id_fase: this.idFase,
        bEstado: this.bEstado,
        entidadEditar: accion,
      },
      class: 'modal-accion-monitoreo',
    };
    this.bsModal = this.modalSvc.show(ModalCrudAccionMonitoreoPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarAccionMonitoreoPreinversion(1);
        this.consultaAuditoria('AccionMonitoreo');
      }
    );
  }

  anularAccionMonitoreoEstudio(idAccionMonitoreo: number) {
    const param = { id_accion_monitoreo: idAccionMonitoreo, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.accionMonitoreoPreSvc.anularAccionMonitoreoPreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarAccionMonitoreoPreinversion(1);
            this.consultaAuditoria('AccionMonitoreo');
          }
        });
      }
    });
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarAccionMonitoreoPreinversion(paginaActual);
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
        if (pNombreTipoAuditoria == 'AccionMonitoreo') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('AccionMonitoreo');
        }
      }
    );
  }
}
