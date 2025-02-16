import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudAprobacionLiquidacionEstudioPreComponent } from '../modals/modal-crud-aprobacion-liquidacion-estudio-pre/modal-crud-aprobacion-liquidacion-estudio-pre.component';
import { LiquidacionPreinversionService } from 'projects/sspssi/src/servicios/preinversion/aprobacion-liquidacion/liquidacion-preinversion.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-aprobacion-liquidacion-elaboracion-pre',
  templateUrl: './aprobacion-liquidacion-elaboracion-pre.component.html',
  styleUrls: ['./aprobacion-liquidacion-elaboracion-pre.component.css']
})
export class AprobacionLiquidacionElaboracionPreComponent implements OnInit {

  bEstado: boolean = true;
  lstAprobacionLiquidacionEstudio: any[] = [];
  aprobado: boolean = false;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  bsModal: BsModalRef;
  UltimaActualizacion: string = '';
  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() idFase: number = 0;

  constructor(
    private modalSvc: BsModalService,
    private aprobacionLiquidacionPreSvc: LiquidacionPreinversionService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.listarAprobacionLiquidacionEstudio(1);
  }

  listarAprobacionLiquidacionEstudio(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };

    this.aprobacionLiquidacionPreSvc.listarAprobacionLiquidacionPreinversion(param).subscribe((data: any) => {
      this.totalRegistros = data.cantidad_registro;
      if (this.totalRegistros > 0) {
        this.aprobado = data.aprobado;
        this.lstAprobacionLiquidacionEstudio = data.liquidacion;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('Liquidacion');
      } else {
        this.lstAprobacionLiquidacionEstudio = [];
        this.aprobado = false;
      }
    });
  }

  nuevoRegistroAprobacionLiquidacionEstudio() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: null,
      },
    };
    this.bsModal = this.modalSvc.show(ModalCrudAprobacionLiquidacionEstudioPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarAprobacionLiquidacionEstudio(1);
        this.consultaAuditoria('Liquidacion');
      }
    );
  }

  modificarAprobacionLiquidacionEstudio(aprobacionLiquidacion: any) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: aprobacionLiquidacion,
      },
    };
    this.bsModal = this.modalSvc.show(ModalCrudAprobacionLiquidacionEstudioPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarAprobacionLiquidacionEstudio(1);
        this.consultaAuditoria('Liquidacion');
      }
    );
  }

  anularAprobacionLiquidacionEstudio(idAprobacionLiquidacion: number) {
    const param = { id_liquidacion: idAprobacionLiquidacion, usuario_eliminacion: this.usuario };

    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.aprobacionLiquidacionPreSvc.anularAprobacionLiquidacionPreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarAprobacionLiquidacionEstudio(1);
            this.consultaAuditoria('Liquidacion');
          }
        });
      }
    });
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarAprobacionLiquidacionEstudio(paginaActual);
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
        if (pNombreTipoAuditoria == 'Liquidacion') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('Liquidacion');
        }
      }
    );
  }
}
