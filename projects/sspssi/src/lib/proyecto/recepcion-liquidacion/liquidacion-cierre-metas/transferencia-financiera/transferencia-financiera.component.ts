import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MaestraSsiService } from '../../../../../servicios/maestra-ssi.service';
import { Functions } from '../../../../../appSettings';
import { CierreProyectoService } from '../../../../../servicios/recepcion-liquidacion/cierre-proyecto.service';
import { CierreTransfContable } from '../../../../../models/response/cierre-transferencia-contable';
import { CierreTransfFinancieraModalComponent } from './cierre-transf-financiera-modal/cierre-transf-financiera-modal.component';

@Component({
  selector: 'ssi-transferencia-financiera',
  templateUrl: './transferencia-financiera.component.html',
  styleUrls: ['./transferencia-financiera.component.css']
})
export class TransferenciaFinancieraComponent implements OnInit {

  UltimaActualizacion: string = "";
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  id_seguimiento_monitoreo_obra: number;
  totalRegistrosCierreTransfContable: number = 0;
  mostrarNuevoCierreTransferenciaContable: boolean = true;
  lstCierreTransfContable;
  model_CierreTransfContable: CierreTransfContable;
  bsModalRef: BsModalRef;
  idCierreTransfContableAprobada: number = 0;

  @Input() idSeguimientoMonitoreo;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private ssCierreContable: CierreProyectoService, public funciones: Functions
    , private sMant: MaestraSsiService) { }

  ngOnInit() {
    this.obtenerDatosAuditoria();
    this.SetearIdSeguimientoMonitoreo();
    this.listarCierreTransfContable();
  }

  obtenerDatosAuditoria() {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "CierreContable");
      if (infoAuditoria != undefined) {
        this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        this.UltimaActualizacion = "";
      }
    } else {
      this.UltimaActualizacion = "";
    }
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreo == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.id_seguimiento_monitoreo_obra = 0;
      } else {
        this.id_seguimiento_monitoreo_obra = parseInt(sessionStorage.getItem("idSeguimiento"));
      }
    } else {
      this.id_seguimiento_monitoreo_obra = parseInt(this.idSeguimientoMonitoreo);
    }
  }

  listarCierreTransfContable() {
    if (isNaN(this.id_seguimiento_monitoreo_obra)) {
      this.id_seguimiento_monitoreo_obra = 0;
    }

    this.ssCierreContable.listarCierreTransContable(this.id_seguimiento_monitoreo_obra).subscribe(
      respuesta => {
        if (respuesta.length == 0) {
          this.lstCierreTransfContable = [];
          this.mostrarNuevoCierreTransferenciaContable = true;
        } else {
          this.lstCierreTransfContable = respuesta as any;
          this.totalRegistrosCierreTransfContable = this.lstCierreTransfContable.length;
          for (let i = 0; i < this.lstCierreTransfContable.length; i++) {
            if (this.lstCierreTransfContable[i].id_estado_cierre == 1) {
              this.mostrarNuevoCierreTransferenciaContable = false;
              this.idCierreTransfContableAprobada = this.lstCierreTransfContable[i].id_cierre_transferencia_contable;
              break;
            } else {
              this.mostrarNuevoCierreTransferenciaContable = true;
            }
          }
        }
      });
  }

  config;
  opnModNuevoCierreTransContable() {
    this.SetearIdSeguimientoMonitoreo();
    this.model_CierreTransfContable = new CierreTransfContable();
    this.model_CierreTransfContable.id_cierre_transferencia_contable = 0;
    this.model_CierreTransfContable.id_seguimiento_monitoreo_obra = this.id_seguimiento_monitoreo_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelCierreTransfContable: this.model_CierreTransfContable,
      }
    };

    this.bsModalRef = this.modalService.show(CierreTransfFinancieraModalComponent, this.config);
    this.bsModalRef.content.retornaValores.subscribe(
      () => {
        this.listarCierreTransfContable();
        this.consultaAuditoria();
      }
    );
  }

  editarCierreTransContable(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelCierreTransfContable: model, mostrarNuevoCierreTransferenciaContable: this.mostrarNuevoCierreTransferenciaContable, idCierreTransfContableAprobada: this.idCierreTransfContableAprobada
      }
    };

    this.bsModalRef = this.modalService.show(CierreTransfFinancieraModalComponent, this.config);
    this.bsModalRef.content.retornaValores.subscribe(
      () => {
        this.listarCierreTransfContable();
        this.consultaAuditoria();
      }
    );
  }

  anularAprobacion(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let strData = { id_cierre_transferencia_contable: model.id_cierre_transferencia_contable, usuario_eliminacion: model.usuario_eliminacion }

    this.funciones.alertaRetorno("question", "¿Esta seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.ssCierreContable.anularCierreTransfContable(strData).subscribe(
          () => {
            this.listarCierreTransfContable();
            this.consultaAuditoria();
          }
        );
      }
    }
    );
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarCierreTransfContable();
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