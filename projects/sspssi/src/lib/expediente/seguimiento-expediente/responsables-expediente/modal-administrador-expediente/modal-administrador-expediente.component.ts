import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { AdministradorContratoService } from 'projects/sspssi/src/servicios/expediente/responsables/administrador-contrato.service';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { Functions } from 'projects/sspssi/src/appSettings';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'ssi-modal-administrador-expediente',
  templateUrl: './modal-administrador-expediente.component.html',
  styleUrls: ['./modal-administrador-expediente.component.css']
})
export class ModalAdministradorExpedienteComponent implements OnInit {

  formGroupAdministrador: FormGroup;
  listaAdministradorExpediente: any = [];
  rptaListadoAdministradorExpediente: any;
  id_seguimientoMonitoreoExpediente: number;
  fecha_inicio_contractual: Date;
  bEstado: boolean;
  model;
  tipoArchivo = tipoArchivo.administradorProyecto;
  nombreArchivo: string;
  cambiarEditar = false;
  listaTipoColegiatura: any = [];
  foto = '';
  bMostrar = false;
  totalRegistros;
  paginaActiva = 0;
  numero_Pagina = 0;
  num_filas = 5;
  numPaginasMostrar = 5;

  @Output() emitResponsableAdministrador = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private fs: FacadeService, private administradorService: AdministradorContratoService, public funciones: Functions) { }

  ngOnInit() {
    this.fecha_inicio_contractual = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.fecha_inicio_contractual));
    this.formGroupAdministrador = this.fb.group({
      id_administrador_contrato_seguimiento_expediente: [0],
      id_seguimiento_ejecucion_expediente: [this.id_seguimientoMonitoreoExpediente],
      dni: [null, Validators.required],
      apellido_paterno: [null],
      apellido_materno: [null],
      nombres: [null],
      id_tipo_colegiatura_expediente: [null, Validators.required],
      nro_colegiatura: [null, Validators.required],
      fecha_designacion: [null, Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre_archivo: [null],
    });
    this.nombreArchivo = '';
    this.listarTipoColegiatura();
    this.listarAdministradorContratoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
  }

  listarAdministradorContratoExpediente(id_seguimientoMonitoreoExpediente: number, nro_pagina: number, nro_paginas: number) {
    this.administradorService.listarAdministradorExpediente(id_seguimientoMonitoreoExpediente, nro_pagina, nro_paginas).subscribe(
      data => {
        this.rptaListadoAdministradorExpediente = data;
        this.totalRegistros = this.rptaListadoAdministradorExpediente[0].cantidad;
        if (this.totalRegistros > 0) {
          this.listaAdministradorExpediente = this.rptaListadoAdministradorExpediente[0].administrador_contrato;
        } else {
          this.listaAdministradorExpediente = [];
        }
      }
    );
  }
  listarTipoColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      data => {
        this.listaTipoColegiatura = data;
      }
    );
  }

  registrarAdministrador() {
    const administradorEnvio = Object.assign({}, this.formGroupAdministrador.value);
    administradorEnvio.fecha_designacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(administradorEnvio.fecha_designacion));
    if (this.cambiarEditar) {
      administradorEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.administradorService.actualizarAdministradorExpediente(administradorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarAdministradorContratoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formGroupAdministrador.reset();
            this.setControles();
            this.cambiarEditar = false;
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      administradorEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.administradorService.registrarAdministradorExpediente(administradorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarAdministradorContratoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formGroupAdministrador.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  editarAdministrador(administrador) {
    this.cambiarEditar = true;
    this.formGroupAdministrador.patchValue({
      id_administrador_contrato_seguimiento_expediente: administrador.id_administrador_contrato_seguimiento_expediente,
      id_seguimiento_ejecucion_expediente: administrador.id_seguimiento_ejecucion_expediente,
      dni: administrador.dni,
      apellido_paterno: administrador.apellido_paterno,
      apellido_materno: administrador.apellido_materno,
      nombres: administrador.nombres,
      id_tipo_colegiatura_expediente: administrador.id_tipo_colegiatura_expediente,
      nro_colegiatura: administrador.nro_colegiatura,
      fecha_designacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(administrador.fecha_designacion)),
      telefono: administrador.telefono,
      email: administrador.email,
      nombre_archivo: administrador.nombre_archivo,
    });
    this.nombreArchivo = administrador.nombre_archivo == null ? '' : administrador.nombre_archivo;
  }

  eliminarAdministrador(idAdministrador) {
    const param = {
      id_administrador_contrato_seguimiento_expediente: idAdministrador,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };

    this.funciones.alertaRetorno('question', '¿Esta seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.administradorService.anularAdministradorExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.listarAdministradorContratoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
              this.formGroupAdministrador.reset();
              this.setControles();
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          }
        );
      }
    });
  }

  validarInformacionReniec() {
    const valDni = this.formGroupAdministrador.get('dni').value;
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
              this.formGroupAdministrador.patchValue({
                nombres: response.strnombres,
                apellido_paterno: response.strapellidopaterno,
                apellido_materno: response.strapellidomaterno,
              });
              this.foto = response.strfoto;
              const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
              imagen.src = response.strfoto;
            } else {
              this.funciones.mensaje('info', 'No se encontró información del Dni ingresado.');
              this.formGroupAdministrador.patchValue({
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
    const valDni = this.formGroupAdministrador.get('dni').value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formGroupAdministrador.patchValue({
        nombres: null,
        apellido_paterno: null,
        apellido_materno: null
      });
      const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
      imagen.src = '';
    }
  }

  closeModal() {
    this.bsModal.hide();
    this.emitResponsableAdministrador.emit(this.id_seguimientoMonitoreoExpediente);
  }

  setControles() {
    this.formGroupAdministrador.patchValue({
      id_administrador_contrato_seguimiento_expediente: 0,
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
    $('input[name="fileadministradorexpe"], #fileadministradorexpe').val('');
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
      this.formGroupAdministrador.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAdministradorContratoExpediente(this.id_seguimientoMonitoreoExpediente, this.numero_Pagina, this.numPaginasMostrar);
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
