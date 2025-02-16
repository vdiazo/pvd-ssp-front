import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TramoService } from '../../servicios/tramo.service';
import { Functions } from '../../appSettings';
import { FormBuilder, FormGroup } from '@angular/forms';
import { _tramo } from '../../models/Convenio';
import { ModalEdicionTramoComponent } from './modal-edicion-tramo/modal-edicion-tramo.component';

@Component({
  selector: 'ssi-buscar-tramo',
  templateUrl: './buscar-tramo.component.html',
  styleUrls: ['./buscar-tramo.component.css']
})
export class BuscarTramoComponent implements OnInit {

  formBusquedaProyecto: FormGroup;
  bsModalRef: BsModalRef;
  resultado;
  totalTramo = 0;
  listTramo = [];
  campoBusqueda = '';

  paginaActual = 1;
  config;

  constructor(private modalService: BsModalService, private funciones: Functions, private tramoService: TramoService, private fb: FormBuilder) { }

  ngOnInit() {
    this.formBusquedaProyecto = this.fb.group({
      'campo_busqueda': ['']
    });
    this.listarTramoPrincipal();
  }

  listarTramoPrincipal() {
    const busqueda = '';
    const skip = 10;
    const take = 0;

    this.tramoService.ListarTramoPaginado(busqueda, skip, take).subscribe(
      data => {
        this.resultado = data;
        this.listTramo = this.resultado.proyectos;
        this.totalTramo = this.resultado.cantidad_registro;
      });
  }

  cambiarPagina(pagina) {
    this.paginaActual = pagina.page;
    const skip = 10;
    const take = (pagina.page * 10) - 10;
    let busqueda: string;

    this.campoBusqueda = this.formBusquedaProyecto.get('campo_busqueda').value;
    busqueda = this.campoBusqueda == null ? '' : this.campoBusqueda.toUpperCase();
    this.tramoService.ListarTramoPaginado(busqueda, skip, take).subscribe(
      data => {
        this.resultado = data;
        this.listTramo = this.resultado.proyectos;
        this.totalTramo = this.resultado.cantidad_registro;
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
    this.bsModalRef = this.modalService.show(ModalEdicionTramoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        const pagina = { page: this.paginaActual };
        this.cambiarPagina(pagina);
      }
    );
  }

  modalEditarTramo(tramo) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: tramo,
      }
    };
    this.bsModalRef = this.modalService.show(ModalEdicionTramoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        const pagina = { page: this.paginaActual };
        this.cambiarPagina(pagina);
      }
    );
  }

  busquedaProyecto() {
    this.paginaActual = 1;
    let busqueda: string;
    const skip = 10;
    const take = 0;

    this.campoBusqueda = this.formBusquedaProyecto.get('campo_busqueda').value;
    busqueda = this.campoBusqueda == null ? '' : this.campoBusqueda.toUpperCase();

    this.tramoService.ListarTramoPaginado(busqueda, skip, take).subscribe(
      data => {
        this.resultado = data;
        this.listTramo = this.resultado.proyectos;
        this.totalTramo = this.resultado.cantidad_registro;
      });
  }

  mostrarAlerta(codigo) {
    this.funciones.alertaRetorno('question', 'Deseas eliminar el siguiente registro?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.eliminarTramo(codigo);
      }
    });
  }

  eliminarTramo(codigo) {
    const entidadEliminar = new _tramo();
    entidadEliminar.id_tramo = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem('Usuario');
    this.tramoService.anularTramo(entidadEliminar).subscribe(respuesta => {
      if (respuesta == 1) {
        this.funciones.alertaSimple('success', 'Se eliminó correctamente el registro!', '', true);
        this.busquedaProyecto();
      } else if (respuesta == 2) {
        this.funciones.alertaSimple('warning', 'El registro no se puede eliminar porque tiene fase(s)!', '', true);
        this.busquedaProyecto();
      } else {
        this.funciones.alertaSimple('error', 'Ocurrio un error al momento de eliminar el registro', '', true);
      }
    });
  }

  abrirConsultaSnip(pSnip: string | number) {
    if (pSnip >= 1000000) {
      window.open('http://ofi5.mef.gob.pe/invierte/ejecucion/verFichaEjecucion/' + pSnip, '_blank');
    } else {
      window.open('http://ofi4.mef.gob.pe/bp/ConsultarPIP/frmConsultarPIP.asp?accion=consultar&txtCodigo=' + pSnip, '_blank');
    }
  }
}
