import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BuscarGeoTramoService } from '../../servicios/buscar-geo-tramo.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Functions } from '../../appSettings';
import { GeoTramo } from '../../models/geo-tramo';
import { ModalRegistroGeoComponent } from './modal-registro-geo/modal-registro-geo.component';
import { ModalVerGeoComponent } from './modal-ver-geo/modal-ver-geo.component';

@Component({
  selector: 'ssi-buscar-geo-tramo',
  templateUrl: './buscar-geo-tramo.component.html',
  styleUrls: ['./buscar-geo-tramo.component.css']
})
export class BuscarGeoTramoComponent implements OnInit {

  totalTramoGeo = 0;
  listadoGeo: any = [];
  resultado;
  campoBusqueda = '';
  config: any;
  paginaActual = 1;
  formBusquedaGeo: FormGroup;
  private bsModal: BsModalRef;
  constructor(private fb: FormBuilder, private modalService: BsModalService, private geoTramoService: BuscarGeoTramoService, private funciones: Functions) { }

  ngOnInit() {
    this.formBusquedaGeo = this.fb.group({
      campo_busqueda: [null]
    });
    this.listarGeoTramoPrincipal();
  }

  listarGeoTramoPrincipal() {
    const busqueda = '';
    const skip = 10;
    const take = 0;

    this.geoTramoService.ListarGEOPaginado(busqueda, skip, take).subscribe(
      respuesta => {
        this.resultado = respuesta;
        this.totalTramoGeo = this.resultado.cantidad;
        this.listadoGeo = this.resultado.geo_tramo;
      });
  }

  busquedaGeoTramo() {
    this.paginaActual = 1;
    let busqueda: string;
    const skip = 10;
    const take = 0;

    this.campoBusqueda = this.formBusquedaGeo.get('campo_busqueda').value;
    busqueda = this.campoBusqueda == null ? '' : this.campoBusqueda.toUpperCase();

    this.geoTramoService.ListarGEOPaginado(busqueda, skip, take).subscribe(
      data => {
        this.resultado = data;
        this.totalTramoGeo = this.resultado.cantidad;
        this.listadoGeo = this.resultado.geo_tramo;
      });
  }

  modalNuevoRegistro() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModal = this.modalService.show(ModalRegistroGeoComponent, this.config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        const pagina = { page: this.paginaActual };
        this.cambiarPagina(pagina);
      });
  }

  modalVerGeoTramo(idGeoTramo: number) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idGeoTramo: idGeoTramo
      }
    };
    this.bsModal = this.modalService.show(ModalVerGeoComponent, this.config);
  }

  modalEditarGeoTramo(geoTramo) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: geoTramo
      }
    };
    this.bsModal = this.modalService.show(ModalRegistroGeoComponent, this.config);
    this.bsModal.content.retornoValores.subscribe(
      () => {
        const pagina = { page: this.paginaActual };
        this.cambiarPagina(pagina);
      });
  }

  mostrarAlerta(idGeoTramo: number) {
    this.funciones.alertaRetorno('question', 'Desea eliminar el registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.eliminarGeoTramo(idGeoTramo);
      }
    });
  }

  eliminarGeoTramo(idGeoTramo: number) {
    const entidadEliminar = new GeoTramo();
    entidadEliminar.id_geo_tramo = idGeoTramo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem('Usuario');
    this.geoTramoService.anularGeoTramo(entidadEliminar).subscribe(
      respuesta => {
        if (respuesta) {
          this.funciones.alertaSimple('success', 'Se eliminó el registro!', '', true);
          this.busquedaGeoTramo();
        } else {
          this.funciones.alertaSimple('error', 'Ocurrio un error al momento eliminar el registro', '', true);
        }
      }
    );
  }

  cambiarPagina(pagina) {
    this.paginaActual = pagina.page;
    const skip = 10;
    const take = (pagina.page * 10) - 10;
    let busqueda: string;

    this.campoBusqueda = this.formBusquedaGeo.get('campo_busqueda').value;
    busqueda = this.campoBusqueda == null ? '' : this.campoBusqueda;
    this.geoTramoService.ListarGEOPaginado(busqueda, skip, take).subscribe(
      respuesta => {
        this.resultado = respuesta;
        this.totalTramoGeo = this.resultado.cantidad;
        this.listadoGeo = this.resultado.geo_tramo;
      });
  }
}
