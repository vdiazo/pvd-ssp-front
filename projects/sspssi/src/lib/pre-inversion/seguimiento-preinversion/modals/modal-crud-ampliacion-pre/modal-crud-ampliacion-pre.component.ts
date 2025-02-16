import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmpliacionPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/ampliacion-preinversion.service';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { isUndefined } from 'util';
import { param } from 'jquery';

@Component({
  selector: 'ssi-modal-crud-ampliacion-pre',
  templateUrl: './modal-crud-ampliacion-pre.component.html',
  styleUrls: ['./modal-crud-ampliacion-pre.component.css']
})
export class ModalCrudAmpliacionPreComponent implements OnInit {

  id_seguimientoMonitoreoPreinversion: number = 0;
  formRegistroAmpliacion: FormGroup;
  lstAmpliacionPreinversion: any[] = [];
  lstAmpliacionCausal: any[] = [];
  lstAmpliacionPedido: any[] = [];

  cambiarEditar: boolean = false;
  verOtraCausal: boolean = false;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  fecha_inicio_contractual: Date;
  documentoAprobacion: string = '';
  tipoArchivo: number = tipoArchivo.ampliacionPreinversion;
  UltimaActualizacion: string = '';
  @Output() retornoValorAmpliacion = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private bsModal: BsModalRef,
    private ampliacionSvc: AmpliacionPreinversionService,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.listarAmpliacionPlazoPreinversion(1);
    this.listarAmpliacionCombo();
    this.createForm();
    this.fecha_inicio_contractual = (this.fecha_inicio_contractual != null) ? new Date(this.fecha_inicio_contractual) : null;
    this.UltimaActualizacion = this.obtenerDatosAuditoria('Ampliacion');
  }

  createForm() {
    this.formRegistroAmpliacion = this.fb.group({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_ampliacion: 0,
      ampliacion: [null, Validators.required],
      resolucion_aprobacion: [null, Validators.required],
      fecha_aprobacion: [null, Validators.required],
      documento_aprobacion: null,
      id_ampliacion_causal: [null, Validators.required],
      detalle_ampliacion_causal: null,
      id_ampliacion_pedido: [null, Validators.required],
      comentario: '',
    });
    this.formRegistroAmpliacion.markAsUntouched();
    this.formRegistroAmpliacion.markAsPristine();
  }

  get f(): any { return this.formRegistroAmpliacion.controls; }

  listarAmpliacionPlazoPreinversion(pagina: number) {
    const param = {
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      limit: this.itemsPerPage,
      offset: (pagina - 1) * this.itemsPerPage,
    };
    this.ampliacionSvc.listarAmpliacionPreinversion(param).subscribe(
      (data: any) => {
        // data = JSON.parse(data);
        this.totalRegistros = data.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.lstAmpliacionPreinversion = data.ampliacion;
        } else {
          this.lstAmpliacionPreinversion = [];
        }
      }
    );
  }

  listarAmpliacionCombo() {
    this.ampliacionSvc.listarAmpliacionCombo().subscribe((data: any) => {
      this.lstAmpliacionCausal = data.ampliacion_causal;
      this.lstAmpliacionPedido = data.ampliacion_pedido;
    });
  }

  registrarAmpliacionPlazo() {
    const paramEnvio = { ...{}, ...this.formRegistroAmpliacion.value };
    paramEnvio.fecha_aprobacion = this.envioFecha(paramEnvio.fecha_aprobacion);
    paramEnvio.ampliacion = parseInt(paramEnvio.ampliacion, 10);
    if (this.cambiarEditar) {
      // registrar modificacion
      paramEnvio.usuario_modificacion = this.usuario;
      this.ampliacionSvc.modificarAmpliacionPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.retornoValorAmpliacion.emit();
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
          this.limpiarForm();
          this.listarAmpliacionPlazoPreinversion(1);
          this.UltimaActualizacion = this.obtenerDatosAuditoria('Ampliacion');
        }
      });
    } else {
      // registrar nuevo registro
      paramEnvio.usuario_creacion = this.usuario;
      this.ampliacionSvc.insertarAmpliacionPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.retornoValorAmpliacion.emit();
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
          this.limpiarForm();
          this.listarAmpliacionPlazoPreinversion(1);
          this.UltimaActualizacion = this.obtenerDatosAuditoria('Ampliacion');
        }
      });
    }
  }

  editarAmpliacionPreinversion(ampliacion) {
    this.cambiarEditar = true;
    this.formRegistroAmpliacion.patchValue(ampliacion);
    this.formRegistroAmpliacion.patchValue({
      fecha_aprobacion: this.funciones.ConvertStringtoDate(this.funciones.formatDate(ampliacion.fecha_aprobacion)),
    });
    this.documentoAprobacion = ampliacion.documento_aprobacion;
  }

  anularAmpliacionPreinversion(idAmpliacion: number) {
    const param = { id_ampliacion: idAmpliacion, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.ampliacionSvc.anularAmpliacionPreinversion(param).subscribe((data: any) => {
          if (data.resultado > 0) {
            this.retornoValorAmpliacion.emit();
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarAmpliacionPlazoPreinversion(1);
            this.UltimaActualizacion = this.obtenerDatosAuditoria('Ampliacion');
          }
        });
      }
    });
  }

  causalSeleccionado(event) {
    if (!isUndefined(event) && event.cod_causal == 'AC009') {
      this.verOtraCausal = true;
    } else {
      this.verOtraCausal = false;
    }
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  envioFecha(date: Date) {
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime;
  }

  fileChangeEvent(event: any) {
    if (event.uploaded != null) {
      this.documentoAprobacion = event.uploaded._body;
      this.formRegistroAmpliacion.patchValue({
        documento_aprobacion: this.documentoAprobacion
      });
    }
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return ` ${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        return '';
      }
    }
  }

  cambiarPagina(page) {
    let paginaActual = page.page;
    this.listarAmpliacionPlazoPreinversion(paginaActual);
  }

  limpiarForm() {
    this.formRegistroAmpliacion.reset();
    this.formRegistroAmpliacion.patchValue({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_ampliacion: 0,
    });
    this.documentoAprobacion = '';
    this.verOtraCausal = false;
  }

  closeModal() {
    this.bsModal.hide();
  }

}
