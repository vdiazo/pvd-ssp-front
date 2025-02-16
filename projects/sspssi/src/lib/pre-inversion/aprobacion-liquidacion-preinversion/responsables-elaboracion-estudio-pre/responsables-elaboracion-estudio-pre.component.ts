import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudResponsablesElabEstudioPreComponent } from '../modals/modal-crud-responsables-elab-estudio-pre/modal-crud-responsables-elab-estudio-pre.component';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ResponsablesElaboracionPreinversionService } from 'projects/sspssi/src/servicios/preinversion/aprobacion-liquidacion/responsables-elaboracion-preinversion.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-responsables-elaboracion-estudio-pre',
  templateUrl: './responsables-elaboracion-estudio-pre.component.html',
  styleUrls: ['./responsables-elaboracion-estudio-pre.component.css']
})
export class ResponsablesElaboracionEstudioPreComponent implements OnInit {

  bEstado: boolean = true;
  lstResponsableElaboracionEstudio: any[] = [];
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  bsModal: BsModalRef;
  UltimaActualizacion: string = '';
  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() idFase: number = 0;

  constructor(
    private modalSvc: BsModalService,
    private responsableElaboracionSvc: ResponsablesElaboracionPreinversionService,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    public funciones: Functions,
    public _DomSanitizationService: DomSanitizer
  ) { }

  ngOnInit() {
    this.listarResponsableElaboracionEstudio(1);
  }

  listarResponsableElaboracionEstudio(pagina: number) {
    const param = { id_seguimiento: this.idSeguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.responsableElaboracionSvc.listarResponsableElaboracionEstudioPreinversion(param).subscribe(
      (data: any) => {
        this.totalRegistros = data.cantidad;
        if (this.totalRegistros > 0) {
          this.lstResponsableElaboracionEstudio = data.responsable_elaboracion;
          this.UltimaActualizacion = this.obtenerDatosAuditoria('ResponsableElaboracion');
        } else {
          this.lstResponsableElaboracionEstudio = [];
        }
      }
    );
  }
  nuevoRegistroResponsableElaboracionEstudio() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        bEstado: this.bEstado,
        entidadEditar: null,
      }
    };
    this.bsModal = this.modalSvc.show(ModalCrudResponsablesElabEstudioPreComponent, config);

    this.bsModal.content.retornoValores.subscribe(
      () => {
        this.listarResponsableElaboracionEstudio(1);
        this.consultaAuditoria('ResponsableElaboracion');
      }
    );
  }

  anularResponsableElaboracionEstudio(idResponsableElaboracionEstudio: number) {
    const param = { id_responsable_elaboracion: idResponsableElaboracionEstudio, usuario_eliminacion: this.usuario };

    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.responsableElaboracionSvc.anularResponsableElaboracionEstudioPreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarResponsableElaboracionEstudio(1);
            this.consultaAuditoria('ResponsableElaboracion');
          }
        });
      }
    });
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarResponsableElaboracionEstudio(paginaActual);
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
        if (pNombreTipoAuditoria == 'ResponsableElaboracion') {
          this.UltimaActualizacion = this.obtenerDatosAuditoria('ResponsableElaboracion');
        }
      }
    );
  }
}
