import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { AmpliacionExpedienteService } from 'projects/sspssi/src/servicios/expediente/ampliacion-expediente.service';

@Component({
  selector: 'ssi-modal-ampliacion-expediente',
  templateUrl: './modal-ampliacion-expediente.component.html',
  styleUrls: ['./modal-ampliacion-expediente.component.css']
})
export class ModalAmpliacionExpedienteComponent implements OnInit {

  formGroupAmpliacion: FormGroup;
  id_seguimientoMonitoreoExpediente: number;
  fecha_inicio_contractual: Date;
  bEstado: boolean;
  cambiarEditar = false;
  tipoArchivo = tipoArchivo.ampliacionExpediente;
  nombreArchivo: string;
  listaCausalidades: any = [];

  listAmpliacionExpediente: any = [];
  rptaAmpliacionExpediente: any;

  UltimaActualizacion = '';

  totalRegistros;
  paginaActiva = 0;
  numero_Pagina = 0;
  num_filas = 5;
  numPaginasMostrar = 5;
  bMostrar = false;

  @Output() retornoValores = new EventEmitter();

  constructor(public bsModalRef: BsModalRef, public funciones: Functions, private fb: FormBuilder, private fs: FacadeService, private sMant: MaestraSsiService, private ampliacionExpService: AmpliacionExpedienteService) { }

  ngOnInit() {
    this.fecha_inicio_contractual = this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.fecha_inicio_contractual));
    this.obtenerDatosAuditoria();
    this.formGroupAmpliacion = this.fb.group({
      id_ampliacion_expediente: [0],
      id_seguimiento_ejecucion_expediente: [this.id_seguimientoMonitoreoExpediente],
      plazo_dias: [null, Validators.required],
      resolucion_aprobacion: [null, Validators.required],
      resolucion_fecha: [null, Validators.required],
      nombre_archivo: [null],
      id_causal_ampliacion_expediente: [null, Validators.required],
      observacion: [null]
    });
    this.nombreArchivo = '';

    this.listarCausalAmpliacion();
    this.listarAmpliacionExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
  }

  listarAmpliacionExpediente(id_SeguimientoMonitoreoExpediente, filas, pagina) {
    this.ampliacionExpService.listarAmpliacionExpediente(id_SeguimientoMonitoreoExpediente, filas, pagina).subscribe(
      data => {
        this.rptaAmpliacionExpediente = data;
        this.totalRegistros = this.rptaAmpliacionExpediente[0].cantidad;
        if (this.totalRegistros > 0) {
          this.listAmpliacionExpediente = this.rptaAmpliacionExpediente[0].ampliacion;
        } else {
          this.listAmpliacionExpediente = [];
        }
      }
    );
  }

  grabarAmpliacion() {
    const ampliacionEnvio = Object.assign({}, this.formGroupAmpliacion.value);
    ampliacionEnvio.resolucion_fecha = this.funciones.formatDateAAAAMMDD(this.envioFecha(ampliacionEnvio.resolucion_fecha));
    ampliacionEnvio.plazo_dias = parseInt(ampliacionEnvio.plazo_dias, 10);
    if (this.cambiarEditar) {
      ampliacionEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.ampliacionExpService.modificarAmpliacionExpediente(ampliacionEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValores.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarAmpliacionExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formGroupAmpliacion.reset();
            this.setControles();
            this.consultaAuditoria();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      ampliacionEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.ampliacionExpService.registrarAmpliacionExpediente(ampliacionEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValores.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarAmpliacionExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formGroupAmpliacion.reset();
            this.setControles();
            this.consultaAuditoria();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    }
  }

  editarAmpliacion(ampliacion) {
    this.cambiarEditar = true;
    this.formGroupAmpliacion.patchValue({
      id_ampliacion_expediente: ampliacion.id_ampliacion_expediente,
      plazo_dias: ampliacion.plazo_dias,
      resolucion_aprobacion: ampliacion.resolucion_aprobacion,
      resolucion_fecha: this.funciones.ConvertStringtoDate(this.funciones.formatDate(ampliacion.resolucion_fecha)),
      nombre_archivo: ampliacion.nombre_archivo,
      id_causal_ampliacion_expediente: ampliacion.id_causal_ampliacion_expediente,
      observacion: ampliacion.observacion,
    });
    this.nombreArchivo = ampliacion.nombre_archivo == null ? '' : ampliacion.nombre_archivo;
  }

  eliminarAmpliacion(idAmpliacion) {
    const param = {
      id_ampliacion_expediente: idAmpliacion,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };

    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.ampliacionExpService.anularAmpliacionExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.retornoValores.emit(this.id_seguimientoMonitoreoExpediente);
              this.listarAmpliacionExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
              this.formGroupAmpliacion.reset();
              this.setControles();
              this.consultaAuditoria();
            }
          }
        );
      }
    });
  }

  listarCausalAmpliacion() {
    this.fs.ampliacionService.listarCausalidades().subscribe(data => {
      this.listaCausalidades = data;
    });
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
      this.formGroupAmpliacion.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAmpliacionExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
  }

  setControles() {
    this.formGroupAmpliacion.patchValue({
      id_ampliacion: 0,
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
    $('input[name="fileampliacionmodal"], #fileampliacionmodal').val('');
  }

  consultaAuditoria() {
    this.sMant.consultDatosAuditoriaExpediente(sessionStorage.getItem('idFase')).subscribe(
      respuesta => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }

  obtenerDatosAuditoria() {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      let infoAuditoria = dAuditoria.find(c => c.opcion == 'Ampliacion');
      if (infoAuditoria != undefined) {
        // this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario) + ' - ' + (infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha));
        this.UltimaActualizacion = `${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        this.UltimaActualizacion = '';
      }
    } else {
      this.UltimaActualizacion = '';
    }
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }
}
