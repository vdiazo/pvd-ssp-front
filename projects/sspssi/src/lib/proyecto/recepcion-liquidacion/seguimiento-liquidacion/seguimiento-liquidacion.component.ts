import { Component, OnInit, Input, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProcesoLiquidacionService } from '../../../../servicios/recepcion-liquidacion/proceso-liquidacion.service';
import { LiquidacionModalComponent } from './liquidacion-modal/liquidacion-modal.component';
import { Functions } from '../../../../appSettings/functions';
import { Liquidacion } from '../../../../models/Liquidacion';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { FacadeService } from '../../../../patterns/facade.service';

@Component({
  selector: 'ssi-seguimiento-liquidacion',
  templateUrl: './seguimiento-liquidacion.component.html',
  styleUrls: ['./seguimiento-liquidacion.component.css']
})
export class SeguimientoLiquidacionComponent implements OnInit {
  UltimaActualizacion: string = "";
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  montoTotal: number;
  rptaResponsable;
  supervisor;

  //DEYVID
  totalRegistroLiquidacion: number = 1;
  paginaActual: number = 1;
  bsModalLiquidacion: BsModalRef;
  config;
  idSeguimientoObra: number;
  idaprobado: number = 0;
  arregloLiquidacion;
  respuesta;
  ocultarNuevo: boolean = true;
  arregloDetalle = [];
  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private svcLiquidacion: ProcesoLiquidacionService, private funciones: Functions
    , private sMant: MaestraSsiService, private fs: FacadeService) { }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "Seguimiento");
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
    this.listarResponsables(this.idSeguimientoMonitoreoObra);
    this.listarSeguimientoLiquidacion();
  }

  listarResponsables(idSegMonObra) {
    this.fs.maestraService.listarResponsables(idSegMonObra).subscribe(
      respuesta => {
        this.rptaResponsable = respuesta as any;
        if (this.rptaResponsable != '') {
          this.supervisor = this.rptaResponsable[0].supervisor;
        }
      }
    )
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.idSeguimientoObra = 0;
      } else {
        this.idSeguimientoObra = parseInt(sessionStorage.getItem("idSeguimiento"));
      }
    } else {
      this.idSeguimientoObra = parseInt(this.idSeguimientoMonitoreoObra);
      sessionStorage.setItem("idSeguimiento", this.idSeguimientoObra.toString());
    }
  }

  listarSeguimientoLiquidacion() {
    this.paginaActual = 1;
    let skip = 5;
    let take = 0;

    if (isNaN(this.idSeguimientoObra)) {
      this.idSeguimientoObra = 0;
    }

    this.svcLiquidacion.ListarLiquidacionPaginado(this.idSeguimientoObra, skip, take).subscribe(
      data => {
        this.respuesta = data;
        this.ocultarNuevo = this.respuesta.aprobado;
        this.arregloLiquidacion = this.respuesta.data;
        this.totalRegistroLiquidacion = this.respuesta.cantidad_registro;
        if (this.arregloLiquidacion != null) {
          this.arregloLiquidacion.forEach(element => {
            element.fecha_seguimiento = this.funciones.formatDate(element.fecha_seguimiento);
            element.fecha_liquidacion_obra = this.funciones.formatDate(element.fecha_liquidacion_obra);
            element.fecha_liquidacion_supervicion = this.funciones.formatDate(element.fecha_liquidacion_supervicion);
          });
        }
        this.validarNuevo();
      }
    )
  }

  validarNuevo() {
    if (this.arregloLiquidacion == null) {
      this.arregloDetalle = [];
      let entidad = { resolucion_liquidacion_obra: "", fecha_liquidacion_obra: "", monto_liquidacion_obra: "", nombre_archivo_liquidacion_obra: "", resolucion_liquidacion_supervicion: "", fecha_liquidacion_supervicion: "", monto_liquidacion_supervicion: "", nombre_archivo_liquidacion_supervicion: "" }
      this.arregloDetalle.push(entidad);
      return;
    }
    let aprobado = this.arregloLiquidacion.find(x => x.nombre_estado_liquidacion === 'APROBADO');
    if (aprobado != null) {
      this.arregloDetalle = [];
      this.idaprobado = aprobado.id_liquidacion_seguimiento;
      this.arregloDetalle.push(aprobado);
    } else {
      if (this.ocultarNuevo) {
        return;
      } else {
        this.arregloDetalle = [];
        let entidad = { resolucion_liquidacion_obra: "", fecha_liquidacion_obra: "", monto_liquidacion_obra: "", nombre_archivo_liquidacion_obra: "", resolucion_liquidacion_supervicion: "", fecha_liquidacion_supervicion: "", monto_liquidacion_supervicion: "", nombre_archivo_liquidacion_supervicion: "" }
        this.arregloDetalle.push(entidad);
      }
    }
  }

  modalEditarLiquidacion(obj) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idSeguimientoObra: this.idSeguimientoObra,
        aprobado: this.ocultarNuevo,
        id_aprobado: this.idaprobado,
        supervisor: this.supervisor,
        entidadEditar: obj
      }
    };
    this.bsModalLiquidacion = this.modalService.show(LiquidacionModalComponent, this.config);
    this.bsModalLiquidacion.content.retornoValores.subscribe(
      () => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
        this.consultaAuditoria();
      }
    )
  }

  modalAgregarLiquidacion() {
    this.SetearIdSeguimientoMonitoreo();
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idSeguimientoObra: this.idSeguimientoObra,
        supervisor: this.supervisor,
        entidadEditar: null
      }
    };
    this.bsModalLiquidacion = this.modalService.show(LiquidacionModalComponent, this.config);
    this.bsModalLiquidacion.content.retornoValores.subscribe(
      () => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
        this.consultaAuditoria();
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActual = pagina.page;
    let skip = 5;
    let take = (pagina.page * 5) - 5;

    if (isNaN(this.idSeguimientoObra)) {
      this.idSeguimientoObra = 0;
    }

    this.svcLiquidacion.ListarLiquidacionPaginado(this.idSeguimientoObra, skip, take).subscribe(
      data => {
        this.respuesta = data;
        this.ocultarNuevo = this.respuesta.aprobado;
        this.arregloLiquidacion = this.respuesta.data;
        this.totalRegistroLiquidacion = this.respuesta.cantidad_registro;
        if (this.arregloLiquidacion != null) {
          this.arregloLiquidacion.forEach(element => {
            element.fecha_seguimiento = this.funciones.formatDate(element.fecha_seguimiento);
            element.fecha_liquidacion_obra = this.funciones.formatDate(element.fecha_liquidacion_obra);
            element.fecha_liquidacion_supervicion = this.funciones.formatDate(element.fecha_liquidacion_supervicion);
          });
        }
        this.validarNuevo();
      }
    )
  }

  mostrarAlerta(codigo) {
    this.funciones.alertaRetorno("question", "Deseas eliminar el siguiente registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.eliminar(codigo);
      }
    })
  }

  eliminar(codigo) {
    let entidadEliminar = new Liquidacion();
    entidadEliminar.id_liquidacion_seguimiento = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.svcLiquidacion.anularLiquidacion(entidadEliminar).subscribe(
      data => {
        if (data == 1) {
          this.funciones.alertaSimple("success", "Se eliminó correctamente el registro!", "", true);
          this.listarSeguimientoLiquidacion();
          this.consultaAuditoria();
        } else {
          this.funciones.alertaSimple("error", "Ocurrio un error al momento de eliminar el registro", "", true);
        }
      }
    )
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
