import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudAvanceInformesPreComponent } from '../modals/modal-crud-avance-informes-pre/modal-crud-avance-informes-pre.component';
import { AvanceInformePreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/avance-informe-preinversion.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-entregables-preinversion',
  templateUrl: './entregables-preinversion.component.html',
  styleUrls: ['./entregables-preinversion.component.css']
})
export class EntregablesPreinversionComponent implements OnInit {

  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() fecha_inicio_contractual: Date = null;
  @Input() idFase: number = 0;
  @Input() bEstado: boolean = true;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  lstAvanceInformePreinversion: any[] = [];
  totalAcumuladoPagado: number = 0;
  UltimaActualizacion: string = '';
  bsModal: BsModalRef;
  constructor(
    private modalSvc: BsModalService,
    private avanceInformeSvc: AvanceInformePreinversionService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions) { }

  ngOnInit() {
    this.listarRegistroAvanceInformePreinversion(1);
  }

  listarRegistroAvanceInformePreinversion(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.avanceInformeSvc.listarAvanceInformePreinversion(param).subscribe((data: any) => {
      // data = JSON.parse(data);
      this.totalRegistros = data.cantidad_registro;
      if (this.totalRegistros > 0) {
        this.lstAvanceInformePreinversion = data.avance_informe;
        this.totalAcumuladoPagado = data.total_acumulado_pagado;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('AvanceInforme');
      } else {
        this.lstAvanceInformePreinversion = [];
        this.totalAcumuladoPagado = 0;
      }
    });
  }

  nuevoRegistroEntregableEstudio() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        fecha_inicio_contractual: this.fecha_inicio_contractual,
        entidadEditar: null,
      },
    };
    this.bsModal = this.modalSvc.show(ModalCrudAvanceInformesPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarRegistroAvanceInformePreinversion(1);
        this.consultaAuditoria('AvanceInforme');
      }
    );
  }

  modificarEntregableEstudio(avanceEstudio: any) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        fecha_inicio_contractual: this.fecha_inicio_contractual,
        entidadEditar: avanceEstudio,
      },
    };
    this.bsModal = this.modalSvc.show(ModalCrudAvanceInformesPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarRegistroAvanceInformePreinversion(1);
        this.consultaAuditoria('AvanceInforme');
      }
    );
  }

  anularAvanceInformeEstudio(idAvanceInforme: number) {
    const param = { id_avance_informe: idAvanceInforme, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.avanceInformeSvc.anularAvanceInformePreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarRegistroAvanceInformePreinversion(1);
            this.consultaAuditoria('AvanceInforme');
          }
        });
      }
    });
  }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarRegistroAvanceInformePreinversion(paginaActual);
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

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
        if (pNombreTipoAuditoria == 'AvanceInforme') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('AvanceInforme');
        }
      }
    );
  }
}
