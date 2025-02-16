import { Component, OnInit } from '@angular/core';
import { ProcesoSeleccionBienesServicios } from 'projects/sspssi/src/models/response/proceso-seleccion-bs';
import { ProcesoSeleccionBienesServiciosRequest } from 'projects/sspssi/src/models/request/proceso-seleccion-bs-request';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../auth/auth.service';
import { Functions, TipoObjeto, AplicarTipoControl } from 'projects/sspssi/src/appSettings';
import { ActivatedRoute } from '@angular/router';
import { ProcesoSeleccionService } from 'projects/sspssi/src/servicios/proceso-seleccion.service';
import { WsConsultaPrincipalService } from 'projects/sspssi/src/servicios/ws-consulta-principal.service';
import { VerResultadosComponent } from '../../../proyecto/proceso-seleccion/ver-resultados/ver-resultados.component';

@Component({
  selector: 'ssi-contratacion-consultoria-pre',
  templateUrl: './contratacion-consultoria-pre.component.html',
  styleUrls: ['./contratacion-consultoria-pre.component.css']
})
export class ContratacionConsultoriaPreComponent implements OnInit {

  snip: number;
  idTramo: number;
  idFase: number;
  idMunicipalidad: number;
  beProcesoSeleccionBienesServicios: ProcesoSeleccionBienesServicios;
  lstCntConsultoria = [];
  seleccionTodo = false;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  paginaActual = 1;
  paginaActiva = 1;
  entidadBusqueda: ProcesoSeleccionBienesServiciosRequest;
  lstCntConsultoriaCabecera;
  lstCntConsultoriaComentario;
  idProyecto: number;
  habilitar = true;
  codigo_unificado: number;
  config;
  bsModalRef: BsModalRef;
  nom_muni = '';
  pProyecto = [];
  constructor(
    private modalSvc: BsModalService,
    private ssWS: WsConsultaPrincipalService,
    private servicio: ProcesoSeleccionService,
    private route: ActivatedRoute,
    public funciones: Functions,
    private autService: AuthService) { }

  ngOnInit() {
    this.snip = 0;// this.route.snapshot.params.snip;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.idFase = this.route.snapshot.params.idFase;
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.codigo_unificado = 0; // parseInt(sessionStorage.getItem('CodUnificado'), 10);
    this.habilitar = this.autService.hasClaim('monitoreo_tabSel_modComentario_pre_inv_eje_dir') == AplicarTipoControl.Visible;
    this.busqueda(1);
    this.consultarNombreMuni();
  }

  consultarProcesoSeleccion(parametros: ProcesoSeleccionBienesServiciosRequest, pIdProyecto) {
    this.servicio.listarProcesoSeleccion(parametros).subscribe(
      data => {
        if (data != null) {
          let lstCntConsultoriaCabeceraReturn;
          lstCntConsultoriaCabeceraReturn = data as any;
          this.lstCntConsultoriaCabecera = lstCntConsultoriaCabeceraReturn.resultado;
          this.totalRegistros = lstCntConsultoriaCabeceraReturn.cantidad;
        } else {
          this.lstCntConsultoriaCabecera = [];
          this.totalRegistros = 0;
        }
        this.ConsultaProcesoSeleccionComentario(pIdProyecto, this.idMunicipalidad);
      }
    );
  }

  ConsultaProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad) {
    this.servicio.listarProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad).subscribe(
      data => {
        this.lstCntConsultoriaComentario = data;
        this.ObetenerConsultaPrincipal(this.lstCntConsultoriaCabecera, this.lstCntConsultoriaComentario);
      }
    );
  }

  ObetenerConsultaPrincipal(pListProcesoSeleccionCabecera, pListProcesoSeleccionComentario) {
    this.lstCntConsultoria = [];
    let cont: number = 0;
    if (pListProcesoSeleccionCabecera != null && pListProcesoSeleccionCabecera != "" && pListProcesoSeleccionComentario != null && pListProcesoSeleccionComentario != "") {
      for (let i = 0; i < pListProcesoSeleccionCabecera.length; i++) {
        for (let j = 0; j < pListProcesoSeleccionComentario.length; j++) {
          if (pListProcesoSeleccionCabecera[i].identificador == pListProcesoSeleccionComentario[j].identificador) {
            this.lstCntConsultoria.push({
              id_fase: this.idFase,
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
              id_proceso_seleccion_obra: pListProcesoSeleccionComentario[j].id_proceso_seleccion_obra,
              fecha_modificacion: pListProcesoSeleccionComentario[j].fecha_modificacion,
              nombre_municipalidad: pListProcesoSeleccionComentario[j].nombre_municipalidad,
              es_anular: pListProcesoSeleccionCabecera[i].es_anular
            });
            break;
          } else {
            if (j == pListProcesoSeleccionComentario.length - 1) {
              this.lstCntConsultoria.push({
                id_fase: this.idFase,
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
                id_proceso_seleccion_obra: 0,
                fecha_modificacion: null,
                nombre_municipalidad: "",
                es_anular: pListProcesoSeleccionCabecera[i].es_anular
              });
              break;
            }
          }
        }
      }
    } else {
      if (pListProcesoSeleccionCabecera != null) {
        for (let i = 0; i < pListProcesoSeleccionCabecera.length; i++) {
          this.lstCntConsultoria.push({
            id_fase: this.idFase,
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
            id_proceso_seleccion_obra: 0,
            fecha_modificacion: null,
            nombre_municipalidad: "",
            es_anular: pListProcesoSeleccionCabecera[i].es_anular
          });
        }
      }
    }
  }

  procesoCorrespondeProyecto(estado, index) {
    if (this.lstCntConsultoria[index].es_anular) {
      if (!estado) {
        this.funciones.alertaRetorno("question", "¿Este proceso ya no formará parte de este proyecto, está de acuerdo?", "", true, (respuesta) => {
          if (respuesta.value) {
            let param = { "id_fase": this.lstCntConsultoria[index].id_fase, "identificador": this.lstCntConsultoria[index].identificador, "usuario_eliminacion": sessionStorage.getItem("Usuario") };
            this.servicio.anularFaseIdentificador(param).subscribe((data: any) => {
              this.busqueda(1);
            });
          }
        });
      }
    } else {
      if (estado) {
        if (this.lstCntConsultoria[index].fecha_modificacion != null && this.lstCntConsultoria[index].accion == "EE") {
          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el comentario?", "", true, (respuesta) => {
            this.lstCntConsultoria[index].correspondeproyecto = true;
            this.lstCntConsultoria[index].usuario_modificacion = sessionStorage.getItem("Usuario");
            this.lstCntConsultoria[index].comentario = "";
            this.lstCntConsultoria[index].accion = "GE"; //EDITAR EXISTENTE
            if (respuesta.value) {
              this.lstCntConsultoria[index].mostrar_control = "";
              this.servicio.actualizarProcesoSeleccionComentario(this.lstCntConsultoria[index]).subscribe(
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
              this.lstCntConsultoria[index].mostrar_control = "L";
              this.busqueda(this.paginaActiva);
            }
          });
        } else {
          if (this.lstCntConsultoria[index].fecha_modificacion != null) {
            this.lstCntConsultoria[index].mostrar_control = "";
            this.lstCntConsultoria[index].accion = "EE"; //EDITAR EXISTENTE
          } else {
            this.lstCntConsultoria[index].mostrar_control = "T";
            this.lstCntConsultoria[index].accion = "G"; //GRABAR
          }
          this.lstCntConsultoria[index].comentario = "";
          this.lstCntConsultoria[index].correspondeproyecto = true;
        }
      } else {
        this.lstCntConsultoria[index].mostrar_control = "T";
        if (this.lstCntConsultoria[index].fecha_modificacion == null) {
          this.lstCntConsultoria[index].accion = "G"; // GRABAR
        } else {
          this.lstCntConsultoria[index].accion = "GE"; // GRABAR EXISTENTE
        }
        this.lstCntConsultoria[index].correspondeproyecto = false;
      }
    }
  }

  setearEstadoCorrespondeProyecto(index) {
    if (this.lstCntConsultoria[index].correspondeproyecto) {
      return true;
    } else {
      return false;
    }
  }

  mostrarBotonGuardar(index) {
    if (this.lstCntConsultoria != null) {
      if (this.lstCntConsultoria[index].mostrar_control == "T" || this.lstCntConsultoria[index].accion == "G") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarBotonEditar(index) {
    if (this.lstCntConsultoria != null) {
      if (this.lstCntConsultoria[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarTextBoxComentario(index) {
    if (this.lstCntConsultoria != null) {
      if (this.lstCntConsultoria[index].correspondeproyecto == false && this.lstCntConsultoria[index].mostrar_control == "T") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarLabelComentario(index) {
    if (this.lstCntConsultoria != null) {
      if (this.lstCntConsultoria[index].correspondeproyecto == false && this.lstCntConsultoria[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }

  }

  grabarComentario(model: ProcesoSeleccionBienesServicios, index) {
    model.id_municipalidad = this.idMunicipalidad;
    if (this.lstCntConsultoria[index].accion == "G") {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      if (!model.correspondeproyecto && model.comentario == "") {
        this.funciones.mensaje("info", "Debe ingresar un comentario.");
      } else {
        if (model.correspondeproyecto) {
          this.lstCntConsultoria[index].mostrar_control = "";
        } else {
          this.lstCntConsultoria[index].mostrar_control = "L";
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
          this.lstCntConsultoria[index].mostrar_control = "";
        } else {
          this.lstCntConsultoria[index].mostrar_control = "L";
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
    if (this.lstCntConsultoria[index].fecha_modificacion == null) {
      this.lstCntConsultoria[index].accion = "G"; // GRABAR
    } else {
      this.lstCntConsultoria[index].accion = "EE"; // GRABAR EXISTENTE
    }
    this.lstCntConsultoria[index].mostrar_control = "T";
  }

  cambiarPagina(pagina) {
    this.seleccionTodo = false;
    this.paginaActiva = pagina.page;
    this.paginaActual = pagina.page;
    this.entidadBusqueda = new ProcesoSeleccionBienesServiciosRequest();
    this.entidadBusqueda.snip = this.snip == null ? 0 : this.snip;
    this.entidadBusqueda.tipo = TipoObjeto.CONSULTORIA_OBRA;
    this.entidadBusqueda.numero_Pagina = (pagina.page * 10) - 9;
    this.entidadBusqueda.num_filas = 10;
    this.entidadBusqueda.codigo_unificado = this.codigo_unificado;
    this.entidadBusqueda.id_fase = this.idFase;
    this.consultarProcesoSeleccion(this.entidadBusqueda, this.idProyecto);
  }

  busqueda(pagina) {
    this.seleccionTodo = false;
    this.paginaActiva = pagina;
    this.paginaActual = pagina;
    this.entidadBusqueda = new ProcesoSeleccionBienesServiciosRequest();
    this.entidadBusqueda.snip = this.snip == null ? 0 : this.snip;
    this.entidadBusqueda.tipo = TipoObjeto.CONSULTORIA_OBRA;
    this.entidadBusqueda.numero_Pagina = (pagina * 10) - 9;
    this.entidadBusqueda.num_filas = 10;
    this.entidadBusqueda.codigo_unificado = this.codigo_unificado;
    this.entidadBusqueda.id_fase = this.idFase;
    this.consultarProcesoSeleccion(this.entidadBusqueda, this.idProyecto);
  }

  consultarNombreMuni() {
    this.ssWS.getProyecto(this.idProyecto, this.route.snapshot.params.idTramo).subscribe(
      respuesta => {
        this.pProyecto = respuesta as any;
        this.nom_muni = this.pProyecto[0].nombre_municipalidad;

      }
    );
  }

  openModalVerResultados(model) {
    model.snip = this.snip;
    model.id_proyecto = this.idProyecto;
    model.tipo = TipoObjeto.CONSULTORIA_OBRA;
    model.idTramo = this.route.snapshot.params.idTramo;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelVerResultados: model, nom_muni: this.nom_muni
      }
    };
    this.bsModalRef = this.modalSvc.show(VerResultadosComponent, this.config);
  }
}
