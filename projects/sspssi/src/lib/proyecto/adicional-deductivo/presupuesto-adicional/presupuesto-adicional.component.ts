import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from '../../../../patterns/facade.service';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalPresupuestoAdicionalComponent } from './modal-presupuesto-adicional/modal-presupuesto-adicional.component';
import { Functions } from '../../../../appSettings/functions';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';

@Component({
  selector: 'app-presupuesto-adicional',
  templateUrl: './presupuesto-adicional.component.html',
  styleUrls: ['./presupuesto-adicional.component.css']
})
export class PresupuestoAdicionalComponent implements OnInit {
  UltimaActualizacion: string = "";
  lista = []
  @Input() idSeguimientoMonitoreoObra;
  bsModalRef: BsModalRef;
  montoTotal: number = 0;
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 5;
  id_seguimientoMonitoreoObra: number;
  @Input() bEstado: boolean;

  constructor(private fs: FacadeService, private bsModal: BsModalService, private funciones: Functions
    , private sMant: MaestraSsiService) { }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "PresupuestoAdicional");
      if (infoAuditoria != undefined) {
        this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        this.UltimaActualizacion = "";
      }
    } else {
      this.UltimaActualizacion = "";
    }
    //Fin
  }
  ngOnInit() {
    this.obtenerDatosAuditoria();
    this.SetearIdSeguimientoMonitoreo();
    this.listar(this.numero_Pagina, this.numPaginasMostrar);
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      this.id_seguimientoMonitoreoObra = parseInt(sessionStorage.getItem("idSeguimiento"));

      if (isNaN(this.id_seguimientoMonitoreoObra)) {
        this.id_seguimientoMonitoreoObra = 0;
      }

    } else {
      this.id_seguimientoMonitoreoObra = parseInt(this.idSeguimientoMonitoreoObra);
      sessionStorage.setItem("idSeguimiento", this.id_seguimientoMonitoreoObra.toString());
    }
  }

  listar(numero_pagina: number, numero_pagina_mostrar: number) {
    this.fs.presupuestoAdicionalService.listar(this.id_seguimientoMonitoreoObra, numero_pagina_mostrar, numero_pagina).subscribe(
      (data: any) => {
        this.totalRegistros = data.cantidad_registro;
        this.montoTotal = data.monto_total;
        if (data.cantidad_registro != 0) {
          this.lista = data.presupuesto_adicional
        } else {
          this.lista = [];
        }
      }
    )
  }

  nuevo() {
    this.SetearIdSeguimientoMonitoreo();

    let config: ModalOptions = {
      initialState: {
        entidad: null,
        id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra
      },
      class: "modal-presupuesto-adicional"
    }

    this.bsModalRef = this.bsModal.show(ModalPresupuestoAdicionalComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data) => {
        this.listar(this.numero_Pagina, this.numPaginasMostrar);
        this.consultaAuditoria();
      }
    )

  }

  editar(row) {
    this.SetearIdSeguimientoMonitoreo();

    let config: ModalOptions = {
      initialState: {
        entidad: row,
        id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra
      },
      class: "modal-presupuesto-adicional"
    }

    this.bsModalRef = this.bsModal.show(ModalPresupuestoAdicionalComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data) => {
        this.listar(this.numero_Pagina, this.numPaginasMostrar);
        this.consultaAuditoria();
      }
    )
  }

  eliminar(item) {
    item.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Presupuesto?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.presupuestoAdicionalService.eliminar(item).subscribe(
          () => {
            this.listar(this.numero_Pagina, this.numPaginasMostrar);
            this.consultaAuditoria();
          }
        )
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listar(this.numero_Pagina, this.numPaginasMostrar);
  }
  consultaAuditoria() {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }
}
