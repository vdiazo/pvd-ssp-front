import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MaestraSsiService } from '../../../../../servicios/maestra-ssi.service';
import { Functions } from '../../../../../appSettings';
import { CierreProyectoService } from '../../../../../servicios/recepcion-liquidacion/cierre-proyecto.service';
import { CierreTransfFisica } from '../../../../../models/response/cierre-transferencia-fisica';
import { CierreTransfFisicaModalComponent } from './cierre-transf-fisica-modal/cierre-transf-fisica-modal.component';

@Component({
  selector: 'ssi-ejecutada-liquidada',
  templateUrl: './ejecutada-liquidada.component.html',
  styleUrls: ['./ejecutada-liquidada.component.css']
})
export class EjecutadaLiquidadaComponent implements OnInit {

  UltimaActualizacion: string = "";
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  id_seguimiento_monitoreo_obra: number;
  mostrarNuevoCierreTransferenciaFisica: boolean = true;
  lstCierreTransfFisica = [];
  model_CierreTransfFisica: CierreTransfFisica;
  bsModalRef: BsModalRef;
  idCierreTransfFisicaAprobada: number = 0;
  totalRegistrosCierreTransfFisica: number = 0;

  @Input() idSeguimientoMonitoreo;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private ssCierreFisico: CierreProyectoService, public funciones: Functions
    , private sMant: MaestraSsiService) { }

  ngOnInit() {
    this.obtenerDatosAuditoria();
    this.SetearIdSeguimientoMonitoreo();
    this.listarCierreTransfFisica();
  }

  obtenerDatosAuditoria() {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "CierreFisico");
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

  listarCierreTransfFisica() {
    if (isNaN(this.id_seguimiento_monitoreo_obra)) {
      this.id_seguimiento_monitoreo_obra = 0;
    }

    this.ssCierreFisico.listarCierreTransFisica(this.id_seguimiento_monitoreo_obra).subscribe(
      respuesta => {
        if (respuesta.length == 0) {
          this.lstCierreTransfFisica = [];
          this.mostrarNuevoCierreTransferenciaFisica = true;
        } else {
          this.lstCierreTransfFisica = respuesta as any;
          this.totalRegistrosCierreTransfFisica = this.lstCierreTransfFisica.length;
          for (let i = 0; i < this.lstCierreTransfFisica.length; i++) {
            if (this.lstCierreTransfFisica[i].id_estado_cierre == 1) {
              this.mostrarNuevoCierreTransferenciaFisica = false;
              this.idCierreTransfFisicaAprobada = this.lstCierreTransfFisica[i].id_cierre_transferencia_fisica;
              break;
            } else {
              this.mostrarNuevoCierreTransferenciaFisica = true;
            };
          }
        }
      });
  }

  config;
  opnModNuevoCierreTransFisica() {
    this.SetearIdSeguimientoMonitoreo();
    this.model_CierreTransfFisica = new CierreTransfFisica();
    this.model_CierreTransfFisica.id_cierre_transferencia_fisica = 0;
    this.model_CierreTransfFisica.id_seguimiento_monitoreo_obra = this.id_seguimiento_monitoreo_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelCierreTransfFisica: this.model_CierreTransfFisica,
      }
    };

    this.bsModalRef = this.modalService.show(CierreTransfFisicaModalComponent, this.config);
    this.bsModalRef.content.retornarValores.subscribe(
      () => {
        this.listarCierreTransfFisica();
        this.consultaAuditoria();
      }
    );
  }

  editarCierreTransFisica(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelCierreTransfFisica: model, mostrarNuevoCierreTransferenciaFisica: this.mostrarNuevoCierreTransferenciaFisica, idCierreTransfFisicaAprobada: this.idCierreTransfFisicaAprobada
      }
    };

    this.bsModalRef = this.modalService.show(CierreTransfFisicaModalComponent, this.config);
    this.bsModalRef.content.retornarValores.subscribe(
      () => {
        this.listarCierreTransfFisica();
        this.consultaAuditoria();
      }
    );
  }

  anularAprobacion(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let strData = { id_cierre_transferencia_fisica: model.id_cierre_transferencia_fisica, usuario_eliminacion: model.usuario_eliminacion }

    this.funciones.alertaRetorno("question", "¿Esta seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.ssCierreFisico.anularCierreTransfFisica(strData).subscribe(
          () => {
            this.listarCierreTransfFisica();
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
    this.listarCierreTransfFisica();
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
