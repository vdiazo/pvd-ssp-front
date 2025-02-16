import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Residente } from '../../../../../models/response/residente';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../../../../appSettings/functions';
import { FacadeService } from '../../../../../patterns/facade.service';
import $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tipoArchivo } from 'projects/sspssi/src/appSettings';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'ssi-modal-residente',
  templateUrl: './modal-residente.component.html',
  styleUrls: ['./modal-residente.component.css', '../asignacion-responsable.component.css']
})
export class ModalResidenteComponent implements OnInit {

  model: Residente;
  formGroupResidente: FormGroup;
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
  nombreArchivo: string;
  cambiarEditar = false;
  tipoArchivo = tipoArchivo.responsableResidente;
  bEstado: boolean;
  bMostrar: boolean = false;
  foto = '';
  fecha_inicio_contractual: Date;

  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService, private fb: FormBuilder) {
    this.formGroupResidente = this.fb.group({
      id_residente_seguimiento_obra: [0],
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
    this.formGroupResidente.patchValue({
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra
    });
    this.nombreArchivo = '';
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

  validarInformacionReniec() {
    const valDni = this.formGroupResidente.get('dni').value;
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
              this.formGroupResidente.patchValue({
                nombres: response.strnombres,
                apellido_paterno: response.strapellidopaterno,
                apellido_materno: response.strapellidomaterno,
              });
              this.foto = response.strfoto;
              const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
              imagen.src = response.strfoto;
            } else {
              this.funciones.mensaje('info', 'No se encontró información del Dni ingresado.');
              this.formGroupResidente.patchValue({
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
    const valDni = this.formGroupResidente.get('dni').value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formGroupResidente.patchValue({
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
    this.formGroupResidente.patchValue({
      id_residente_seguimiento_obra: 0,
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
    $('input[name="fileResidenteobra"], #fileResidenteobra').val('');
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  registrarResidente() {
    const residenteEnvio = Object.assign({}, this.formGroupResidente.value);
    residenteEnvio.fecha_designacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(residenteEnvio.fecha_designacion));
    if (this.cambiarEditar) {
      residenteEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.fs.residenteService.actualizarResidente(residenteEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupResidente.reset();
            this.setControles();
            this.cambiarEditar = false;
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      residenteEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.fs.residenteService.registrarResidente(residenteEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarResidente(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupResidente.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  editarResidente(residente) {
    this.cambiarEditar = true;
    this.formGroupResidente.patchValue({
      id_residente_seguimiento_obra: residente.id_residente_seguimiento_obra,
      id_seguimiento_monitoreo_obra: residente.id_seguimiento_monitoreo_obra,
      dni: residente.dni,
      apellido_paterno: residente.apellido_paterno,
      apellido_materno: residente.apellido_materno,
      nombres: residente.nombres,
      id_tipo_colegiatura: residente.id_tipo_colegiatura,
      nro_colegiatura: residente.nro_colegiatura,
      fecha_designacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(residente.fecha_designacion)),
      telefono: residente.telefono,
      email: residente.email,
      nombre_archivo: residente.nombre_archivo,
    });
    this.nombreArchivo = residente.nombre_archivo == null ? '' : residente.nombre_archivo;
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
              this.formGroupResidente.reset();
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
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
      this.formGroupResidente.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
