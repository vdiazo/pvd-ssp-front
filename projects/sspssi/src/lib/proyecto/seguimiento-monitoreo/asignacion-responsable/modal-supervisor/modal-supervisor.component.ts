import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supervisor } from '../../../../../models/response/supervisor';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../../../../appSettings/functions';
import { FacadeService } from '../../../../../patterns/facade.service';
import $ from 'jquery';
import { tipoArchivo } from 'projects/sspssi/src/appSettings';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'ssi-modal-supervisor',
  templateUrl: './modal-supervisor.component.html',
  styleUrls: ['./modal-supervisor.component.css', '../asignacion-responsable.component.css']
})
export class ModalSupervisorComponent implements OnInit {

  model: Supervisor;
  formGroupSupervisor: FormGroup;
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
  nombreArchivo: string;
  cambiarEditar = false;
  tipoArchivo = tipoArchivo.responsableSupervisor;
  foto = '';
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;
  fecha_inicio_contractual: Date;

  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService, private fb: FormBuilder) {
    this.formGroupSupervisor = this.fb.group({
      id_supervisor_seguimiento_obra: [0],
      id_seguimiento_monitoreo_obra: [0],
      dni: [null, Validators.required],
      apellido_paterno: [null],
      apellido_materno: [null],
      nombres: [null],
      id_tipo_colegiatura: [null, Validators.required],
      nro_colegiatura: [null, Validators.required],
      fecha_designacion: [null, Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre_archivo: [null],
    });
  }

  ngOnInit() {
    this.formGroupSupervisor.patchValue({
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra
    });
    this.nombreArchivo = '';
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
      (respuesta: any) => {
        this.respSupervisor = respuesta;
        this.listSupervisor = this.respSupervisor[0].supervisores != null ? this.respSupervisor[0].supervisores : [];
        this.totalRegistros = this.respSupervisor[0].cantidad;
      }
    )
  }

  validarInformacionReniec() {
    const valDni = this.formGroupSupervisor.get('dni').value;
    const cant = 0;
    if (valDni == '' || valDni == null) {
      document.getElementById('txtDni').focus();
      this.funciones.mensaje('info', 'Debe ingresar el N° de Dni a validar.');
    } else {
      if (cant == 0) {
        this.fs.dataExternaService.consultarInformacionReniec(valDni).subscribe(
          data => {
            const response = data as any;
            if (data != null && data != '') {
              this.formGroupSupervisor.patchValue({
                nombres: response.strnombres,
                apellido_paterno: response.strapellidopaterno,
                apellido_materno: response.strapellidomaterno,
              });
              this.foto = response.strfoto;
              const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
              imagen.src = response.strfoto;
            } else {
              this.funciones.mensaje('info', 'No se encontró información del Dni ingresado.');
              this.formGroupSupervisor.patchValue({
                nombre: null,
                apellido_paterno: null,
                apellido_materno: null
              });
              let imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
              imagen.src = '';
            }
          },
          error => this.funciones.mensaje('info', 'No se encontró información del Dni ingresado.')
        );
      } else {
        this.funciones.mensaje('info', 'El DNI ingresado ya se encuentra registrado en el sistema.');
      }
    }
  }

  validarDNI() {
    const valDni = this.formGroupSupervisor.get('dni').value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formGroupSupervisor.patchValue({
        nombres: null,
        apellido_paterno: null,
        apellido_materno: null
      });
      const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
      imagen.src = '';
    }
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.formGroupSupervisor.patchValue({
      id_supervisor_seguimiento_obra: 0,
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
    $('input[name="fileSupervisorobra"], #fileSupervisorobra').val('');
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  registrarSupervisor() {
    const supervisorEnvio = Object.assign({}, this.formGroupSupervisor.value);
    supervisorEnvio.fecha_designacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(supervisorEnvio.fecha_designacion));
    if (this.cambiarEditar) {
      supervisorEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.fs.supervisorService.actualizarSupervisor(supervisorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupSupervisor.reset();
            this.setControles();
            this.cambiarEditar = false;
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      supervisorEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.fs.supervisorService.registrarSupervisor(supervisorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarSupervisor(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupSupervisor.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  editarSupervisor(supervisor) {
    this.cambiarEditar = true;
    this.formGroupSupervisor.patchValue({
      id_supervisor_seguimiento_obra: supervisor.id_supervisor_seguimiento_obra,
      id_seguimiento_monitoreo_obra: supervisor.id_seguimiento_monitoreo_obra,
      dni: supervisor.dni,
      apellido_paterno: supervisor.apellido_paterno,
      apellido_materno: supervisor.apellido_materno,
      nombres: supervisor.nombres,
      id_tipo_colegiatura: supervisor.id_tipo_colegiatura,
      nro_colegiatura: supervisor.nro_colegiatura,
      fecha_designacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(supervisor.fecha_designacion)),
      telefono: supervisor.telefono,
      email: supervisor.email,
      nombre_archivo: supervisor.nombre_archivo,
    });
    this.nombreArchivo = supervisor.nombre_archivo == null ? '' : supervisor.nombre_archivo;
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
              this.formGroupSupervisor.reset();
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
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
      this.formGroupSupervisor.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
