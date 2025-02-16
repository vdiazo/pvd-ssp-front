import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { tipoArchivo, Functions } from '../../../../appSettings';
import { IAdelantoMaterial, IAdelantoMateriales } from '../../../../interfaces/IAdelantoMateriales';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacadeService } from '../../../../patterns/facade.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ssi-modal-adelanto-materiales',
  templateUrl: './modal-adelanto-materiales.component.html',
  styleUrls: ['./modal-adelanto-materiales.component.css']
})
export class ModalAdelantoMaterialesComponent implements OnInit {
  tipoArchivo: number = tipoArchivo.AdelantoMateriales;
  nombreArchivo: string;
  id_seguimientoMonitoreoObra: number;
  listaAdelantoMateriales: IAdelantoMaterial[] = []
  formGroup: FormGroup;
  @Output() retornoValores = new EventEmitter();

  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  totalRegistros: number;
  minDate: Date;
  maxDate: Date;
  bEstado: boolean;
  bMostrar: boolean = false;

  constructor(private fs: FacadeService,
    private fb: FormBuilder, public modalRef: BsModalRef, public funciones: Functions) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id_adelanto_materiales: [0],
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
      nombre_adelanto_materiales: ['', Validators.compose([Validators.required])],
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

    this.listarAdelantoMateriales(this.num_filas, this.numero_Pagina);
  }

  listarAdelantoMateriales(filas, pagina): void {
    this.fs.seguimientoMonitoreoService.listarAdelantoMateriales(this.id_seguimientoMonitoreoObra, filas, pagina)
      .subscribe(
        data => {
          this.totalRegistros = data.cantidad_registro;

          if (data.cantidad_registro > 0) {
            this.listaAdelantoMateriales = data.adelanto_materiales;
          } else {
            this.listaAdelantoMateriales = [];
          }
        }
      )
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.nombreArchivo = evento.uploaded._body;
      this.formGroup.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  closeModal() {
    this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarAdelantoMateriales(this.num_filas, this.numero_Pagina);
  }

  grabar() {
    let model: IAdelantoMaterial = <IAdelantoMaterial>this.formGroup.value;
    model.monto_adelanto = this.funciones.castToFloat(model.monto_adelanto);
    model.monto_garantia = this.funciones.castToFloat(model.monto_garantia);
    model.usuario_creacion = sessionStorage.getItem("Usuario");
    model.usuario_modificacion = sessionStorage.getItem("Usuario");


    if (model.fecha_inicio.toString().length == 10) {
      model.fecha_inicio = this.funciones.ConvertStringtoDate(model.fecha_inicio)
    } else {
      model.fecha_inicio = this.funciones.ConvertStringtoDate(this.funciones.formatDate(model.fecha_inicio))
    }


    if (model.fecha_termino.toString().length == 10) {
      model.fecha_termino = this.funciones.ConvertStringtoDate(model.fecha_termino)
    } else {
      model.fecha_termino = this.funciones.ConvertStringtoDate(this.funciones.formatDate(model.fecha_termino))
    }
    this.bMostrar = true;

    if (model.id_adelanto_materiales == 0) {
      this.fs.seguimientoMonitoreoService.registrarAdelantoMaterial(model).subscribe(
        (data) => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ''));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ''));
            this.ngOnInit();
            // this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            // this.modalRef.hide();
            //this.listarAdelantoMateriales(this.num_filas, this.numero_Pagina);
          }
          this.bMostrar = false;
        }
      );
    } else {
      this.fs.seguimientoMonitoreoService.modificarAdelantoMaterial(model).subscribe(
        (data) => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ''));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ''));
            this.ngOnInit();
            // this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            // this.modalRef.hide();
            //this.listarAdelantoMateriales(this.num_filas, this.numero_Pagina);
          }
          this.bMostrar = false;
        }
      );
    }
  }

  eliminarAdelantoMaterial(row: IAdelantoMaterial) {
    row.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Adelanto Material?", '', true, (respuesta) => {
      if (respuesta.value) {
        this.fs.seguimientoMonitoreoService.eliminarAdelantoMaterial(row).subscribe(
          () => {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("eliminacion", ''));
            // this.retornoValores.emit(this.id_seguimientoMonitoreoObra);
            // this.modalRef.hide();
            this.listarAdelantoMateriales(this.num_filas, this.numero_Pagina);
          }
        )
      }
    });
  }

  editarAdelantoMaterial(row: IAdelantoMaterial) {
    this.formGroup.patchValue(row);
    this.formGroup.patchValue({
      fecha_inicio: this.funciones.ConvertStringtoDate(row.fecha_inicio),
      fecha_termino: this.funciones.ConvertStringtoDate(row.fecha_termino),
    });
    this.nombreArchivo = row.nombre_archivo;
  }

}

