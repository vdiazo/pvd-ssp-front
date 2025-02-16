import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Inspector } from '../../../../models/response/Inspector';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../../../appSettings/functions';
import { FacadeService } from '../../../../patterns/facade.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-modal-inspector',
  templateUrl: './modal-inspector.component.html',
  styleUrls: ['./modal-inspector.component.css', '../asignacion-responsable.component.css']
})
export class ModalInspectorComponent implements OnInit {

  model: Inspector;
  listColegiatura = [];
  listInspector = [];
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  id_seguimientoMonitoreoObra: number;
  respInspector;
  @Output() emitResponsable = new EventEmitter();
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;

  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService) { }

  ngOnInit() {
    this.setControles();
    this.listarColegiatura();
    this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  listarColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      respuesta => {
        this.listColegiatura = respuesta as any;
      }
    )
  }

  listarInspector(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.inspectorService.listarInspector(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respInspector = respuesta as any;
        this.listInspector = this.respInspector[0].inspectores != null ? this.respInspector[0].inspectores : [];
        this.totalRegistros = this.respInspector[0].cantidad;
      }
    )
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new Inspector();
    this.file = null;
    $('input[name="fileinspector"], #fileinspector').val("");
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  modificarInspector(model, form) {
    this.bMostrar = true;
    //actualizar
    if (model.id_inspector_seguimiento_obra != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.inspectorService.actualizarInspector(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      );
    }
    //registrar
    else {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      model.id_seguimiento_monitoreo_obra = this.id_seguimientoMonitoreoObra;
      this.fs.inspectorService.registrarInspector(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      );
    }
    form.resetForm();
    this.setControles();
  }

  editarInspector(model) {
    this.setControles();
    this.model = Object.assign({}, model);
    this.model.fecha_designacion = this.funciones.ConvertStringtoDateDB(model.fecha_designacion);
    $('input[name="fileinspector"]').val(model.nombre_archivo);
  }

  eliminarInspector(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_inspector_seguimiento_obra: model.id_inspector_seguimiento_obra, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.inspectorService.eliminarInspector(strData).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
              this.setControles();
            } else {
              this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
            }
          }
        );
      }
    });
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
    }
  }
}