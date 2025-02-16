import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EntregaTerrenoService } from 'projects/sspssi/src/servicios/expediente/entrega-terreno.service';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ssi-modal-entrega-terreno',
  templateUrl: './modal-entrega-terreno.component.html',
  styleUrls: ['./modal-entrega-terreno.component.css']
})
export class ModalEntregaTerrenoComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  bEstado: boolean;
  bMostrar: boolean;
  rptaActaEntregaTerreno: any;
  cantidadRegistroActa: number;
  listActaEntregaTerreno: any = [];
  nombreArchivo: string;
  tipoArchivo = tipoArchivo.actaEntregaTerrenoExpediente;
  UltimaActualizacion: string;
  formEntregaTerreno: FormGroup;
  @Output() retornoValoresTerreno = new EventEmitter();
  cambiarEditar = false;
  paginaActiva = 0;
  numero_Pagina = 0;
  num_filas = 5;
  numPaginasMostrar = 5;


  constructor(private actaTerrenoService: EntregaTerrenoService, public funciones: Functions, private fb: FormBuilder, private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.formEntregaTerreno = this.fb.group({
      id_terreno: [0],
      id_seguimiento_ejecucion_expediente: [this.id_seguimientoMonitoreoExpediente],
      disponibilidad_terreno: [true],
      fecha_entrega_terreno: [null, Validators.required],
      nombre_archivo: [null, Validators.required],
      observacion: [null],
    });
    this.nombreArchivo = '';

    this.listarActaEntregaTerreno(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
  }

  listarActaEntregaTerreno(idSeguimiento: number, num_filas: number, numero_Pagina: number) {
    this.actaTerrenoService.listarEntregaTerreno(idSeguimiento, num_filas, numero_Pagina).subscribe(
      respuesta => {
        this.rptaActaEntregaTerreno = respuesta;
        this.cantidadRegistroActa = this.rptaActaEntregaTerreno.cantidad_registro;
        if (this.cantidadRegistroActa > 0) {
          this.listActaEntregaTerreno = this.rptaActaEntregaTerreno.terreno;
        } else {
          this.listActaEntregaTerreno = [];
        }
      });
  }

  procesarActaTerreno() {
    const entregaTerrenoEnvio = Object.assign({}, this.formEntregaTerreno.value);
    entregaTerrenoEnvio.fecha_entrega_terreno = this.funciones.formatDateAAAAMMDD(this.envioFecha(entregaTerrenoEnvio.fecha_entrega_terreno));
    if (this.cambiarEditar) {
      // edicion
      entregaTerrenoEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.actaTerrenoService.modificarEntregaTerreno(entregaTerrenoEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresTerreno.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarActaEntregaTerreno(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formEntregaTerreno.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        }
      );
    } else {
      // insertar
      entregaTerrenoEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.actaTerrenoService.registrarEntregaTerreno(entregaTerrenoEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresTerreno.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarActaEntregaTerreno(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formEntregaTerreno.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        }
      );
    }
  }

  eliminarEntregaTerreno(idEntregaTerreno: number) {
    const param = {
      id_terreno: idEntregaTerreno,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };

    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.actaTerrenoService.anularEntregaTerreno(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.retornoValoresTerreno.emit(this.id_seguimientoMonitoreoExpediente);
              this.listarActaEntregaTerreno(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
              this.formEntregaTerreno.reset();
              this.setControles();
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        );
      }
    });
  }

  editarEntregaTerreno(entregaTerreno) {
    this.cambiarEditar = true;
    this.formEntregaTerreno.patchValue({
      id_terreno: entregaTerreno.id_terreno,
      id_seguimiento_ejecucion_expediente: entregaTerreno.id_seguimiento_ejecucion_expediente,
      disponibilidad_terreno: entregaTerreno.disponibilidad_terreno,
      fecha_entrega_terreno: this.funciones.ConvertStringtoDate(entregaTerreno.fecha_entrega_terreno),
      nombre_archivo: entregaTerreno.nombre_archivo,
      observacion: entregaTerreno.observacion,
    });
    this.nombreArchivo = entregaTerreno.nombre_archivo == null ? '' : entregaTerreno.nombre_archivo;
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
      this.formEntregaTerreno.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }
  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  setControles() {
    this.formEntregaTerreno.patchValue({
      id_terreno: 0,
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
      disponibilidad_terreno: true,
    });
    this.nombreArchivo = null;
    this.cambiarEditar = false;
  }
}
