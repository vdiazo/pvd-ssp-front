import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { tipoArchivo, Functions } from '../../../../appSettings';
import { FacadeService } from '../../../../patterns/facade.service';
import { IAdelantoDirecto } from '../../../../interfaces/IAdelantoDirecto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ssi-modal-adelanto-directo',
  templateUrl: './modal-adelanto-directo.component.html',
  styleUrls: ['./modal-adelanto-directo.component.css']
})
export class ModalAdelantoDirectoComponent implements OnInit {
  tipoArchivo: number = tipoArchivo.AdelantoDirecto;
  nombreArchivo: string
  id_seguimientoMonitoreoObra: number;
  listaAdelantoDirecto: IAdelantoDirecto[] = [];
  formGroup: FormGroup
  @Output() retornoValores = new EventEmitter();

  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  tieneArchivo: boolean = false;
  bEstado: boolean;
  bMostrar: boolean = false;
  minDate: Date;
  maxDate: Date;
  totalRegistros: number;

  constructor(private fs: FacadeService,
    private fb: FormBuilder, public modalRef: BsModalRef, public funciones: Functions) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id_adelanto_directo: [0],
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
      nombre_adelanto_directo: ['', Validators.compose([Validators.required])],
      fecha_inicio: ['', Validators.required],
      fecha_termino: ['', Validators.required],
      monto_garantia: ['', Validators.required],
      monto_adelanto: ['', Validators.required],
      entidad_financiera: ['', Validators.required],
      nombre_archivo: ['', Validators.required],
      ruta_archivo: ['']
    })

    this.nombreArchivo = '';
    this.formGroup.markAsUntouched();
    this.formGroup.markAsPristine();

    this.formGroup.get("fecha_inicio").valueChanges.subscribe(
      (e: Date) => {
        this.minDate = e;
      }
    )

    this.formGroup.get("fecha_termino").valueChanges.subscribe(
      (e: Date) => {
        this.maxDate = e;
      }
    )

    this.listarAdelantoDirecto();
  }

  listarAdelantoDirecto(): void {
    this.fs.seguimientoMonitoreoService.listarAdelantoDirecto(this.id_seguimientoMonitoreoObra)
      .subscribe(
        data => {
          this.listaAdelantoDirecto = data;
          this.totalRegistros = this.listaAdelantoDirecto.length;
          if (jQuery.isEmptyObject(this.listaAdelantoDirecto[0])) {
            this.listaAdelantoDirecto = [];
            /* if (this.listaAdelantoDirecto[0].id_adelanto_directo) {
              this.formGroup.patchValue(this.listaAdelantoDirecto[0]);
              this.nombreArchivo = this.listaAdelantoDirecto[0].nombre_archivo;
              this.tieneArchivo = true;
            } */
          }
        }
      )
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.tieneArchivo = false;
      this.nombreArchivo = evento.uploaded._body;
      this.formGroup.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  grabar() {
    let model: IAdelantoDirecto = <IAdelantoDirecto>this.formGroup.value;
    model.monto_adelanto = this.funciones.castToFloat(model.monto_adelanto);
    model.monto_garantia = this.funciones.castToFloat(model.monto_garantia);
    model.usuario_creacion = sessionStorage.getItem("Usuario");
    model.usuario_modificacion = sessionStorage.getItem("Usuario");


    if (model.fecha_inicio.toString().length == 10) {
      model.fecha_inicio = this.funciones.ConvertStringtoDate(model.fecha_inicio);
    } else {
      model.fecha_inicio = this.funciones.ConvertStringtoDate(this.funciones.formatDate(model.fecha_inicio));
    }

    if (model.fecha_termino.toString().length == 10) {
      model.fecha_termino = this.funciones.ConvertStringtoDate(model.fecha_termino)
    } else {
      model.fecha_termino = this.funciones.ConvertStringtoDate(this.funciones.formatDate(model.fecha_termino));
    }
    this.bMostrar = true;

    if (model.id_adelanto_directo == 0) {
      this.fs.seguimientoMonitoreoService.registrarAdelantoDirecto(model).subscribe(
        (data) => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ''));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ''));
            this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      );
    } else {
      this.fs.seguimientoMonitoreoService.modificarAdelantoDirecto(model).subscribe(
        (data) => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ''));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ''));
            this.ngOnInit();
            // this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            // this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      );
    }
  }

  eliminarAdelantoDirecto(row: IAdelantoDirecto) {
    row.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Adelanto Directo?", '', true, (respuesta) => {
      if (respuesta.value) {
        this.fs.seguimientoMonitoreoService.eliminarAdelantoDirecto(row).subscribe(
          () => {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("eliminacion", ''));
            // this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            // this.modalRef.hide();
            this.listarAdelantoDirecto();
          }
        )
      }
    });
  }

  editarAdelantoDirecto(row: IAdelantoDirecto) {
    this.formGroup.patchValue(row);
    this.formGroup.patchValue({
      fecha_inicio: this.funciones.ConvertStringtoDate(row.fecha_inicio),
      fecha_termino: this.funciones.ConvertStringtoDate(row.fecha_termino),
    });
    this.nombreArchivo = row.nombre_archivo;
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAdelantoDirecto();
  }
}
