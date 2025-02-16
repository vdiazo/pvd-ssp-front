import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supervisor } from '../../../../models/response/supervisor';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../../../appSettings/functions';
import { FacadeService } from '../../../../patterns/facade.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-modal-supervisor',
  templateUrl: './modal-supervisor.component.html',
  styleUrls: ['./modal-supervisor.component.css', '../asignacion-responsable.component.css']
})
export class ModalSupervisorComponent implements OnInit {

  model: Supervisor;
  listColegiatura = [];
  listSupervisor = [];
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  respSupervisor;
  id_seguimientoMonitoreoObra: number;
  @Output() emitResponsable = new EventEmitter();
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;

  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService) { }

  ngOnInit() {
    this.setControles();
    this.listarColegiatura();
    this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  listarColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      respuesta => {
        this.listColegiatura = respuesta as any;
      }
    )
  }

  listarSupervisor(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.supervisorService.listarSupervisor(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respSupervisor = respuesta as any;
        this.listSupervisor = this.respSupervisor[0].supervisores != null ? this.respSupervisor[0].supervisores : [];
        this.totalRegistros = this.respSupervisor[0].cantidad;
      }
    )
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new Supervisor();
    this.file = null;
    $('input[name="filesupervisor"], #filesupervisor').val("");
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  modificarSupervisor(model, form) {
    this.bMostrar = true;
    //actualizar
    if (model.id_supervisor_seguimiento_obra != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.supervisorService.actualizarSupervisor(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
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
      this.fs.supervisorService.registrarSupervisor(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
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

  editarSupervisor(model) {
    this.setControles();
    this.model = Object.assign({}, model);
    this.model.fecha_designacion = this.funciones.ConvertStringtoDateDB(model.fecha_designacion);
    $('input[name="filesupervisor"]').val(model.nombre_archivo);
  }

  eliminarSupervisor(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_supervisor_seguimiento_obra: model.id_supervisor_seguimiento_obra, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.supervisorService.eliminarSupervisor(strData).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
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