import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalGeo, GeoTramo } from 'projects/sspssi/src/models/geo-tramo';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BuscarGeoTramoService } from 'projects/sspssi/src/servicios/buscar-geo-tramo.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { skip } from 'rxjs/operators';
import { TramoService } from 'projects/sspssi/src/servicios/tramo.service';

@Component({
  selector: 'ssi-modal-registro-geo',
  templateUrl: './modal-registro-geo.component.html',
  styleUrls: ['./modal-registro-geo.component.css']
})
export class ModalRegistroGeoComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  entidadModal: ModalGeo;
  entidadEditar;
  codigosZonas: any = [];
  listaTramos: any = [];
  unidadMedidas: any = [];
  formEdicionGeoTramo: FormGroup;
  buscarTramo: FormControl = new FormControl();
  tramos: any = [];
  FileGeo: any;
  formData: FormData = new FormData();
  respuesta: any;
  cambiarEditar = true;

  constructor(private fb: FormBuilder, public modalRef: BsModalRef, public funciones: Functions, private geoTramoService: BuscarGeoTramoService, private fs: MaestraSsiService, private tramoService: TramoService) { }

  ngOnInit() {
    this.entidadModal = new ModalGeo();
    this.formEdicionGeoTramo = this.fb.group({
      buscarTramo: this.buscarTramo,
      longitud: new FormControl(),
      unidad_medida: new FormControl(),
      codigo_clasificador_ruta: new FormControl(),
      nombre_camino: new FormControl(),
      codigo_provisional_ruta: new FormControl(),
      descripcion_provisional: new FormControl(),
      codigo_zona: new FormControl()
    });
    if (this.entidadEditar != null) {
      this.formEdicionGeoTramo.patchValue({
        buscarTramo: this.entidadEditar.nombre_tramo,
        longitud: this.entidadEditar.longitud,
        unidad_medida: this.entidadEditar.id_unidad_medida,
        codigo_clasificador_ruta: this.entidadEditar.codigo_clasificador_ruta,
        nombre_camino: this.entidadEditar.nombre_camino,
        codigo_provisional_ruta: this.entidadEditar.codigo_provisional_ruta,
        descripcion_provisional: this.entidadEditar.descripcion_provisional,
        codigo_zona: this.entidadEditar.codigo_zona
      });
      this.cambiarEditar = false;
    } else {
      this.consultaTramosAutocomplete();
    }
    this.listarUnidadMedida();
    this.listarZonas();

  }

  administrarGeoTramo() {
    if (this.entidadEditar != null) {
      this.editarGeoTramo();
    } else {
      this.guardarGeoTramo();
    }
  }

  editarGeoTramo() {
    this.formData = new FormData();

    let entidadEdicion = new GeoTramo();
    entidadEdicion.id_geo_tramo = this.entidadEditar.id_geo_tramo;
    entidadEdicion.id_tramo = this.entidadEditar.id_tramo;
    entidadEdicion.longitud = parseFloat((this.formEdicionGeoTramo.get('longitud').value).toString().replace(/,/g, ''));
    entidadEdicion.id_unidad_medida = this.formEdicionGeoTramo.get('unidad_medida').value;
    entidadEdicion.codigo_clasificador_ruta = this.formEdicionGeoTramo.get('codigo_clasificador_ruta').value == null ? '' : this.formEdicionGeoTramo.get('codigo_clasificador_ruta').value;
    entidadEdicion.nombre_camino = this.formEdicionGeoTramo.get('nombre_camino').value == null ? '' : this.formEdicionGeoTramo.get('nombre_camino').value;
    entidadEdicion.codigo_provisional_ruta = this.formEdicionGeoTramo.get('codigo_provisional_ruta').value == null ? '' : this.formEdicionGeoTramo.get('codigo_provisional_ruta').value;
    entidadEdicion.descripcion_provisional = this.formEdicionGeoTramo.get('descripcion_provisional').value == null ? '' : this.formEdicionGeoTramo.get('descripcion_provisional').value;
    entidadEdicion.codigo_zona = this.formEdicionGeoTramo.get('codigo_zona').value;
    entidadEdicion.usuario_modificacion = sessionStorage.getItem('Usuario');
    this.formData.append('data', this.devolverParametroJson(entidadEdicion));
    if (this.FileGeo != null || this.FileGeo != undefined) {
      this.formData.append('archivo', this.FileGeo);
    } else {
      this.formData.append('archivo', '');
    }

    this.geoTramoService.RegistrarEditarGEOTramo(this.formData).subscribe(
      data => {
        this.respuesta = data;
        if (this.respuesta._body == '0') {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        } else {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }

  guardarGeoTramo() {
    this.formData = new FormData();

    const entidadRegistro = new GeoTramo();
    entidadRegistro.id_geo_tramo = 0;
    entidadRegistro.id_tramo = this.entidadModal.id_tramo;
    entidadRegistro.longitud = parseFloat((this.formEdicionGeoTramo.get('longitud').value).toString().replace(/,/g, ''));
    entidadRegistro.id_unidad_medida = this.formEdicionGeoTramo.get('unidad_medida').value;
    entidadRegistro.codigo_clasificador_ruta = this.formEdicionGeoTramo.get('codigo_clasificador_ruta').value == null ? '' : this.formEdicionGeoTramo.get('codigo_clasificador_ruta').value;
    entidadRegistro.nombre_camino = this.formEdicionGeoTramo.get('nombre_camino').value == null ? '' : this.formEdicionGeoTramo.get('nombre_camino').value;
    entidadRegistro.codigo_provisional_ruta = this.formEdicionGeoTramo.get('codigo_provisional_ruta').value == null ? '' : this.formEdicionGeoTramo.get('codigo_provisional_ruta').value;
    entidadRegistro.descripcion_provisional = this.formEdicionGeoTramo.get('descripcion_provisional').value == null ? '' : this.formEdicionGeoTramo.get('descripcion_provisional').value;
    entidadRegistro.codigo_zona = this.formEdicionGeoTramo.get('codigo_zona').value;
    entidadRegistro.usuario_creacion = sessionStorage.getItem('Usuario');

    this.formData.append('data', this.devolverParametroJson(entidadRegistro));
    if (this.FileGeo != null || this.FileGeo != undefined) {
      this.formData.append('archivo', this.FileGeo);
    } else {
      this.funciones.alertaSimple('warning', 'Debe adjuntar un archivo zip del dato geográfico', '', true);
      return false;
    }

    this.geoTramoService.RegistrarEditarGEOTramo(this.formData).subscribe(
      data => {
        this.respuesta = data;
        if (this.respuesta._body == '0') {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        } else {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }

  devolverParametroJson(pList) {
    const entidad = {
      data: JSON.stringify(pList)
    }
    return entidad.data;
  }

  consultaTramosAutocomplete() {
    let respuesta: any;
    this.buscarTramo.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            const busqueda = term.toUpperCase();
            const skip = 10;
            const take = 0;
            this.tramoService.ListarTramoPaginado(busqueda, skip, take).subscribe(
              data => {
                respuesta = data;
                this.tramos = respuesta.proyectos;
              });
          } else {
            this.tramos = null;
          }
        }
      }
    );
  }
  listarUnidadMedida() {
    this.fs.listarUnidadMedidas().subscribe(
      respuesta => {
        this.unidadMedidas = respuesta;
      }
    );
  }

  listarZonas() {
    this.geoTramoService.ListarZonas().subscribe(
      data => {
        this.codigosZonas = data;
      }
    );
  }
  mostrarTramoSeleccionado(pTramoSeleccionado) {
    this.entidadModal.id_tramo = pTramoSeleccionado.split('|')[0];
    this.entidadModal.nombre_camino = pTramoSeleccionado.split('|')[1];
    this.tramos = null;
  }

  limpiarAutocomplete() {
    this.tramos = undefined;
  }

  closeModal() {
    this.modalRef.hide();
  }

  fileChangeEvent(evento: any) {
    this.FileGeo = evento.target.files[0];
  }
}
