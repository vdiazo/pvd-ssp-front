import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { tipoArchivo } from 'projects/sspssi/src/appSettings/enumeraciones';
import { AdelantoExpedienteService } from 'projects/sspssi/src/servicios/expediente/adelanto-expediente.service';

@Component({
  selector: 'ssi-modal-adelanto-expediente',
  templateUrl: './modal-adelanto-expediente.component.html',
  styleUrls: ['./modal-adelanto-expediente.component.css']
})
export class ModalAdelantoExpedienteComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  formAdelantoExpediente: FormGroup;
  listaAdelantoExpediente: any = [];
  rptaListaAdelantoExpediente: any;
  bEstado: boolean;
  bMostrar = false;
  minDate: Date;
  maxDate: Date;

  tipoArchivo = tipoArchivo.adelantoDirectoExpediente;
  nombreArchivo: string;
  cambiarEditar = false;
  tieneArchivo = false;

  paginaActiva = 0;
  numero_Pagina = 0;
  num_filas = 5;
  numPaginasMostrar = 5;
  totalRegistros: number;

  @Output() retornoValorAdelanto = new EventEmitter();

  constructor(private fb: FormBuilder, public modalRef: BsModalRef, public funciones: Functions, private adelantoService: AdelantoExpedienteService) { }

  ngOnInit() {
    this.formAdelantoExpediente = this.fb.group({
      id_adelanto_directo: [0],
      id_seguimiento_ejecucion_expediente: [this.id_seguimientoMonitoreoExpediente],
      nombre_adelanto_directo: ['', Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_termino: [null, Validators.required],
      monto_garantia: ['', Validators.required],
      monto_adelanto: ['', Validators.required],
      entidad_financiera: ['', Validators.required],
      nombre_archivo: [null],
    });

    this.nombreArchivo = '';
    this.formAdelantoExpediente.markAsUntouched();
    this.formAdelantoExpediente.markAsPristine();

    this.formAdelantoExpediente.get('fecha_inicio').valueChanges.subscribe(
      (e: Date) => {
        this.minDate = e;
      }
    )

    this.formAdelantoExpediente.get('fecha_termino').valueChanges.subscribe(
      (e: Date) => {
        this.maxDate = e;
      }
    )
    this.listarAdelantoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
  }

  listarAdelantoExpediente(idSeguimientoExpediente, num_filas, numero_Pagina) {
    this.adelantoService.listarAdelantoDirectoExpediente(idSeguimientoExpediente, num_filas, numero_Pagina).subscribe(
      data => {
        this.rptaListaAdelantoExpediente = data;
        this.totalRegistros = this.rptaListaAdelantoExpediente.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaAdelantoExpediente = this.rptaListaAdelantoExpediente.adelanto_directo;
        } else {
          this.listaAdelantoExpediente = [];
        }
      }
    );
  }

  grabarAdelantoExpediente() {
    const adelantoEnvio = Object.assign({}, this.formAdelantoExpediente.value);
    adelantoEnvio.fecha_inicio = this.funciones.formatDateAAAAMMDD(this.envioFecha(adelantoEnvio.fecha_inicio));
    adelantoEnvio.fecha_termino = this.funciones.formatDateAAAAMMDD(this.envioFecha(adelantoEnvio.fecha_termino));
    adelantoEnvio.monto_adelanto = this.funciones.castToFloat(adelantoEnvio.monto_adelanto);
    adelantoEnvio.monto_garantia = this.funciones.castToFloat(adelantoEnvio.monto_garantia);

    if (this.cambiarEditar) {
      adelantoEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.adelantoService.modificarAdelantoDirectoExpediente(adelantoEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValorAdelanto.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarAdelantoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formAdelantoExpediente.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    } else {
      adelantoEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.adelantoService.registrarAdelantoDirectoExpediente(adelantoEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValorAdelanto.emit(this.id_seguimientoMonitoreoExpediente);
            this.listarAdelantoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
            this.formAdelantoExpediente.reset();
            this.setControles();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        }
      );
    }

  }

  editarAdelantoExpediente(ampliacion) {
    this.cambiarEditar = true;
    this.formAdelantoExpediente.patchValue({
      id_adelanto_directo: ampliacion.id_adelanto_directo,
      id_seguimiento_ejecucion_expediente: ampliacion.id_seguimiento_ejecucion_expediente,
      nombre_adelanto_directo: ampliacion.nombre_adelanto_directo,
      fecha_inicio: this.funciones.ConvertStringtoDate(ampliacion.fecha_inicio),
      fecha_termino: this.funciones.ConvertStringtoDate(ampliacion.fecha_termino),
      monto_garantia: ampliacion.monto_garantia,
      monto_adelanto: ampliacion.monto_adelanto,
      entidad_financiera: ampliacion.entidad_financiera,
      nombre_archivo: ampliacion.nombre_archivo,
    });
    this.nombreArchivo = ampliacion.nombre_archivo == null ? '' : ampliacion.nombre_archivo;
  }

  eliminarAdelantoExpediente(idAdelanto) {
    let param = {
      id_adelanto_directo: idAdelanto,
      usuario_eliminacion: sessionStorage.getItem('Usuario'),
    };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.adelantoService.anularAdelantoDirectoExpediente(param).subscribe(
          rpta => {
            if (rpta > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('eliminacion', ''));
              this.retornoValorAdelanto.emit(this.id_seguimientoMonitoreoExpediente);
              this.listarAdelantoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
              this.formAdelantoExpediente.reset();
              this.setControles();
            }
          }
        );
      }
    });
  }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.tieneArchivo = false;
      this.nombreArchivo = evento.uploaded._body;
      this.formAdelantoExpediente.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  setControles() {
    // this.model = new AmpliacionExpTec();
    this.nombreArchivo = null;
    $('input[name="fileadelantomodal"], #fileadelantomodal').val('');
    this.cambiarEditar = false;
    this.formAdelantoExpediente.patchValue({
      id_adelanto_directo: 0,
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
    });
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAdelantoExpediente(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
  }
}
