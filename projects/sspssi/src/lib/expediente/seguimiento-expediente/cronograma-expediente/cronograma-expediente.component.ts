import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCronogramaExpedienteComponent } from './modal-cronograma-expediente/modal-cronograma-expediente.component';
import { CronogramaAvanceService } from 'projects/sspssi/src/servicios/expediente/cronograma-expediente/cronograma-avance.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'ssi-cronograma-expediente',
  templateUrl: './cronograma-expediente.component.html',
  styleUrls: ['./cronograma-expediente.component.css']
})
export class CronogramaExpedienteComponent implements OnInit {

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() guid: string;
  @Input() fecha_inicio_contractual: Date;
  @Input() bEstado: boolean;
  @Output() actualizaValores = new EventEmitter();
  UltimaActualizacionCronograma: string;
  editarFila: boolean;
  codigoEditar = 0;
  rptaCronogramaExpediente: any = [];
  listaCronogramaEntregable: any = [];
  listaInformesCronograma: any = [];
  listaComponentesCronograma: any = [];
  listaEntregablesCronograma: any = [];
  totalAvanceProgramado: number;
  verDetalle = false;
  bsModalCronogramaExpedienteRef: BsModalRef;
  config;
  totalRegistro = 0;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;

  constructor(public funciones: Functions, private modalService: BsModalService, private sMant: MaestraSsiService, private cronogramaExpedienteService: CronogramaAvanceService) { }

  ngOnInit() {
    this.listarCronogramaEntregables(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.UltimaActualizacionCronograma = this.obtenerDatosAuditoria('CronogramaInforme');
  }

  listarCronogramaEntregables(id_Seguimiento: number, nroFilas: number, numeroPagina: number) {
    this.cronogramaExpedienteService.listarCronogramaExpediente(id_Seguimiento, nroFilas, numeroPagina).subscribe(
      data => {
        this.rptaCronogramaExpediente = data;
        this.totalRegistro = this.rptaCronogramaExpediente.cantidad;
        if (this.totalRegistro > 0) {
          this.listaCronogramaEntregable = this.rptaCronogramaExpediente.cronograma;
          const tempCronograma = this.sumarPorcentajeAvance(this.listaCronogramaEntregable);
          this.listaCronogramaEntregable = tempCronograma;
        } else {
          this.listaCronogramaEntregable = [];
        }
      }
    );
  }

  nuevoRegistroCronogramaExpTec() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        entidadEditar: null,
      }
    };
    this.bsModalCronogramaExpedienteRef = this.modalService.show(ModalCronogramaExpedienteComponent, this.config);
    this.bsModalCronogramaExpedienteRef.content.retornoValoresCronograma.subscribe(
      data => {
        this.listarCronogramaEntregables(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('CronogramaInforme');
      }
    );
  }

  editarFilaCronograma(cronograma: any) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        entidadEditar: cronograma,
      }
    };
    this.bsModalCronogramaExpedienteRef = this.modalService.show(ModalCronogramaExpedienteComponent, this.config);
    this.bsModalCronogramaExpedienteRef.content.retornoValoresCronograma.subscribe(
      data => {
        this.listarCronogramaEntregables(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('CronogramaInforme');
        this.actualizaValores.emit(true);
      }
    );
  }

  anularFilaCronograma(cronogramaAnular: any) {
    cronogramaAnular.activo = false;
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.cronogramaExpedienteService.modificarCronogramaExpediente(cronogramaAnular).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarCronogramaEntregables(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
              this.consultaAuditoria('CronogramaInforme');
              this.actualizaValores.emit(true);
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  verDetalleCronograma(idCronograma: number) {
    if (!this.verDetalle) {
      this.verDetalle = true;
      this.editarFila = true;
      this.codigoEditar = idCronograma;
    } else {
      this.verDetalle = false;
      this.editarFila = false;
      this.codigoEditar = 0;
    }
  }

  cambiarPaginaCronogramaEntregable(pagina) {
    this.verDetalle = false;
    this.editarFila = false;
    this.codigoEditar = 0;
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarCronogramaEntregables(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.numero_Pagina);
  }

  sumarDiasFecha(fechaInicio: Date, plazoEntrega: number) {
    return this.funciones.SumDaytoDate(fechaInicio, plazoEntrega);
  }

  sumarPorcentajeAvance(cronograma: any) {
    cronograma.forEach(element => {
      let informe = element.informe;
      let acumPorcentaje = 0;
      informe.forEach(avance => {
        acumPorcentaje += avance.porcentaje;
      });
      element.totalAvanceProgramado = acumPorcentaje;
    });
    return cronograma;
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
        if (pNombreTipoAuditoria == 'CronogramaInforme') {
          this.UltimaActualizacionCronograma = this.obtenerDatosAuditoria('CronogramaInforme');
        }
      }
    );
  }
}
