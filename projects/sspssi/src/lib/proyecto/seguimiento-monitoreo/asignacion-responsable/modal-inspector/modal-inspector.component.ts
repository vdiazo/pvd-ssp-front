import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Inspector } from '../../../../../models/response/Inspector';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../../../appSettings/functions';
import { FacadeService } from '../../../../../patterns/facade.service';
import $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { tipoArchivo } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-inspector',
  templateUrl: './modal-inspector.component.html',
  styleUrls: ['./modal-inspector.component.css', '../asignacion-responsable.component.css']
})
export class ModalInspectorComponent implements OnInit {

  model: Inspector;

  formGroupInspector: FormGroup;
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
  cambiarEditar = false;
  tipoArchivo = tipoArchivo.responsableInspector;
  foto = '';
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;
  nombreArchivo: string;
  fecha_inicio_contractual: Date;


  constructor(private modalRef: BsModalRef, public funciones: Functions, private fs: FacadeService, private fb: FormBuilder) {
    this.formGroupInspector = this.fb.group({
      id_inspector_seguimiento_obra: [0],
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
    this.formGroupInspector.patchValue({
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra
    });
    this.nombreArchivo = '';
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

  validarInformacionReniec() {
    const valDni = this.formGroupInspector.get('dni').value;
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
              this.formGroupInspector.patchValue({
                nombres: response.strnombres,
                apellido_paterno: response.strapellidopaterno,
                apellido_materno: response.strapellidomaterno,
              });
              this.foto = response.strfoto;
              const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
              imagen.src = response.strfoto;
            } else {
              this.funciones.mensaje('info', 'No se encontró información del Dni ingresado.');
              this.formGroupInspector.patchValue({
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
    const valDni = this.formGroupInspector.get('dni').value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formGroupInspector.patchValue({
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
    this.formGroupInspector.patchValue({
      id_inspector_seguimiento_obra: 0,
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
    $('input[name="fileInspectorobra"], #fileInspectorobra').val('');
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  registrarInspector() {
    const inspectorEnvio = Object.assign({}, this.formGroupInspector.value);
    inspectorEnvio.fecha_designacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(inspectorEnvio.fecha_designacion));
    if (this.cambiarEditar) {
      inspectorEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.fs.inspectorService.actualizarInspector(inspectorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupInspector.reset();
            this.setControles();
            this.cambiarEditar = false;
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      inspectorEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.fs.inspectorService.registrarInspector(inspectorEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarInspector(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupInspector.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  editarInspector(inspector) {
    this.cambiarEditar = true;
    this.formGroupInspector.patchValue({
      id_inspector_seguimiento_obra: inspector.id_inspector_seguimiento_obra,
      id_seguimiento_monitoreo_obra: inspector.id_seguimiento_monitoreo_obra,
      dni: inspector.dni,
      apellido_paterno: inspector.apellido_paterno,
      apellido_materno: inspector.apellido_materno,
      nombres: inspector.nombres,
      id_tipo_colegiatura: inspector.id_tipo_colegiatura,
      nro_colegiatura: inspector.nro_colegiatura,
      fecha_designacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(inspector.fecha_designacion)),
      telefono: inspector.telefono,
      email: inspector.email,
      nombre_archivo: inspector.nombre_archivo,
    });
    this.nombreArchivo = inspector.nombre_archivo == null ? '' : inspector.nombre_archivo;
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
              this.formGroupInspector.reset();
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
      this.formGroupInspector.patchValue({ nombre_archivo: this.nombreArchivo });
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
