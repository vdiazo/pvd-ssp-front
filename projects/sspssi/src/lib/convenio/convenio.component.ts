import { Component, OnInit, Inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Busqueda, _convenio } from '../../models/Convenio';

import { FacadeService } from '../../patterns/facade.service';

import { Functions } from '../../appSettings/functions';
import { IConvenioData } from '../../interfaces/IConvenio';
import { ModalRegistroConvenioComponent } from './modal-registro-convenio/modal-registro-convenio.component';

@Component({
  selector: 'ssi-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.css']
})
export class ConvenioComponent implements OnInit {
  bsModalRef: BsModalRef;
  bsModalEditar: BsModalRef;
  entidadBusqueda: Busqueda;
  ListaFases;
  arregloConvenio;
  totalConvenio;
  config;
  numIdfase: number;
  strSiglas: string;
  strTramo: string;
  strProyecto: string;
  numcodProyecto: number;
  estado_convenio: string;
  numcodSnip: number;
  paginaActual: number = 1;
  ListaEstados = [
    { estado_convenio: 'PorVencer', nombre_estado_convenio: 'Proximo a vencer' },
    { estado_convenio: 'Vigente', nombre_estado_convenio: 'Vigente' },
    { estado_convenio: 'ConvenioConcluido', nombre_estado_convenio: 'Convenio Concluido' }];

  constructor(private modalService: BsModalService,
    private fs: FacadeService,
    public funciones: Functions) {
  }

  ngOnInit(): void {
    this.listarFases();
    this.listarConvenioPaginado();
  }

  listarConvenioPaginado() {
    this.fs.convenioService.ListarConveniosFiltro(0, 0, "", "", "", 0, "", 10, 0).subscribe(
      data => {
        this.arregloConvenio = data[0].convenios;
        this.totalConvenio = data[0].cantidad_registro;
        let cont = 0;
        let vNombreFuente = "";
        this.arregloConvenio.forEach(element => {
          element.fecha_firma = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_firma));
          element.fecha_vigencia = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_vigencia));
          if (element.fuente_financiamiento != null) {
            cont = 0;
            element.fuente_financiamiento.forEach(a => {
              if (a.fuente_financiamiento != undefined) {
                if (cont == 0) {
                  vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                } else {
                  vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                }
              }
              cont++;
            });
          }
          element.nombre_fuente = vNombreFuente;
          vNombreFuente = "";
        });
      }
    )
  }

  listarFases() {
    this.fs.maestraService.listarTipoFases().subscribe(
      data => {
        this.ListaFases = data;
      }
    )
  }

  busqueda() {
    this.paginaActual = 1;
    this.entidadBusqueda = new Busqueda();
    this.entidadBusqueda.cod_Snip = this.numcodSnip == null || this.numcodSnip.toString() == "" ? 0 : this.numcodSnip;
    this.entidadBusqueda.cod_Proyecto = this.numcodProyecto == null || this.numcodProyecto.toString() == "" ? 0 : this.numcodProyecto;
    this.entidadBusqueda.proyecto = this.strProyecto == null ? "" : this.strProyecto;
    this.entidadBusqueda.tramo = this.strTramo == null ? "" : this.strTramo;
    this.entidadBusqueda.siglas = this.strSiglas == null ? "" : this.strSiglas;
    this.entidadBusqueda.id_fase = this.numIdfase == null || this.numIdfase.toString() == "" ? 0 : this.numIdfase;
    this.entidadBusqueda.estado_convenio = this.estado_convenio == null ? "" : this.estado_convenio;
    let skip = 10;
    let take = 0;
    this.fs.convenioService.ListarConveniosFiltro(this.entidadBusqueda.cod_Snip,
      this.entidadBusqueda.cod_Proyecto, this.entidadBusqueda.proyecto,
      this.entidadBusqueda.tramo, this.entidadBusqueda.estado_convenio, this.entidadBusqueda.id_fase,
      this.entidadBusqueda.siglas, 10, 0).subscribe(
        data => {
          this.arregloConvenio = data[0].convenios;
          this.totalConvenio = data[0].cantidad_registro;

          let cont = 0;
          let vNombreFuente = "";
          this.arregloConvenio.forEach(element => {
            element.fecha_firma = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_firma));
            element.fecha_vigencia = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_vigencia));
            if (element.fuente_financiamiento != null) {
              cont = 0;
              element.fuente_financiamiento.forEach(a => {
                if (a.fuente_financiamiento != undefined) {
                  if (cont == 0) {
                    vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                  } else {
                    vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                  }
                }
                cont++;
              });
            }
            element.nombre_fuente = vNombreFuente;
            vNombreFuente = "";
          });
        }
      );
  }

  mostrarAlerta(codigo) {
    this.funciones.alertaRetorno("question", "Deseas eliminar el siguiente registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.eliminar(codigo);
      }
    })
  }

  eliminar(codigo) {
    let entidadEliminar = new _convenio();
    entidadEliminar.id_convenio = codigo;
    entidadEliminar.usuario_eliminacion = sessionStorage.getItem("Usuario");
    this.fs.convenioService.eliminarConvenioSosem(entidadEliminar).subscribe(
      data => {
        if (data == 1) {
          this.funciones.alertaSimple("success", "Se eliminó correctamente el registro!", "", true);
          this.busqueda();
        } else {
          this.funciones.alertaSimple("error", "Ocurrio un error al momento de eliminar el registro", "", true);
        }
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActual = pagina.page;
    this.entidadBusqueda = new Busqueda();
    this.entidadBusqueda.cod_Snip = this.numcodSnip == null || this.numcodSnip.toString() == "" ? 0 : this.numcodSnip;
    this.entidadBusqueda.cod_Proyecto = this.numcodProyecto == null || this.numcodProyecto.toString() == "" ? 0 : this.numcodProyecto;
    this.entidadBusqueda.proyecto = this.strProyecto == null ? "" : this.strProyecto;
    this.entidadBusqueda.tramo = this.strTramo == null ? "" : this.strTramo;
    this.entidadBusqueda.estado_convenio = this.estado_convenio == null ? "" : this.estado_convenio;
    this.entidadBusqueda.siglas = this.strSiglas == null ? "" : this.strSiglas;
    this.entidadBusqueda.id_fase = this.numIdfase == null || this.numIdfase.toString() == "" ? 0 : this.numIdfase;
    let skip = 10;
    let take = (pagina.page * 10) - 10;;
    this.fs.convenioService.ListarConveniosFiltro(this.entidadBusqueda.cod_Snip,
      this.entidadBusqueda.cod_Proyecto, this.entidadBusqueda.proyecto,
      this.entidadBusqueda.tramo, this.entidadBusqueda.estado_convenio, this.entidadBusqueda.id_fase,
      this.entidadBusqueda.siglas, skip, take).subscribe(
        data => {
          this.arregloConvenio = data[0].convenios;
          this.totalConvenio = data[0].cantidad_registro;
          let cont = 0;
          let vNombreFuente = "";
          this.arregloConvenio.forEach(element => {
            element.fecha_firma = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_firma));
            element.fecha_vigencia = this.funciones.formatDate(this.funciones.ConvertStringtoDateDB(element.fecha_vigencia));
            if (element.fuente_financiamiento != null) {
              cont = 0;
              element.fuente_financiamiento.forEach(a => {
                if (a.fuente_financiamiento != undefined) {
                  if (cont == 0) {
                    vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                  } else {
                    vNombreFuente = vNombreFuente + "- " + a.fuente_financiamiento + "\n";
                  }
                }
                cont++;
              });
            }
            element.nombre_fuente = vNombreFuente;
            vNombreFuente = "";
          });
        }
      )
  }


  busquedaEstadoConvenio(estadoConvenio) {
    this.estado_convenio = estadoConvenio;
    this.busqueda();
  }
  mostrarConvenio(obj) {
    let entidad: IConvenioData = Object.assign({}, obj);

    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: entidad
      }
    };
    this.bsModalEditar = this.modalService.show(ModalRegistroConvenioComponent, this.config);
    this.bsModalEditar.content.retornoValores.subscribe(
      data => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
      }
    )
  }

  openModal2() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      entidadEditar: null
    };
    this.bsModalRef = this.modalService.show(ModalRegistroConvenioComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
      }
    )
  }
}
