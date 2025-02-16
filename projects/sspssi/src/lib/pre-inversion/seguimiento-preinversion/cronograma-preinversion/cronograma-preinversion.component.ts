import { Component, OnInit, Input } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCrudProgramacionEstudioPreComponent } from '../modals/modal-crud-programacion-estudio-pre/modal-crud-programacion-estudio-pre.component';
import { CronogramaPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/cronograma-preinversion.service';
import { data } from 'jquery';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-cronograma-preinversion',
  templateUrl: './cronograma-preinversion.component.html',
  styleUrls: ['./cronograma-preinversion.component.css']
})
export class CronogramaPreinversionComponent implements OnInit {

  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() fecha_inicio_contractual: Date = null;
  @Input() bEstado: boolean = true;
  @Input() idFase: number = 0;
  lstCronogramaPreinversion: any[] = [];
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  UltimaActualizacion: string = '';
  item: any[] = [];
  bsModal: BsModalRef;

  constructor(
    private modalSvc: BsModalService,
    private programacionPreSvc: CronogramaPreinversionService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions) { }

  ngOnInit() {
    this.listarProgramacionPreinversion(1);
  }

  listarProgramacionPreinversion(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.programacionPreSvc.listarProgramacionPreinversion(param).subscribe((data: any) => {
      this.totalRegistros = data.cantidad;
      if (this.totalRegistros > 0) {
        this.lstCronogramaPreinversion = data.programacion;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('Programacion');
      } else {
        this.lstCronogramaPreinversion = [];
      }
    });
  }

  nuevoRegistroProgramacionEstudio() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: null,
        fecha_inicio_contractual: this.fecha_inicio_contractual
      }
    };
    this.bsModal = this.modalSvc.show(ModalCrudProgramacionEstudioPreComponent, config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarProgramacionPreinversion(1);
        this.consultaAuditoria('Programacion');
      }
    );
  }

  modificarRegistroProgramacionEstudio(cronograma: any) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: cronograma,
        fecha_inicio_contractual: this.fecha_inicio_contractual
      }
    };
    this.bsModal = this.modalSvc.show(ModalCrudProgramacionEstudioPreComponent, config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarProgramacionPreinversion(1);
        this.consultaAuditoria('Programacion');
      }
    );
  }

  anularProgramacionEstudio(idProgramacion: number) {
    const param = { id_programacion: idProgramacion, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.programacionPreSvc.anularProgramacionPreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarProgramacionPreinversion(1);
            this.consultaAuditoria('Programacion');
          }
        });
      }
    });
  }

  openDetails(item) {
    if (item.is_open) {
      item.is_open = false;
    } else {
      item.is_open = true;
    }
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarProgramacionPreinversion(paginaActual);
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
        if (pNombreTipoAuditoria == 'Programacion') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('Programacion');
        }
      }
    );
  }
}
