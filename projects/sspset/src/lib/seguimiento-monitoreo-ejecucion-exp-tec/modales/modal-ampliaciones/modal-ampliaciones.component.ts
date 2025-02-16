import { Component, OnInit,Output,NgModule,EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Funciones } from '../../../../appSettings/funciones';
 import { SelectItem } from 'primeng/api';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AmpliacionService } from '../../../services/ampliacion.service';

import { SeguimientoMonitoreo } from '../../../../models/seguimiento-monitoreo-exp-tec';
import { tipoArchivoExpTecnico } from '../../../../appSettings/enumeraciones';

import { Ampliacion } from '../../../../models/ampliacion';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import $ from 'jquery';
import { FacadeService } from '../../../patterns/facade.service';
import { MaestraService } from '../../../services/maestra.service';

@Component({
  selector: 'set-modal-ampliaciones',
  templateUrl: './modal-ampliaciones.component.html',
  styleUrls: ['./modal-ampliaciones.component.css'],
  providers: [Funciones]
})
export class ModalAmpliacionesComponent implements OnInit {
  UltimaActualizacion: string = "";
  file: any;
  model: Ampliacion;
  id_seguimientoMonitoreoObra: number;
  rptAmpliacion;
  respAmpliacion;
  listAmpliacion;
  listaCausalidades=[];
  listaResultados=[];

  id_fase: number;
  fecha_inicio_contractual: Date;
  fecha_termino_contractual: Date;
  fecha_termino: Date;
  plazo_ejecucion: number;
  modelSeguimiento: SeguimientoMonitoreo;
  nombreArchivo: string = null;
  entidadArchivo;
  IdTipoArchivo: number = tipoArchivo.ampliacion_exp_tec;
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  NombreDocumento: string;
  bEstado: boolean;
  bMostrar: boolean = false;

  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  constructor(public modalRef: BsModalRef,
    public funciones: Funciones,
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
    this.diaHoy=new Date();
    this.diaInicial=new Date(this.diaHoy.getFullYear(), this.diaHoy.getMonth(), this.diaHoy.getDate());
    this.fechaDesignaconMax=this.diaInicial;
    this.obtenerDatosAuditoria();
    this.model = new Ampliacion();

    this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
    $(document).ready(function () {
      $('#btnLimpiar').click(function () {
        $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
      });

    });
    this.fs.ampliacionService.ListarCausalAmpliacionExpediente().subscribe(
      (data:any) => {
        this.listaCausalidades = data;
      }
    );
    this.fs.ampliacionService.ListarResultadoPedidoAmpliacion().subscribe(
      (data:any) => {
        this.listaResultados = data;
      }
    );
  }

  @Output() retornoValores = new EventEmitter();

  closeModal() {
    this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  listarAmpliacion(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.ampliacionService.listarAmpliacionExpediente(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respAmpliacion = respuesta as any;
        this.listAmpliacion = this.respAmpliacion[0].ampliacion;
        this.totalRegistros = this.respAmpliacion[0].cantidad;
        if(this.listAmpliacion!=null){
          this.listAmpliacion.forEach(element => {
            element.fecha_inicio = this.funciones.formatDate(element.fecha_inicio);
            element.fecha_fin = this.funciones.formatDate(element.fecha_fin);
            element.resolucion_fecha = this.funciones.formatDate(element.resolucion_fecha);
          });
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
    this.model = Object.assign({}, model);
    this.model.fecha_inicio = this.funciones.ConvertStringtoDate(model.fecha_inicio);
    this.model.fecha_fin = this.funciones.ConvertStringtoDate(model.fecha_fin);
    this.model.fecha_aprobacion = this.funciones.ConvertStringtoDate(model.resolucion_fecha);
    this.nombreArchivo=model.nombre_archivo;

    if (model.resultado) {
      this.model.resultado = model.resultado;
    } else {
      this.model.resultado = "Seleccione";
    }
   $('input[name="filepampliacionnmodal"]').val(model.nombre_archivo);

   
  }

  modificarAmpliacion(model) {
    model.fecha_inicio = null;
    model.fecha_fin = null;
    //actualizar
    if (model.id_actividad_ejecucion_expediente != 0) {
      model.nombre_archivo = this.nombreArchivo == null ? model.archivo_convenio : this.nombreArchivo;
      model.fecha_fin = this.funciones.SumDaytoDate(model.fecha_inicio, model.plazo_dias);
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.bMostrar = true;
      let paramModificar={
        "id_ampliacion_expediente":model.id_ampliacion_expediente,
        "id_causal_ampliacion_expediente":model.id_causal_ampliacion_expediente,
        "id_resultado_pedido_ampliacion":model.id_resultado_pedido_ampliacion,
        "plazo_dias":model.plazo_dias,
        "resolucion_aprobacion":model.resolucion_aprobacion,
        "resolucion_fecha":model.fecha_aprobacion,
        "observacion":model.observacion,
        "nombre_archivo":model.nombre_archivo,
        "usuario_modificacion":sessionStorage.getItem("Usuario")
      }



      this.fs.ampliacionService.ModificarAmpliacionExpediente(paramModificar).subscribe(
        respuesta => {
          if (respuesta > 0) {
            $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
            this.model = new Ampliacion();
            this.nombreArchivo = null;
            //this.consultaAuditoria();
          } else {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
            this.model = new Ampliacion();
            this.nombreArchivo = null;
          }
          this.bMostrar = false;
        }
      )
    }
    //registrar
    else {
      this.bMostrar = true;
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      this.model.id_seguimiento_ejecucion_expediente = this.id_seguimientoMonitoreoObra;
      model.observacion = model.observacion == undefined ? '' : model.observacion;
      let param=
        {
          "id_seguimiento_ejecucion_expediente":model.id_seguimiento_ejecucion_expediente,
          "id_causal_ampliacion_expediente":model.id_causal_ampliacion_expediente,
          "id_resultado_pedido_ampliacion":model.id_resultado_pedido_ampliacion,
          "fecha_inicio":"05-04-2019",
          "fecha_fin":"06-05-2019",
          "plazo_dias":model.plazo_dias,
          "resolucion_aprobacion":model.resolucion_aprobacion,
          "resolucion_fecha":model.fecha_aprobacion,
          "observacion":model.observacion,
          "nombre_archivo":model.nombre_archivo,
          "usuario_creacion":model.usuario_creacion
      };
      this.fs.ampliacionService.InsertarAmpliacionExpediente(param,this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            $('input[name="filepampliacionnmodal"], #filepampliacionnmodal').val("");
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
            this.model = new Ampliacion();
            this.nombreArchivo = null;
           // this.consultaAuditoria();
          } else {
            this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
            this.model = new Ampliacion();
            this.nombreArchivo = null;
          }
          this.bMostrar = false;
        }
      );
    }

  };

  eliminarAmpliacion(model) {
    if(model.id_actividad_padre!=null){
      this.funciones.alertaSimple("warning", "No puede eliminar la ampliación dado que tiene un cronograma asociado", "", true);
      return false;
    }
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");
    let strData = { 
      id_ampliacion_expediente: model.id_ampliacion_expediente, 
      usuario_eliminacion: model.usuario_eliminacion 
    }
    this.funciones.alertaRetorno("question", "<strong>¿Está seguro de eliminar el entregable?</strong>", "<div style='color:#E53935;font-weight:400;'>¡Importante!<br>Se eliminarán los informes o entregables relacionados a esta ampliación", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.ampliacionService.AnularAmpliacionExpediente(strData).subscribe(
          () => {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarAmpliacion(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
            this.model = new Ampliacion();
            this.setControles();
           // this.consultaAuditoria();
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

  /*consultaAuditoria() {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }*/
}