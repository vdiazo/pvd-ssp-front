import { Component, OnInit, Input } from '@angular/core';
import { RecepcionObra } from '../../../models/response/recepcion-obra';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from '../../../../../node_modules/ngx-bootstrap/modal';
import { RecepcionObraModalComponent } from './recepcion-obra-modal/recepcion-obra-modal.component';
import { RecepcionObraService } from '../../../services/recepcion-liquidacion/recepcion-obra.service';
import { Functions } from '../../../appSettings/functions';
import { MaestraService } from '../../../services/maestra.service';

@Component({
  selector: 'app-recepcion-obra',
  templateUrl: './recepcion-obra.component.html',
  styleUrls: ['./recepcion-obra.component.css']
})
export class RecepcionObraComponent implements OnInit {
  UltimaActualizacion: string = "";
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  montoTotal: number;
  listRecepcionObra = [];
  model_RecepcionObra: RecepcionObra;
  bsModalRef: BsModalRef;
  idRecepcionObra: number;
  id_seguimiento_monitoreo_obra: number;
  totalRegistrosRecepcionObra;
  mostrarNuevaRecepcion: boolean = true;
  idRecepcionAprobada: number = 0;
  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private ssRecepcionObra: RecepcionObraService, public funciones: Functions
    , private sMant: MaestraService) { }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "RecepcionObra");
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
    this.listarRecepcionObra(this.num_filas, this.numero_Pagina);
  }
  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.id_seguimiento_monitoreo_obra = 0;
      } else {
        this.id_seguimiento_monitoreo_obra = parseInt(sessionStorage.getItem("idSeguimiento"));
      }
    } else {
      this.id_seguimiento_monitoreo_obra = parseInt(this.idSeguimientoMonitoreoObra);
    }
  }

  listarRecepcionObra(pNumFilas, pNumPagina) {

    if (isNaN(this.id_seguimiento_monitoreo_obra)) {
      this.id_seguimiento_monitoreo_obra = 0;
    }

    this.ssRecepcionObra.listarRecepcionObra(this.id_seguimiento_monitoreo_obra, pNumPagina, pNumFilas).subscribe(
      respuesta => {
        let recepcionObraReturn;
        recepcionObraReturn = respuesta as any;
        if (recepcionObraReturn.cantidad_registro == 0) {
          this.listRecepcionObra = [];
          this.mostrarNuevaRecepcion = true;
        } else {
          this.listRecepcionObra = recepcionObraReturn.data;
          this.totalRegistrosRecepcionObra = recepcionObraReturn.cantidad_registro;

          for (let i = 0; i < this.listRecepcionObra.length; i++) {
            if (this.listRecepcionObra[i].id_estado_recepcion == 2) {
              this.mostrarNuevaRecepcion = false;
              this.idRecepcionAprobada = this.listRecepcionObra[i].id_liquidacion_recepcion_obra;
              break;
            } else {
              this.mostrarNuevaRecepcion = true;
            }
          }
        }
      }
    );
  }

  config;
  opnModNuevaRecepcionObra() {
    this.SetearIdSeguimientoMonitoreo();
    this.model_RecepcionObra = new RecepcionObra();
    this.model_RecepcionObra.id_liquidacion_recepcion_obra = 0;
    this.model_RecepcionObra.id_seguimiento_monitoreo_obra = this.id_seguimiento_monitoreo_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelRecepcionObra: this.model_RecepcionObra
      }
    };

    this.bsModalRef = this.modalService.show(RecepcionObraModalComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarRecepcionObra(this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria();
      }
    )
  }

  editarRecepcionObra(model) {
    //this.model_RecepcionObra.id_seguimiento_monitoreo_obra = this.id_seguimiento_monitoreo_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelRecepcionObra: model, mostrarNuevaRecepcion: this.mostrarNuevaRecepcion, idRecepcionAprobada: this.idRecepcionAprobada
      }
    };

    this.bsModalRef = this.modalService.show(RecepcionObraModalComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarRecepcionObra(this.numPaginasMostrar, this.paginaActiva);
        this.consultaAuditoria();
      }
    )
  }

  anularAprobacion(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let strData = { id_liquidacion_recepcion_obra: model.id_liquidacion_recepcion_obra, usuario_eliminacion: model.usuario_eliminacion }

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.ssRecepcionObra.anularRecepcionObra(strData).subscribe(
          respuestaEliminacion => {
            this.listarRecepcionObra(this.numPaginasMostrar, this.paginaActiva);
            this.consultaAuditoria();
          }
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarRecepcionObra(this.num_filas, this.numero_Pagina);
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
