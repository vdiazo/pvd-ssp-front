import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudProgramacionFinancieraPreComponent } from '../modals/modal-crud-programacion-financiera-pre/modal-crud-programacion-financiera-pre.component';
import { ProgramacionFinancieraService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/programacion-financiera.service';
import { data } from 'jquery';
import { Functions } from 'projects/sspssi/src/appSettings';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-cronograma-financiero-preinversion',
  templateUrl: './cronograma-financiero-preinversion.component.html',
  styleUrls: ['./cronograma-financiero-preinversion.component.css']
})
export class CronogramaFinancieroPreinversionComponent implements OnInit {

  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() fecha_inicio_contractual: Date = null;
  @Input() bEstado: boolean = true;
  @Input() idFase: number = 0;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  UltimaActualizacion: string = '';
  lstProgramacionFinancieraPreinversion: any[] = [];
  item: any[] = [];
  bsModal: BsModalRef;
  constructor(
    private modalSvc: BsModalService,
    private programacionFinancieraSvc: ProgramacionFinancieraService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions) { }

  ngOnInit() {
    this.listarProgramacionFinancieraPreinversion(1);
  }

  listarProgramacionFinancieraPreinversion(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.programacionFinancieraSvc.listarProgramacionFinancieraPreinversion(param).subscribe((data: any) => {
      this.totalRegistros = data.cantidad_registro;
      if (this.totalRegistros > 0) {
        this.lstProgramacionFinancieraPreinversion = data.programacion_financiera;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('ProgramacionFinanciera');
      } else {
        this.lstProgramacionFinancieraPreinversion = [];
      }
    });
  }

  nuevoRegistroProgramacionFinancieraPre() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: null,
        fecha_inicio_contractual: this.fecha_inicio_contractual
      },
      class: 'modal-cronograma',
    };
    this.bsModal = this.modalSvc.show(ModalCrudProgramacionFinancieraPreComponent, config);

    this.bsModal.content.retornoValoresFinanciero.subscribe(
      () => {
        this.listarProgramacionFinancieraPreinversion(1);
        this.consultaAuditoria('ProgramacionFinanciera');
      }
    );
  }

  modificarProgramacionFinancieraPre(cronogramaFinanciero: any) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: cronogramaFinanciero
      },
      class: 'modal-cronograma',
    };
    this.bsModal = this.modalSvc.show(ModalCrudProgramacionFinancieraPreComponent, config);

    this.bsModal.content.retornoValoresFinanciero.subscribe(
      () => {
        this.listarProgramacionFinancieraPreinversion(1);
        this.consultaAuditoria('ProgramacionFinanciera');
      }
    );
  }

  anularProgramacionFinancieraPre(idProgramacionFinanciera: number) {
    const param = { id_programacion_financiera: idProgramacionFinanciera, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.programacionFinancieraSvc.anularProgramacionFinancieraPreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarProgramacionFinancieraPreinversion(1);
            this.consultaAuditoria('ProgramacionFinanciera');
          }
        });
      }
    });
  }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarProgramacionFinancieraPreinversion(paginaActual);
  }

  openDetails(item) {
    if (item.is_open) {
      item.is_open = false;
    } else {
      item.is_open = true;
    }
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
        if (pNombreTipoAuditoria == 'ProgramacionFinanciera') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('ProgramacionFinanciera');
        }
      }
    );
  }
}
