import { Component, OnInit, Input } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAccionSeguimientoExpedienteComponent } from './modal-accion-seguimiento-expediente/modal-accion-seguimiento-expediente.component';
import { AccionesSeguimientoExpedienteService } from 'projects/sspssi/src/servicios/expediente/avance-expediente/acciones-seguimiento-expediente.service';

@Component({
  selector: 'ssi-acciones-seguimiento-expediente',
  templateUrl: './acciones-seguimiento-expediente.component.html',
  styleUrls: ['./acciones-seguimiento-expediente.component.css']
})
export class AccionesSeguimientoExpedienteComponent implements OnInit {

  UltimaActualizacion: string;
  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() idFase: number;
  @Input() bEstado: boolean;

  rptaAccionesSeguimientoExpediente: any = [];
  listaAccionesSeguimientoExpediente: any = [];
  bsModalRef: BsModalRef;
  config;
  totalRegistros: number;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;

  constructor(public funciones: Functions, private modalService: BsModalService, private accionMonitoreoService: AccionesSeguimientoExpedienteService) { }

  ngOnInit() {
    this.listarAccionSeguimiento(this.idSeguimientoMonitoreoExpediente, this.idFase, this.numPaginasMostrar, this.paginaActiva);

  }

  listarAccionSeguimiento(idSeguimiento: number, idFase: number, nroPagina: number, nroPaginaMostrar: number) {
    this.accionMonitoreoService.listarAccionSeguimientoMonitoreoExpediente(idSeguimiento, idFase, nroPagina, nroPaginaMostrar).subscribe(
      data => {
        this.rptaAccionesSeguimientoExpediente = data;
        this.totalRegistros = this.rptaAccionesSeguimientoExpediente[0].cantidad;
        if (this.totalRegistros > 0) {
          this.listaAccionesSeguimientoExpediente = this.rptaAccionesSeguimientoExpediente[0].acciones_monitoreo;
        } else {
          this.listaAccionesSeguimientoExpediente = [];
        }
      }
    );
  }

  nuevoRegistroSeguimientoExp() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        id_fase: this.idFase,
        bEstado: this.bEstado,
        entidadEditar: null
      },
      class: 'modal-accion-monitoreo',
    };

    this.bsModalRef = this.modalService.show(ModalAccionSeguimientoExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAccion.subscribe(
      (data: number) => {
        this.listarAccionSeguimiento(data, this.idFase, this.numPaginasMostrar, this.paginaActiva);
      }
    );
  }

  editarFilaAccion(accionSeguimiento: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        id_fase: this.idFase,
        bEstado: this.bEstado,
        entidadEditar: accionSeguimiento
      },
      class: 'modal-accion-monitoreo',
    };

    this.bsModalRef = this.modalService.show(ModalAccionSeguimientoExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAccion.subscribe(
      (data: number) => {
        this.listarAccionSeguimiento(data, this.idFase, this.numPaginasMostrar, this.paginaActiva);
      }
    );
  }

  eliminarFilaAccion(idAccion: number) {
    const param = {
      id_accion_seguimiento_ejecucion_expediente: idAccion,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.accionMonitoreoService.anularAccionSeguimientoMonitoreoExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarAccionSeguimiento(this.idSeguimientoMonitoreoExpediente, this.idFase, this.numPaginasMostrar, this.paginaActiva);
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarAccionSeguimiento(this.idSeguimientoMonitoreoExpediente, this.idFase, this.numPaginasMostrar, this.paginaActiva);
  }
}
