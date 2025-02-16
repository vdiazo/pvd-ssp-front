import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AvanceSeguimientoExpedienteService } from 'projects/sspssi/src/servicios/expediente/avance-expediente/avance-seguimiento-expediente.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { isUndefined } from 'util';

@Component({
  selector: 'ssi-modal-entregable-expediente',
  templateUrl: './modal-entregable-expediente.component.html',
  styleUrls: ['./modal-entregable-expediente.component.css']
})
export class ModalEntregableExpedienteComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  formEdicionEntregable: FormGroup;
  listaDocumentoAprobacion: any = [];
  listaInformes: any = [];
  listaComponentes: any = [];
  listaEntregables: any = [];
  listaEstadoEntregableExpediente: any = [];
  entidadEditar: any;
  esAprobado = false;
  tipoArchivoDocumentoPresentacion = tipoArchivo.presentacionEntregables;
  tipoArchivoDocumentoAprob = tipoArchivo.aprobacionEntregables;
  nombreArchivoDocumento: string;
  nombreArchivoDocumentoAprob: string;
  bEstado: boolean;
  cambiarEditar = false;
  fecha_inicio_contractual: Date;
  @Output() retornoValoresAvance = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, public funciones: Functions, private avanceSeguimientoExpedienteService: AvanceSeguimientoExpedienteService) {
    this.formEdicionEntregable = this.fb.group({
      documento_aprobacion: [null],
      id_avance_informe: [0],
      id_informe_expediente: [null],
      denominacion: [null],
      fecha_presentacion: [null, Validators.required],
      fecha_conformidad: [null],
      nombre_archivo_presentacion: [null],
      nombre_archivo_conformidad: [null],
      monto_informe_neto: [null, Validators.required],
      observacion: [null]
    });
  }

  ngOnInit() {
    this.listarCombosAvanceEntregable();
    this.fecha_inicio_contractual = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.fecha_inicio_contractual));
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      this.formEdicionEntregable.patchValue({
        documento_aprobacion: this.entidadEditar.id_tipo_seguimiento_actividad,
        id_informe_expediente: this.entidadEditar.id_informe_expediente,
        id_avance_informe: this.entidadEditar.id_avance_informe,
        denominacion: this.entidadEditar.denominacion,
        fecha_presentacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_presentacion)),
        nombre_archivo_presentacion: this.entidadEditar.nombre_archivo_presentacion,
        fecha_conformidad: this.entidadEditar.fecha_conformidad == '-infinity' ? null : this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_conformidad)),
        nombre_archivo_conformidad: this.entidadEditar.nombre_archivo_conformidad,
        monto_informe_neto: this.entidadEditar.monto_informe_neto,
        observacion: this.entidadEditar.observacion,
      });
      this.nombreArchivoDocumento = this.entidadEditar.nombre_archivo_presentacion == null ? '' : this.entidadEditar.nombre_archivo_presentacion;
      this.nombreArchivoDocumentoAprob = this.entidadEditar.nombre_archivo_conformidad == null ? '' : this.entidadEditar.nombre_archivo_conformidad;
    } else {
      this.nombreArchivoDocumento = '';
      this.nombreArchivoDocumentoAprob = '';
    }
  }

  grabarEntregable() {
    const entregableAvanceEnvio = Object.assign({}, this.formEdicionEntregable.value);
    entregableAvanceEnvio.fecha_presentacion = this.funciones.formatDateAAAAMMDD(this.envioFecha(entregableAvanceEnvio.fecha_presentacion));
    entregableAvanceEnvio.fecha_conformidad = entregableAvanceEnvio.fecha_conformidad == null ? '' : this.funciones.formatDateAAAAMMDD(this.envioFecha(entregableAvanceEnvio.fecha_conformidad));
    entregableAvanceEnvio.monto_informe_neto = entregableAvanceEnvio.monto_informe_neto == null ? 0 : this.funciones.castToFloat(entregableAvanceEnvio.monto_informe_neto);

    if (this.cambiarEditar) {
      entregableAvanceEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.avanceSeguimientoExpedienteService.modificarAvanceEntregableExpediente(entregableAvanceEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresAvance.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      entregableAvanceEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.avanceSeguimientoExpedienteService.insertarAvanceEntregableExpediente(entregableAvanceEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresAvance.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  fileChangeEventDocumento(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivoDocumento = rpta.uploaded._body;
      this.formEdicionEntregable.patchValue({ nombre_archivo_presentacion: this.nombreArchivoDocumento });
    }
  }

  fileChangeEventDocumentoAprob(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivoDocumentoAprob = rpta.uploaded._body;
      this.formEdicionEntregable.patchValue({ nombre_archivo_conformidad: this.nombreArchivoDocumentoAprob });
    }
  }

  listarCombosAvanceEntregable() {
    this.avanceSeguimientoExpedienteService.listarComboEntregableExpediente(this.id_seguimientoMonitoreoExpediente).subscribe(
      data => {
        this.listaDocumentoAprobacion = data.cronograma;
        this.rellenarControlesEdicion(this.entidadEditar);
      }
    );
  }

  seleccionarCronograma(event: any) {
    this.formEdicionEntregable.patchValue({
      id_informe_expediente: null,
    });
    if (!isUndefined(event)) {
      this.listaDocumentoAprobacion.forEach(element => {
        if (element.id_tipo_seguimiento_actividad == event.id_tipo_seguimiento_actividad) {
          this.listaInformes = element.informe;
          this.listaInformes.forEach(informe => {
            informe.nro_informe_expediente = `Informe N° ${informe.num_informe}`;
          });
        }
      });
    } else {
      this.listaInformes = [];
    }
  }

  closeModal() {
    this.bsModal.hide();
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  rellenarControlesEdicion(avanceEdicion: any) {
    if (this.cambiarEditar) {
      this.listaDocumentoAprobacion.forEach(element => {
        if (element.id_tipo_seguimiento_actividad == avanceEdicion.id_tipo_seguimiento_actividad) {
          this.listaInformes = element.informe;
          this.listaInformes.forEach(informe => {
            informe.nro_informe_expediente = `Informe N° ${informe.num_informe}`;
          });
        }
      });
    }
  }
}
