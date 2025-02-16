import { Component, OnInit, Input } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalAdicionalExpedienteComponent } from './modal-adicional-expediente/modal-adicional-expediente.component';
import { AdicionalExpedienteService } from 'projects/sspssi/src/servicios/expediente/adicional-deductivo/adicional-expediente.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'ssi-adicional-expediente',
  templateUrl: './adicional-expediente.component.html',
  styleUrls: ['./adicional-expediente.component.css']
})
export class AdicionalExpedienteComponent implements OnInit {

  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() bEstado: boolean;

  rptaListaAdicionalExpediente: any = [];
  listaAdicionalExpediente: any = [];
  montoTotalAdicional: number;
  ultimaActualizacionAdicional: string;
  totalRegistros: number;

  bsModalRef: BsModalRef;
  config;
  paginaActiva = 0;
  numero_Pagina = 0;
  numPaginasMostrar = 5;


  constructor(public funciones: Functions, private modalService: BsModalService, private adicionalExpedienteService: AdicionalExpedienteService, private sMant: MaestraSsiService) { }

  ngOnInit() {
    this.listarAdicionalesExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
    this.ultimaActualizacionAdicional = this.obtenerDatosAuditoria('PresupuestoAdicional');
  }

  nuevoAdicional() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: null,
        id_seguimientoExpediente: this.idSeguimientoMonitoreoExpediente
      },
      class: 'modal-presupuesto-deductivo'
    };
    this.bsModalRef = this.modalService.show(ModalAdicionalExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAdicional.subscribe(
      (data: number) => {
        this.listarAdicionalesExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('PresupuestoAdicional');
      }
    );
  }

  listarAdicionalesExpediente(id_seguimientoMonitoreoExpediente: number, nro_pagina: number, nro_paginas: number) {
    this.adicionalExpedienteService.listarAdicionalExpediente(id_seguimientoMonitoreoExpediente, nro_pagina, nro_paginas).subscribe(
      data => {
        this.rptaListaAdicionalExpediente = data;
        this.totalRegistros = this.rptaListaAdicionalExpediente.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaAdicionalExpediente = this.rptaListaAdicionalExpediente.presupuesto_adicional;
          this.montoTotalAdicional = this.rptaListaAdicionalExpediente.monto_total;
        } else {
          this.listaAdicionalExpediente = [];
          this.montoTotalAdicional = 0;
        }
      }
    );
  }

  editar(adicional: any) {
    //this.setearIdSeguimientoMonitoreo();
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        entidadEditar: adicional,
        id_seguimientoExpediente: this.idSeguimientoMonitoreoExpediente
      },
      class: 'modal-presupuesto-deductivo'
    };
    this.bsModalRef = this.modalService.show(ModalAdicionalExpedienteComponent, this.config);
    this.bsModalRef.content.retornoValoresAdicional.subscribe(
      (data: number) => {
        this.listarAdicionalesExpediente(data, this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria('PresupuestoAdicional');
      }
    );
  }

  eliminar(idAdicionalExpediente) {
    const param = {
      id_adicional_expediente: idAdicionalExpediente,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.adicionalExpedienteService.anularAdicionalExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
              this.listarAdicionalesExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
            } else {
              this.funciones.mensaje('danger', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('danger', this.funciones.mostrarMensaje('error', ''))
        );
      }
    });
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'PresupuestoAdicional') {
          this.ultimaActualizacionAdicional = this.obtenerDatosAuditoria('PresupuestoAdicional');
        }
      }
    );
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      const infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return `${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        return '';
      }
    }
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarAdicionalesExpediente(this.idSeguimientoMonitoreoExpediente, this.numPaginasMostrar, this.paginaActiva);
  }
}
