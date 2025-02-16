import { Component, OnInit } from '@angular/core';
import { ProcesoSeleccionService } from '../../services/proceso-seleccion.service';
import { ActivatedRoute } from '@angular/router';
import { ProcesoSeleccionBienesServiciosRequest } from '../../../models/request/proceso-seleccion-bs-request';
import { TipoObjeto, AplicarTipoControl } from '../../../appSettings/enumeraciones';
import { Funciones } from '../../../appSettings/funciones';
import { ProcesoSeleccionBienesServicios } from '../../../models/response/proceso-seleccion-bs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { VerResultadosComponent } from '../ver-resultados/ver-resultados.component';
import { AuthService } from '../../auth/auth.service';
import { WsConsultaPrincipalService } from '../../services/ws-consulta-principal.service';
import { Proyecto } from '../../../models/proyecto';

@Component({
  selector: 'set-contratacion-obra',
  templateUrl: './contratacion-obra.component.html',
  styleUrls: ['./contratacion-obra.component.css']
})

export class ContratacionObraComponent implements OnInit {
  public beProyecto: Proyecto = new Proyecto();

  snip: number;
  idTramo: number;
  idFase: number;
  idTipoFase: number;
  idMunicipalidad: number;
  idProyecto: number;
  beProcesoSeleccionBienesServicios: ProcesoSeleccionBienesServicios;
  listContratacionObra = [];
  seleccionTodo: boolean = false;
  totalRegistros;
  paginaActual: number = 1;
  paginaActiva: number = 1;
  entidadBusqueda: ProcesoSeleccionBienesServiciosRequest;
  listContratacionObraCabecera;
  listContratacionObraComentario;
  habilitar: boolean = true;
  codigo_unificado: number;
  constructor(private ssWS: WsConsultaPrincipalService, private servicio: ProcesoSeleccionService, private route: ActivatedRoute, public funciones: Funciones, private modalService: BsModalService, private autService: AuthService) { }

  ngOnInit() {
    /*this.snip = this.route.snapshot.params.snip;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.idFase = this.route.snapshot.params.idFase;
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
    this.idProyecto = this.route.snapshot.params.idProyecto;*/
    this.snip=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).snip;
    this.idTramo=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTramo;
    this.idFase=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase;
    this.idTipoFase=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTipoFase;
    this.idMunicipalidad=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idMunicipalidad;
    this.idProyecto=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idProyecto;


    this.codigo_unificado =parseInt(sessionStorage.getItem("CodUnificado"));// parseInt(sessionStorage.getItem("CodUnificado"));
    this.habilitar = this.autService.hasClaim("monitoreo_tabSel_obra_modComentario") == AplicarTipoControl.Visible
    this.busqueda(1);
    this.consultarNombreMuni();
  }

  consultarProcesoSeleccion(parametros: ProcesoSeleccionBienesServiciosRequest, pIdProyecto) {
    this.servicio.listarProcesoSeleccion(parametros).subscribe(
      data => {
        let listContratacionObraCabeceraReturn;
        listContratacionObraCabeceraReturn = data as any;
        this.listContratacionObraCabecera = listContratacionObraCabeceraReturn.data;
        this.totalRegistros = listContratacionObraCabeceraReturn.cantidad_registro;
        //this.ConsultaProcesoSeleccionComentario(pIdProyecto, this.idMunicipalidad,this.idFase);
        this.ConsultaProcesoSeleccionComentario(pIdProyecto, this.idMunicipalidad,this.idTipoFase);
      }
    );
  }

  ConsultaProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad,pIdTipoFase) {
    this.servicio.listarProcesoSeleccionObra(pIdProyecto, pIdMunicipalidad,pIdTipoFase).subscribe(
      data => {
        this.listContratacionObraComentario = data;
        this.ObetenerConsultaPrincipal(this.listContratacionObraCabecera, this.listContratacionObraComentario);
      }
    );
  }

  ObetenerConsultaPrincipal(pListProcesoSeleccionCabecera, pListProcesoSeleccionComentario) {
    this.listContratacionObra = [];
    let cont: number = 0;
    if (pListProcesoSeleccionCabecera != null && pListProcesoSeleccionCabecera != "" && pListProcesoSeleccionComentario != null && pListProcesoSeleccionComentario != "") {
      for (let i = 0; i < pListProcesoSeleccionCabecera.length; i++) {
        for (let j = 0; j < pListProcesoSeleccionComentario.length; j++) {
          if (pListProcesoSeleccionCabecera[i].identificador == pListProcesoSeleccionComentario[j].identificador) {
            this.listContratacionObra.push({
              id_fase: this.idFase,
              id_tipo_fase: this.idTipoFase,
              id_proyecto: this.idProyecto,
              identificador: pListProcesoSeleccionCabecera[i].identificador,
              tipo_seleccion: pListProcesoSeleccionCabecera[i].tipo_seleccion,
              nomenclatura: pListProcesoSeleccionCabecera[i].nomenclatura,
              fecha_publicacion: pListProcesoSeleccionCabecera[i].fecha_publicacion,
              descripcion: pListProcesoSeleccionCabecera[i].descripcion_item,
              estado_proceso: pListProcesoSeleccionCabecera[i].estado_item,
              fecha: pListProcesoSeleccionCabecera[i].fecha,
              valor_referencial: pListProcesoSeleccionCabecera[i].valor_referencial_item,
              comentario: pListProcesoSeleccionComentario[j].comentario,
              accion: "EE",
              mostrar_control: (pListProcesoSeleccionComentario[j].correspondeproyecto ? "" : "L"),
              correspondeproyecto: pListProcesoSeleccionComentario[j].correspondeproyecto,
              id_proceso_seleccion_expediente: pListProcesoSeleccionComentario[j].id_proceso_seleccion_expediente,
              fecha_modificacion: pListProcesoSeleccionComentario[j].fecha_modificacion,
              nombre_municipalidad: pListProcesoSeleccionComentario[j].nombre_municipalidad
            });
            break;
          } else {
            if (j == pListProcesoSeleccionComentario.length - 1) {
              this.listContratacionObra.push({
                id_fase: this.idFase,
                id_tipo_fase: this.idTipoFase,
                id_proyecto: this.idProyecto,
                identificador: pListProcesoSeleccionCabecera[i].identificador,
                tipo_seleccion: pListProcesoSeleccionCabecera[i].tipo_seleccion,
                nomenclatura: pListProcesoSeleccionCabecera[i].nomenclatura,
                fecha_publicacion: pListProcesoSeleccionCabecera[i].fecha_publicacion,
                descripcion: pListProcesoSeleccionCabecera[i].descripcion_item,
                estado_proceso: pListProcesoSeleccionCabecera[i].estado_item,
                fecha: pListProcesoSeleccionCabecera[i].fecha,
                valor_referencial: pListProcesoSeleccionCabecera[i].valor_referencial_item,
                comentario: "",
                accion: "G",
                mostrar_control: "",
                correspondeproyecto: true,
                id_proceso_seleccion_expediente: 0,
                fecha_modificacion: null,
                nombre_municipalidad: ""
              });
              break;
            }
          }
        }
      }
    } else {
      if (pListProcesoSeleccionCabecera != null) {
        for (let i = 0; i < pListProcesoSeleccionCabecera.length; i++) {
          this.listContratacionObra.push({
            id_fase: this.idFase,
            id_tipo_fase: this.idTipoFase,
            id_proyecto: this.idProyecto,
            identificador: pListProcesoSeleccionCabecera[i].identificador,
            tipo_seleccion: pListProcesoSeleccionCabecera[i].tipo_seleccion,
            nomenclatura: pListProcesoSeleccionCabecera[i].nomenclatura,
            fecha_publicacion: pListProcesoSeleccionCabecera[i].fecha_publicacion,
            descripcion: pListProcesoSeleccionCabecera[i].descripcion_item,
            estado_proceso: pListProcesoSeleccionCabecera[i].estado_item,
            fecha: pListProcesoSeleccionCabecera[i].fecha,
            valor_referencial: pListProcesoSeleccionCabecera[i].valor_referencial_item,
            comentario: "",
            accion: "G",
            mostrar_control: "",
            correspondeproyecto: true,
            id_proceso_seleccion_expediente: 0,
            fecha_modificacion: null,
            nombre_municipalidad: ""
          });
        }
      }
    }
  }

  procesoCorrespondeProyecto(estado, index) {
    if (estado) {
      if (this.listContratacionObra[index].fecha_modificacion != null && this.listContratacionObra[index].accion == "EE") {
        this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el comentario?", "", true, (respuesta) => {
          this.listContratacionObra[index].correspondeproyecto = true;
          this.listContratacionObra[index].usuario_modificacion = sessionStorage.getItem("Usuario");
          this.listContratacionObra[index].comentario = "";
          this.listContratacionObra[index].accion = "GE"; //EDITAR EXISTENTE
          if (respuesta.value) {
            this.listContratacionObra[index].mostrar_control = "";
            

            this.servicio.actualizarProcesoSeleccionComentario(this.listContratacionObra[index]).subscribe(
              respuesta => {
                if (respuesta > 0) {
                  this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
                  this.busqueda(this.paginaActiva);
                } else {
                  this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
                }
              }
            );
          } else {
            this.listContratacionObra[index].mostrar_control = "L";
            this.busqueda(this.paginaActiva);
          }
        });
      } else {
        if (this.listContratacionObra[index].fecha_modificacion != null) {
          this.listContratacionObra[index].mostrar_control = "";
          this.listContratacionObra[index].accion = "EE"; //EDITAR EXISTENTE
        } else {
          this.listContratacionObra[index].mostrar_control = "T";
          this.listContratacionObra[index].accion = "G"; //GRABAR
        }
        this.listContratacionObra[index].comentario = "";
        this.listContratacionObra[index].correspondeproyecto = true;
      }
    } else {
      this.listContratacionObra[index].mostrar_control = "T";
      if (this.listContratacionObra[index].fecha_modificacion == null) {
        this.listContratacionObra[index].accion = "G"; // GRABAR
      } else {
        this.listContratacionObra[index].accion = "GE"; // GRABAR EXISTENTE
      }
      this.listContratacionObra[index].correspondeproyecto = false;
    }
  }
  setearEstadoCorrespondeProyecto(index) {
    if (this.listContratacionObra[index].correspondeproyecto) {
      return true;
    } else {
      return false;
    }
  }

  mostrarBotonGuardar(index) {
    if (this.listContratacionObra != null) {
      if (this.listContratacionObra[index].mostrar_control == "T" || this.listContratacionObra[index].accion == "G") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarBotonEditar(index) {
    if (this.listContratacionObra != null) {
      if (this.listContratacionObra[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarTextBoxComentario(index) {
    if (this.listContratacionObra != null) {
      if (this.listContratacionObra[index].correspondeproyecto == false && this.listContratacionObra[index].mostrar_control == "T") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarLabelComentario(index) {
    if (this.listContratacionObra != null) {
      if (this.listContratacionObra[index].correspondeproyecto == false && this.listContratacionObra[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }

  }

  grabarComentario(model: ProcesoSeleccionBienesServicios, index) {
    model.id_municipalidad = this.idMunicipalidad;
    if (this.listContratacionObra[index].accion == "G") {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      if (!model.correspondeproyecto && model.comentario == "") {
        this.funciones.mensaje("info", "Debe ingresar un comentario.");
      } else {
        if (model.correspondeproyecto) {
          this.listContratacionObra[index].mostrar_control = "";
        } else {
          this.listContratacionObra[index].mostrar_control = "L";
        }
          this.servicio.registrarProcesoSeleccionComentario(model).subscribe(
          respuesta => {
            if (respuesta > 0) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              this.busqueda(this.paginaActiva);
            } else {
              this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
            }
          }
        );
      }
    } else {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      if (!model.correspondeproyecto && model.comentario == "") {
        this.funciones.mensaje("info", "Debe ingresar un comentario.");
      } else {
        if (model.correspondeproyecto) {
          this.listContratacionObra[index].mostrar_control = "";
        } else {
          this.listContratacionObra[index].mostrar_control = "L";
        }
        this.servicio.actualizarProcesoSeleccionComentario(model).subscribe(
          respuesta => {
            if (respuesta > 0) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.busqueda(this.paginaActiva);
            } else {
              this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
            }
          }
        );
      }
    }
  }

  editarComentario(index) {
    if (this.listContratacionObra[index].fecha_modificacion == null) {
      this.listContratacionObra[index].accion = "G"; // GRABAR
    } else {
      this.listContratacionObra[index].accion = "EE"; // GRABAR EXISTENTE
    }
    this.listContratacionObra[index].mostrar_control = "T";
  }

  cambiarPagina(pagina) {
    this.seleccionTodo = false;
    this.paginaActiva = pagina.page;
    this.paginaActual = pagina.page;
    this.entidadBusqueda = new ProcesoSeleccionBienesServiciosRequest();
    this.entidadBusqueda.snip = this.snip == null ? 0 : this.snip;
    this.entidadBusqueda.tipo = TipoObjeto.OBRA;
    this.entidadBusqueda.numero_Pagina = ((pagina.page * 10) - 9); //(pagina.page * 10) - 9;  pagina.page - 1) * 10
    this.entidadBusqueda.num_filas = 10;
    this.entidadBusqueda.codigo_unificado = this.codigo_unificado;
    this.consultarProcesoSeleccion(this.entidadBusqueda, this.idProyecto);
  }

  busqueda(pagina) {
    this.seleccionTodo = false;
    this.paginaActiva = pagina;
    this.paginaActual = pagina;
    this.entidadBusqueda = new ProcesoSeleccionBienesServiciosRequest();
    this.entidadBusqueda.snip = this.snip == null ? 0 : this.snip;
    this.entidadBusqueda.tipo = TipoObjeto.OBRA;
    this.entidadBusqueda.numero_Pagina = ((pagina * 10) - 9); //(pagina * 10) - 9; --(pagina - 1) * 10
    this.entidadBusqueda.num_filas = 10;
    this.entidadBusqueda.codigo_unificado = this.codigo_unificado;
    this.consultarProcesoSeleccion(this.entidadBusqueda, this.idProyecto);
  }

  config;
  bsModalRef: BsModalRef;
  nom_muni: string = "";
  pProyecto = [];
  consultarNombreMuni() {
    //this.ssWS.getProyecto(this.idProyecto, this.route.snapshot.params.idTramo).subscribe(    
    this.ssWS.getProyecto(this.idProyecto, this.idTramo).subscribe( 
      respuesta => {
        this.pProyecto = respuesta as any;
        this.nom_muni = this.pProyecto[0].nombre_municipalidad;
      }
    );
  }
  openModalVerResultados(model) {
    model.snip = this.snip;
    model.id_proyecto = this.idProyecto;
    model.tipo = TipoObjeto.OBRA;
    model.idTramo = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTramo;// this.route.snapshot.params.idTramo;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelVerResultados: model, nom_muni: this.nom_muni
      }
    };
    this.bsModalRef = this.modalService.show(VerResultadosComponent, this.config);
  }
}