import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Residente } from '../../../../models/response/residente';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../../../appSettings/functions';
import { FacadeService } from '../../../../patterns/facade.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-modal-residente',
  templateUrl: './modal-residente.component.html',
  styleUrls: ['./modal-residente.component.css', '../asignacion-responsable.component.css']
})
export class ModalResidenteComponent implements OnInit {

  model: Residente;
  listColegiatura = [];
  listResidente = [];
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  respResidente;
  id_seguimientoMonitoreoObra: number;
  @Output() emitResponsable = new EventEmitter();
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;

  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService) { }

  ngOnInit() {
    this.setControles();
    this.listarColegiatura();
    this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  listarColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      respuesta => {
        this.listColegiatura = respuesta as any;
      }
    )
  }

  listarResidente(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.residenteService.listarResidente(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respResidente = respuesta as any;
        this.listResidente = this.respResidente[0].residentes != null ? this.respResidente[0].residentes : [];
        this.totalRegistros = this.respResidente[0].cantidad;
      }
    )
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new Residente();
    this.file = null;
    $('input[name="fileresidente"], #fileresidente').val("");
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  modificarResidente(model, form) {
    this.bMostrar = true;
    //actualizar
    if (model.id_residente_seguimiento_obra != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.residenteService.actualizarResidente(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
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
      this.fs.residenteService.registrarResidente(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
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

  editarResidente(model) {
    this.setControles();
    this.model = Object.assign({}, model);
    this.model.fecha_designacion = this.funciones.ConvertStringtoDateDB(model.fecha_designacion);
    $('input[name="fileresidente"]').val(model.nombre_archivo);
  }

  eliminarResidente(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_residente_seguimiento_obra: model.id_residente_seguimiento_obra, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.residenteService.eliminarResidente(strData).subscribe(
          respuesta2 => {
            if (respuesta2) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
              this.setControles();
            } else {
              this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
            }
          }
        )
      }
    });
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
    }
  }
}