import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProcesoLiquidacionService } from '../../services/proceso-liquidacion.service';
import { LiquidacionModalExpTecComponent } from '../seguimiento-liquidacion-exp-tec/liquidacion-modal-exp-tec/liquidacion-modal-exp-tec.component';
import { Funciones } from '../../../appSettings/funciones';
import { Liquidacion } from '../../../models/liquidacion';
import { FacadeService } from '../../patterns/facade.service';
import { MaestraService } from '../../services/maestra.service';

@Component({
  selector: 'set-seguimiento-liquidacion-exp-tec',
  templateUrl: './seguimiento-liquidacion-exp-tec.component.html',
  styleUrls: ['./seguimiento-liquidacion-exp-tec.component.css']
})
export class SeguimientoLiquidacionExpTecComponent implements OnInit {

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

  constructor(private modalService: BsModalService, private svcLiquidacion: ProcesoLiquidacionService, private funciones: Funciones
    , private sMant: MaestraService, private fs: FacadeService) { }

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
        this.supervisor = this.rptaResponsable[0].supervisor;
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
            //element.fecha_seguimiento_expediente = this.funciones.formatDate(element.fecha_seguimiento_expediente);
            element.fecha_liquidacion_expediente = this.funciones.formatDate(element.fecha_liquidacion_expediente);
            element.fecha_informe_aprobacion=this.funciones.formatDate(element.fecha_informe_aprobacion);
            element.fecha_aprobacion_expediente=this.funciones.formatDate(element.fecha_aprobacion_expediente);
            //element.fecha_liquidacion_supervicion_expediente = this.funciones.formatDate(element.fecha_liquidacion_supervicion_expediente);
          });
        }
        //this.validarNuevo();
      }
    )
  }
  validarNuevo() {
    if (this.arregloLiquidacion == null) {
      this.arregloDetalle = [];
      let entidad = { resolucion_liquidacion_expediente: "", fecha_liquidacion_expediente: "", monto_liquidacion_expediente: "", nombre_archivo_liquidacion_expediente: "", resolucion_liquidacion_supervicion_expediente: "", fecha_liquidacion_supervicion_expediente: "", monto_liquidacion_supervicion_expediente: "", nombre_archivo_liquidacion_supervicion_expediente: "" }
      this.arregloDetalle.push(entidad);
      return;
    }
    let aprobado = this.arregloLiquidacion;//.find(x => x.estado_liquidacion_expediente === 'APROBADO');
    if (aprobado != null) {
      this.arregloDetalle = [];
      this.idaprobado = aprobado.id_liquidacion_seguimiento_expediente;
      this.arregloDetalle.push(aprobado);
    } else {
      if (this.ocultarNuevo) {
        return;
      } else {
        this.arregloDetalle = [];
        let entidad = { resolucion_liquidacion_expediente: "", fecha_liquidacion_expediente: "", monto_liquidacion_expediente: "", nombre_archivo_liquidacion_expediente: "", resolucion_liquidacion_supervicion_expediente: "", fecha_liquidacion_supervicion_expediente: "", monto_liquidacion_supervicion_expediente: "", nombre_archivo_liquidacion_supervicion_expediente: "" }
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
    this.bsModalLiquidacion = this.modalService.show(LiquidacionModalExpTecComponent, this.config);
    this.bsModalLiquidacion.content.retornoValores.subscribe(
      data => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
        //this.consultaAuditoria();
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
    this.bsModalLiquidacion = this.modalService.show(LiquidacionModalExpTecComponent, this.config);
    this.bsModalLiquidacion.content.retornoValores.subscribe(
      data => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
        //this.consultaAuditoria();
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
            //element.fecha_seguimiento_expediente = this.funciones.formatDate(element.fecha_seguimiento_expediente);
            element.fecha_liquidacion_expediente = this.funciones.formatDate(element.fecha_liquidacion_expediente);
            element.fecha_informe_aprobacion=this.funciones.formatDate(element.fecha_informe_aprobacion);
            element.fecha_aprobacion_expediente=this.funciones.formatDate(element.fecha_aprobacion_expediente);
            //element.fecha_liquidacion_supervicion_expediente = this.funciones.formatDate(element.fecha_liquidacion_supervicion_expediente);
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
    entidadEliminar.id_liquidacion_seguimiento_expediente = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let param={
      "id_liquidacion_seguimiento_expediente":codigo,
      "usuario_eliminacion":sessionStorage.getItem("Usuario")
    }
    this.svcLiquidacion.anularLiquidacion(param).subscribe(
      data => {
        if (data == 1) {
          this.funciones.alertaSimple("success", "Se eliminó correctamente el registro!", "", true);
          this.listarSeguimientoLiquidacion();
          //this.consultaAuditoria();
        } else {
          this.funciones.alertaSimple("error", "Ocurrio un error al momento de eliminar el registro", "", true);
        }
      }
    )
  }
  /*consultaAuditoria() {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }*/

}
