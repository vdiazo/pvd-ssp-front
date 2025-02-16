import { Component, OnInit, Input } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings/functions';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeductivoExpedienteComponent } from './modal-deductivo-expediente/modal-deductivo-expediente.component';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { DeductivoExpedienteService } from 'projects/sspssi/src/servicios/expediente/adicional-deductivo/deductivo-expediente.service';

@Component({
  selector: 'ssi-deductivo-expediente',
  templateUrl: './deductivo-expediente.component.html',
  styleUrls: ['./deductivo-expediente.component.css']
})
export class DeductivoExpedienteComponent implements OnInit {

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() bEstado: boolean;

  rptaListaDeductivoExpediente: any = [];
  listaDeductivoExpediente: any = [];

  montoTotalDeductivo: number;
  ultimaActualizacionDeductivo: string;
  totalRegistros: number;

  bsModalRef: BsModalRef;
  config;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;

  constructor(public funciones: Functions, private modalService: BsModalService, private sMant: MaestraSsiService, private deductivoExpedienteService: DeductivoExpedienteService) { }

  ngOnInit() {
    this.listarDeductivosExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.ultimaActualizacionDeductivo = this.obtenerDatosAuditoria('PresupuestoDeductivo');
  }

  listarDeductivosExpediente(id_seguimientoMonitoreoExpediente: number, nro_pagina: number, num_pagina_mostrar: number) {
    this.deductivoExpedienteService.listarDeductivoExpediente(id_seguimientoMonitoreoExpediente, nro_pagina, num_pagina_mostrar).subscribe(
      data => {
        this.rptaListaDeductivoExpediente = data;
        this.totalRegistros = this.rptaListaDeductivoExpediente.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaDeductivoExpediente = this.rptaListaDeductivoExpediente.deductivo_expediente;
          this.montoTotalDeductivo = this.rptaListaDeductivoExpediente.monto_total;
        } else {
          this.listaDeductivoExpediente = [];
          this.montoTotalDeductivo = 0;
        }
      }
    );
  }

  nuevoDeductivo() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        id_seguimientoExpediente: this.idSeguimientoMonitoreoExpediente
      },
      class: 'modal-presupuesto-deductivo'
    };
    this.bsModalRef = this.modalService.show(ModalDeductivoExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresDeductivo.subscribe(
      (data: number) => {
        this.listarDeductivosExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('PresupuestoDeductivo');
      }
    );
  }

  editarDeductivo(deductivo) {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: deductivo,
        id_seguimientoExpediente: this.idSeguimientoMonitoreoExpediente
      },
      class: 'modal-presupuesto-deductivo'
    };
    this.bsModalRef = this.modalService.show(ModalDeductivoExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresDeductivo.subscribe(
      (data: number) => {
        this.listarDeductivosExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('PresupuestoDeductivo');
      }
    );
  }

  eliminarDeductivo(idDeductivo) {
    const param = {
      id_deductivo_expediente: idDeductivo,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.deductivoExpedienteService.anularDeductivoExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
              this.listarDeductivosExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
            } else {
              this.funciones.mensaje('danger', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('danger', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarDeductivosExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'PresupuestoDeductivo') {
          this.ultimaActualizacionDeductivo = this.obtenerDatosAuditoria('PresupuestoDeductivo');
        }
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
}
