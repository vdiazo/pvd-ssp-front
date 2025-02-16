import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { AdelantoDirectoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/adelanto-directo-preinversion.service';

@Component({
  selector: 'ssi-modal-crud-adelanto-directo-pre',
  templateUrl: './modal-crud-adelanto-directo-pre.component.html',
  styleUrls: ['./modal-crud-adelanto-directo-pre.component.css']
})
export class ModalCrudAdelantoDirectoPreComponent implements OnInit {

  id_seguimientoMonitoreoPreinversion: number = 0;
  formRegistroAdelantoPreinversion: FormGroup;
  nombreArchivo: string = '';
  lstAdelantoPreinversion: any[] = [];
  itemsPerPage: number = 5;
  totalRegistros: number = 0;
  cambiarEditar: boolean = false;
  tipoArchivo: number = tipoArchivo.adelantoDirectoPreinversion;
  UltimaActualizacion: string = '';
  @Output() retornoValorAdelanto = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, private adelantoDirSvc: AdelantoDirectoPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarAdelantoDirectoPreinversion(1);
    this.UltimaActualizacion = this.obtenerDatosAuditoria('AdelantoDirecto');

  }

  createForm() {
    this.formRegistroAdelantoPreinversion = this.fb.group({
      id_adelanto_directo: [0],
      id_seguimiento: [this.id_seguimientoMonitoreoPreinversion],
      nombre_adelanto_directo: ['', Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_termino: [null, Validators.required],
      monto_garantia: ['', Validators.required],
      monto_adelanto: ['', Validators.required],
      entidad_financiera: ['', Validators.required],
      nombre_archivo: [null],
    });
  }

  listarAdelantoDirectoPreinversion(pagina: number) {
    const param = { id_seguimiento: this.id_seguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.adelantoDirSvc.listarAdelantoDirectoPreinversion(param).subscribe((data: any) => {
      // data = JSON.parse(data);
      this.totalRegistros = data.cantidad_registro;
      if (this.totalRegistros > 0) {
        this.lstAdelantoPreinversion = data.adelanto_directo;
        this.UltimaActualizacion = this.obtenerDatosAuditoria('AdelantoDirecto');
      } else {
        this.lstAdelantoPreinversion = [];
      }
    });
  }

  registrarAdelantoDirectoPreinversion() {
    const paramEnvio = { ...{}, ...this.formRegistroAdelantoPreinversion.value };
    // paramEnvio.fecha_inicio = this.envioFecha(paramEnvio.fecha_inicio);
    // paramEnvio.fecha_termino = this.envioFecha(paramEnvio.fecha_termino);
    paramEnvio.monto_garantia = this.funciones.castToFloat(paramEnvio.monto_garantia);
    paramEnvio.monto_adelanto = this.funciones.castToFloat(paramEnvio.monto_adelanto);

    if (this.cambiarEditar) {
      // registrar modificacion
      paramEnvio.usuario_modificacion = this.usuario;
      this.adelantoDirSvc.modificarAdelantoDirectoPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.estado) {
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
          this.retornoValorAdelanto.emit();
          this.limpiarForm();
          this.listarAdelantoDirectoPreinversion(1);
        }
      });
    } else {
      // nuevo registro
      paramEnvio.usuario_creacion = this.usuario;
      this.adelantoDirSvc.insertarAdelantoDirectoPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
          this.retornoValorAdelanto.emit();
          this.limpiarForm();
          this.listarAdelantoDirectoPreinversion(1);
        }
      });
    }

  }

  modificarAdelantoDirectoPreinversion(adelanto) {
    this.cambiarEditar = true;
    this.formRegistroAdelantoPreinversion.patchValue(adelanto);
    this.formRegistroAdelantoPreinversion.patchValue({
      fecha_inicio: this.funciones.ConvertStringtoDate(adelanto.fecha_inicio),
      fecha_termino: this.funciones.ConvertStringtoDate(adelanto.fecha_termino),
    })
  }

  anularAdelantoDirectoPreinversion(idAdelanto: number) {
    const param = { id_adelanto_directo: idAdelanto, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.adelantoDirSvc.anularAdelantoDirectoPreinversion(param).subscribe((data: any) => {
          this.retornoValorAdelanto.emit();
          this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
          this.listarAdelantoDirectoPreinversion(1);
        });
      }
    });
  }

  get f(): any { return this.formRegistroAdelantoPreinversion.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  fileChangeEvent(event: any) {
    if (event.uploaded != null) {
      this.nombreArchivo = event.uploaded._body;
      this.formRegistroAdelantoPreinversion.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  cambiarPagina(page) {
    let paginaActual = page.page;
    this.listarAdelantoDirectoPreinversion(paginaActual);
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

  limpiarForm() {
    this.formRegistroAdelantoPreinversion.reset();
    this.formRegistroAdelantoPreinversion.patchValue({
      id_adelanto_directo: 0,
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
    });
    this.nombreArchivo = '';
    this.cambiarEditar = false;
  }

  closeModal() {
    this.bsModal.hide();
  }

}
