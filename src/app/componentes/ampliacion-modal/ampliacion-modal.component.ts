import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Ampliacion } from '../../models/response/ampliacion';
import { Functions } from '../../appSettings/functions';
import { SeguimientoMonitoreo } from '../../models/response/seguimiento-monitoreo';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import * as $ from 'jquery';
import { FacadeService } from '../../patterns/facade.service';
import { MaestraService } from '../../services/maestra.service';

@Component({
  selector: 'app-ampliacion-modal',
  templateUrl: './ampliacion-modal.component.html',
  styleUrls: ['./ampliacion-modal.component.css']
  , encapsulation: ViewEncapsulation.None
  , providers: [Functions]
})
export class AmpliacionModalComponent implements OnInit {
  UltimaActualizacion: string = "";
  file: any;
  model: Ampliacion;
  id_seguimientoMonitoreoObra: number;
  rptAmpliacion;
  respAmpliacion;
  listAmpliacion;
  listaCausalidades;
  listaResultado = [];

  // id_fase: number;
  // fecha_inicio_contractual: Date;
  // fecha_termino_contractual: Date;
  // fecha_termino: Date;
  // plazo_ejecucion: number;
  // modelSeguimiento: SeguimientoMonitoreo;
  nombreArchivo: string = null;
  // entidadArchivo;
  IdTipoArchivo: number = tipoArchivo.ampliacion;
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  //NombreDocumento: string;
  bEstado: boolean;
  bMostrar: boolean = false;

  constructor(public modalRef: BsModalRef,
    public funciones: Functions,
    private fs: FacadeService,
    private sMant: MaestraService) {

  }

  obtenerDatosAuditoria() {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "Ampliacion");
      if (infoAuditoria != undefined) {
        this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        this.UltimaActualizacion = "";
      }
    } else {
      this.UltimaActualizacion = "";
    }
  }

  ngOnInit() {
    this.obtenerDatosAuditoria();
    this.model = new Ampliacion();

    this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
    $(document).ready(function () {
      $('#btnLimpiar').click(function () {
        $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
      });

    });

    this.fs.ampliacionService.listarCausalidades().subscribe(
      (data: any) => {
        this.listaCausalidades = data;
        // console.log(data);
      }
    );
    /* this.fs.ampliacionService.ListarAmpliacionControl().subscribe(
      (data: any) => {
        console.log(data);
        this.listaCausalidades = data.causal_ampliacion;
        this.listaResultado = data.resultado_pedido_ampliacion;
      }
    ); */
  }

  @Output() retornoValores = new EventEmitter();

  closeModal() {
    this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  listarAmpliacion(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.ampliacionService.listarAmpliacion(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respAmpliacion = respuesta as any;
        // this.listAmpliacion = this.respAmpliacion.ampliacion;
        // this.totalRegistros = this.respAmpliacion.cantidad;

        this.listAmpliacion = this.respAmpliacion.ampliacion_obra;
        this.totalRegistros = this.respAmpliacion.cantidad_registro;
        // if (this.listAmpliacion[0].id_ampliacion !== undefined) {
        if (this.totalRegistros > 0) {
          this.listAmpliacion.forEach(element => {
            element.fecha_inicio = this.funciones.formatDate(element.fecha_inicio);
            element.fecha_fin = this.funciones.formatDate(element.fecha_fin);
            element.resolucion_fecha = this.funciones.formatDate(element.resolucion_fecha);
          });
        } else {
          this.listAmpliacion = [];
        }
      }
    )
  };

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  editarAmpliacion(model) {
    this.model = new Ampliacion();
    this.model.id_ampliacion_obra = model.id_ampliacion_obra;
    this.model.id_seguimiento_monitoreo_obra = model.id_seguimiento_monitoreo_obra;
    this.model.fecha_inicio = this.funciones.ConvertStringtoDate(model.fecha_inicio);
    this.model.fecha_fin = this.funciones.ConvertStringtoDate(model.fecha_fin);
    this.model.plazo_dias = model.plazo_dias;
    this.model.resolucion_aprobacion = model.resolucion_aprobacion;
    this.model.resolucion_fecha = this.funciones.ConvertStringtoDate(model.resolucion_fecha);
    this.model.observacion = model.observacion;
    this.model.usuario_creacion = model.usuario_creacion;
    this.model.usuario_modificacion = model.usuario_modificacion;
    this.model.usuario_eliminacion = model.usuario_eliminacion;
    this.model.nombre_archivo = model.nombre_archivo;
    this.model.archivo_convenio = model.archivo_convenio;
    this.nombreArchivo = model.archivo_convenio;
    this.model.id_causal_ampliacion = model.id_causal_ampliacion;

    if (model.resultado) {
      this.model.resultado = model.resultado;
    } else {
      this.model.resultado = "Seleccione";
    }

    $('input[name="filepampliacionnmodal"]').val(model.archivo_convenio);
    this.validarCausalAmpliacion();
  }

  rValidacion: any;
  modificarAmpliacion(model) {
    model.fecha_inicio = null;
    model.fecha_fin = null;
    if (this.mensajeValidarCausalAmpliacion == "validado") {
      //actualizar
      if (model.id_ampliacion_obra != 0) {
        model.nombre_archivo = this.nombreArchivo == null ? model.archivo_convenio : this.nombreArchivo;
        model.fecha_fin = this.funciones.SumDaytoDate(model.fecha_inicio, model.plazo_dias);
        model.usuario_modificacion = sessionStorage.getItem("Usuario");
        this.bMostrar = true;
        this.fs.ampliacionService.actualizarAmpliacion(this.model).subscribe(
          respuesta => {
            if (respuesta > 0) {
              $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
              this.model = new Ampliacion();
              this.nombreArchivo = null;
              this.consultaAuditoria();
            } else {
              this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
              this.model = new Ampliacion();
              this.nombreArchivo = null;
            }
            this.bMostrar = false;
          }
        );
      }
      //registrar
      else {
        model.id_seguimiento = this.id_seguimientoMonitoreoObra;
        //model.id_resultado_pedido_ampliacion:number;
        //model.plazo:number;
        //model.fecha_aprobacion=null;
        //model.nombre_documento="";
        this.bMostrar = true;
        model.usuario_creacion = sessionStorage.getItem("Usuario");
        model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
        this.model.id_seguimiento_monitoreo_obra = this.id_seguimientoMonitoreoObra;
        model.observacion = model.observacion == undefined ? '' : model.observacion;
        this.fs.ampliacionService.registrarAmpliacion(this.model).subscribe(
          respuesta => {
            if (respuesta > 0) {
              $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
              this.model = new Ampliacion();
              this.nombreArchivo = null;
              this.consultaAuditoria();
            } else {
              this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
              this.model = new Ampliacion();
              this.nombreArchivo = null;
            }
            this.bMostrar = false;
          }
        );

        /* this.fs.ampliacionService.InsertarAmpliacion(this.model).subscribe((data: any) => {
          console.log(data);
        }); */
      }
    } else {
      this.funciones.mensaje("info", "Existe una paralización o suspensión pendiente de su ampliación para el Reinicio de la Obra / Existe una paralización sin Acta de Reinicio de Obra");
      this.setControles();
    }
    this.mensajeValidarCausalAmpliacion = "";
  };
  mensajeValidarCausalAmpliacion: string = "";
  validarCausalAmpliacion() {
    this.fs.ampliacionService.validarCausalAmpliacion(this.id_seguimientoMonitoreoObra, this.model.id_causal_ampliacion, "UEI", this.model.id_ampliacion_obra).subscribe(
      respuesta => {
        this.rValidacion = respuesta as any;
        if (this.rValidacion.estado == -1) {
          this.mensajeValidarCausalAmpliacion = "";
          //this.funciones.mensaje("info", "Existe una paralización o suspensión pendiente de su ampliación para el Reinicio de la Obra / Existe una paralización sin Acta de Reinicio de Obra");
          this.funciones.mensaje("info", this.rValidacion.mensaje);
        } else {
          this.mensajeValidarCausalAmpliacion = "validado";
        }
      });
  }

  eliminarAmpliacion(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    // let strData = { id_ampliacion: model.id_ampliacion, usuario_eliminacion: model.usuario_eliminacion }
    let strData = { id_ampliacion_obra: model.id_ampliacion_obra, usuario_eliminacion: model.usuario_eliminacion }

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.ampliacionService.eliminarAmpliacion(strData).subscribe(
          () => {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
            this.model = new Ampliacion();
            this.setControles();
            this.consultaAuditoria();
          }
        );
      }
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  setControles() {
    this.model = new Ampliacion();
    this.nombreArchivo = null;
    $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
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