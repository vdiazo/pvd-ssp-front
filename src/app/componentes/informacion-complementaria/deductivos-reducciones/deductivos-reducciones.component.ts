import { Component, OnInit, Input } from '@angular/core';
import { DeductivoReduccion } from '../../../models/response/deductivo-reduccion';
import { FacadeService } from '../../../patterns/facade.service';
import { ModalDeductivosReduccionesComponent } from './modal-deductivos-reducciones/modal-deductivos-reducciones.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../appSettings/functions';
import { MaestraService } from '../../../services/maestra.service';

@Component({
  selector: 'app-deductivos-reducciones',
  templateUrl: './deductivos-reducciones.component.html',
  styleUrls: ['./deductivos-reducciones.component.css']
})
export class DeductivosReduccionesComponent implements OnInit {
  UltimaActualizacion: string = "";
  model: DeductivoReduccion;
  listDeductivoReduccion = [];
  totalRegistros;
  montoTotal: number = 0;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  id_seguimientoMonitoreoObra: number;
  config;
  bsModalDeductivoRef: BsModalRef;
  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  constructor(private fs: FacadeService, private modalService: BsModalService, public funciones: Functions
    , private sMant: MaestraService) { }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "DeductivoReduccion");
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
    this.setControles();
    this.listarDeductivoReductivo(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      this.id_seguimientoMonitoreoObra = parseInt(sessionStorage.getItem("idSeguimiento"));

      if (isNaN(this.id_seguimientoMonitoreoObra)) {
        this.id_seguimientoMonitoreoObra = 0;
      }

    } else {
      this.id_seguimientoMonitoreoObra = parseInt(this.idSeguimientoMonitoreoObra);
    }
  }

  setControles(): any {
    this.model = new DeductivoReduccion();
  }

  listarDeductivoReductivo(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.deductivoReduccionService.listarDeductivoReduccion(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      (respuesta: any) => {
        this.listDeductivoReduccion = respuesta.deductivo_reduccion;
        this.totalRegistros = respuesta.cantidad_registro;
        // this.montoTotal =  respuesta.monto_total.toString();
        this.montoTotal = respuesta.monto_total;
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarDeductivoReductivo(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  nuevoDeductivoReduccion() {
    this.SetearIdSeguimientoMonitoreo();

    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.id_seguimientoMonitoreoObra
      }
    };

    this.bsModalDeductivoRef = this.modalService.show(ModalDeductivosReduccionesComponent, this.config);
    this.bsModalDeductivoRef.content.varEmitterDeductivo.subscribe(
      data => {
        this.listarDeductivoReductivo(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria();
      }
    )
  }

  editarDeductivoReduccion(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelDeductivo: model
      }
    };

    this.bsModalDeductivoRef = this.modalService.show(ModalDeductivosReduccionesComponent, this.config);
    this.bsModalDeductivoRef.content.varEmitterDeductivo.subscribe(
      data => {
        this.listarDeductivoReductivo(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria();
      }
    )
  }

  eliminarDeductivoReduccion(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_deductivo_reduccion_obra: model.id_deductivo_reduccion_obra, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.deductivoReduccionService.eliminarDeductivoReduccion(strData).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarDeductivoReductivo(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
              this.setControles();
              this.consultaAuditoria();
            } else {
              this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
            }
          }
        );
      }
    });
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