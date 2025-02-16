import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProcesoSeleccionBienesServiciosRequest } from 'projects/sspssi/src/models/request/proceso-seleccion-bs-request';
import { ProcesoSeleccionBienesServicios } from 'projects/sspssi/src/models/response/proceso-seleccion-bs';
import { AuthService } from '../../../auth/auth.service';
import { Functions, TipoObjeto, AplicarTipoControl } from 'projects/sspssi/src/appSettings';
import { ActivatedRoute } from '@angular/router';
import { WsConsultaPrincipalService } from 'projects/sspssi/src/servicios/ws-consulta-principal.service';
import { ProcesoSeleccionService } from 'projects/sspssi/src/servicios/proceso-seleccion.service';
import { VerResultadosComponent } from '../../../proyecto/proceso-seleccion/ver-resultados/ver-resultados.component';

@Component({
  selector: 'ssi-contratacion-bienes-servicios-pre',
  templateUrl: './contratacion-bienes-servicios-pre.component.html',
  styleUrls: ['./contratacion-bienes-servicios-pre.component.css']
})
export class ContratacionBienesServiciosPreComponent implements OnInit {

  snip: number;
  idTramo: number;
  idFase: number;
  idMunicipalidad: number;
  beProcesoSeleccionBienesServicios: ProcesoSeleccionBienesServicios;
  lstProcesoSeleccion = [];
  seleccionTodo: boolean = false;
  totalRegistros: number = 0;
  itemsPerPage: number = 5;
  paginaActual: number = 1;
  paginaActiva: number = 1;
  entidadBusqueda: ProcesoSeleccionBienesServiciosRequest;
  idProyecto: number;
  codigo_unificado: number;
  habilitar: boolean = true;

  lstProcesoSeleccionCabecera;
  lstProcesoSeleccionComentario;


  constructor(
    private modalSvc: BsModalService,
    private ssWS: WsConsultaPrincipalService,
    private servicio: ProcesoSeleccionService,
    private route: ActivatedRoute,
    public funciones: Functions,
    private autService: AuthService
  ) { }

  ngOnInit() {
    this.snip = 0; // this.route.snapshot.params.snip;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.idFase = this.route.snapshot.params.idFase;
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.codigo_unificado = 0; // parseInt(sessionStorage.getItem("CodUnificado"));
    this.habilitar = this.autService.hasClaim("monitoreo_tabSel_modComentario_pre_inv_eje_dir") == AplicarTipoControl.Visible;

    this.busqueda(1);
    this.consultarNombreMuni();
  }

  consultarProcesoSeleccion(parametros: ProcesoSeleccionBienesServiciosRequest, pIdProyecto) {
    this.servicio.listarProcesoSeleccion(parametros).subscribe(
      data => {
        if (data != null) {
          let lstProcesoSeleccionCabeceraReturn;
          lstProcesoSeleccionCabeceraReturn = data as any;
          this.lstProcesoSeleccionCabecera = lstProcesoSeleccionCabeceraReturn.resultado;
          this.totalRegistros = lstProcesoSeleccionCabeceraReturn.cantidad;
        } else {
          this.lstProcesoSeleccionCabecera = [];
          this.totalRegistros = 0;
        }

        this.ConsultaProcesoSeleccionComentario(pIdProyecto, this.idMunicipalidad);
      }
    );
  }

  ConsultaProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad) {
    this.servicio.listarProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad).subscribe(
      data => {
        this.lstProcesoSeleccionComentario = data;
        this.ObetenerConsultaPrincipal(this.lstProcesoSeleccionCabecera, this.lstProcesoSeleccionComentario);
      }
    );
  }

  ObetenerConsultaPrincipal(pListProcesoSeleccionCabecera, pListProcesoSeleccionComentario) {
    this.lstProcesoSeleccion = [];
    let cont: number = 0;
    if (pListProcesoSeleccionCabecera != null && pListProcesoSeleccionCabecera != "" && pListProcesoSeleccionComentario != null && pListProcesoSeleccionComentario != "") {
      for (let i = 0; i < pListProcesoSeleccionCabecera.length; i++) {
        for (let j = 0; j < pListProcesoSeleccionComentario.length; j++) {
          if (pListProcesoSeleccionCabecera[i].identificador == pListProcesoSeleccionComentario[j].identificador) {
            this.lstProcesoSeleccion.push({
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
              this.lstProcesoSeleccion.push({
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
          this.lstProcesoSeleccion.push({
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
    if (this.lstProcesoSeleccion[index].es_anular) {
      if (!estado) {
        this.funciones.alertaRetorno("question", "¿Este proceso ya no formará parte de este proyecto, está de acuerdo?", "", true, (respuesta) => {
          if (respuesta.value) {
            let param = { "id_fase": this.lstProcesoSeleccion[index].id_fase, "identificador": this.lstProcesoSeleccion[index].identificador, "usuario_eliminacion": sessionStorage.getItem("Usuario") };
            this.servicio.anularFaseIdentificador(param).subscribe((data: any) => {
              this.busqueda(1);
            });
          }
        });
      }
    } else {
      if (estado) {
        if (this.lstProcesoSeleccion[index].fecha_modificacion != null && this.lstProcesoSeleccion[index].accion == "EE") {
          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el comentario?", "", true, (respuesta) => {
            this.lstProcesoSeleccion[index].correspondeproyecto = true;
            this.lstProcesoSeleccion[index].usuario_modificacion = sessionStorage.getItem("Usuario");
            this.lstProcesoSeleccion[index].comentario = "";
            this.lstProcesoSeleccion[index].accion = "GE"; //EDITAR EXISTENTE
            if (respuesta.value) {
              this.lstProcesoSeleccion[index].mostrar_control = "";
              this.servicio.actualizarProcesoSeleccionComentario(this.lstProcesoSeleccion[index]).subscribe(
                respuesta => {
                  this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
                  this.busqueda(this.paginaActiva);
                }
              );
            } else {
              this.lstProcesoSeleccion[index].mostrar_control = "L";
              this.busqueda(this.paginaActiva);
            }
          });
        } else {
          if (this.lstProcesoSeleccion[index].fecha_modificacion != null) {
            this.lstProcesoSeleccion[index].mostrar_control = "";
            this.lstProcesoSeleccion[index].accion = "EE"; //EDITAR EXISTENTE
          } else {
            this.lstProcesoSeleccion[index].mostrar_control = "T";
            this.lstProcesoSeleccion[index].accion = "G"; //GRABAR
          }
          this.lstProcesoSeleccion[index].comentario = "";
          this.lstProcesoSeleccion[index].correspondeproyecto = true;
        }
      } else {
        this.lstProcesoSeleccion[index].mostrar_control = "T";
        if (this.lstProcesoSeleccion[index].fecha_modificacion == null) {
          this.lstProcesoSeleccion[index].accion = "G"; // GRABAR
        } else {
          this.lstProcesoSeleccion[index].accion = "GE"; // GRABAR EXISTENTE
        }
        this.lstProcesoSeleccion[index].correspondeproyecto = false;
      }
    }
  }

  setearEstadoCorrespondeProyecto(index) {
    if (this.lstProcesoSeleccion[index].correspondeproyecto) {
      return true;
    } else {
      return false;
    }
  }


  mostrarBotonGuardar(index) {
    if (this.lstProcesoSeleccion != null) {
      //if(this.lstProcesoSeleccion[index].accion== "G" || this.lstProcesoSeleccion[index].accion== "GE"){
      if (this.lstProcesoSeleccion[index].mostrar_control == "T" || this.lstProcesoSeleccion[index].accion == "G") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarBotonEditar(index) {
    if (this.lstProcesoSeleccion != null) {
      //if(!this.lstProcesoSeleccion[index].correspondeproyecto && this.lstProcesoSeleccion[index].accion=="EE"){
      if (this.lstProcesoSeleccion[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }
  }

  mostrarTextBoxComentario(index) {
    if (this.lstProcesoSeleccion != null) {
      //if(this.lstProcesoSeleccion[index].correspondeproyecto == false && (this.lstProcesoSeleccion[index].accion =="G" || this.lstProcesoSeleccion[index].accion =="GE")){
      if (this.lstProcesoSeleccion[index].correspondeproyecto == false && this.lstProcesoSeleccion[index].mostrar_control == "T") {
        return true;
      } else {
        return false;
      }
    }
  }
  mostrarLabelComentario(index) {
    if (this.lstProcesoSeleccion != null) {
      //if(this.lstProcesoSeleccion[index].correspondeproyecto == false && this.lstProcesoSeleccion[index].accion=="EE"){
      if (this.lstProcesoSeleccion[index].correspondeproyecto == false && this.lstProcesoSeleccion[index].mostrar_control == "L") {
        return true;
      } else {
        return false;
      }
    }

  }

  grabarComentario(model: ProcesoSeleccionBienesServicios, index) {
    model.id_municipalidad = this.idMunicipalidad;
    if (this.lstProcesoSeleccion[index].accion == "G") {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      if (!model.correspondeproyecto && model.comentario == "") {
        this.funciones.mensaje("info", "Debe ingresar un comentario.");
      } else {
        if (model.correspondeproyecto) {
          this.lstProcesoSeleccion[index].mostrar_control = "";
        } else {
          this.lstProcesoSeleccion[index].mostrar_control = "L";
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
          this.lstProcesoSeleccion[index].mostrar_control = "";
        } else {
          this.lstProcesoSeleccion[index].mostrar_control = "L";
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

  guardarEstadoMasivo() {
    if (this.lstProcesoSeleccion != null) {
      this.seleccionTodo = false;
      for (let i = 0; i < this.lstProcesoSeleccion.length; i++) {
        if (this.lstProcesoSeleccion[i].seleccion) {
          this.lstProcesoSeleccion[i].id_municipalidad = this.idMunicipalidad;
          if (this.lstProcesoSeleccion[i].accion == "G") {
            this.lstProcesoSeleccion[i].usuario_creacion = sessionStorage.getItem("Usuario");
            if (!this.lstProcesoSeleccion[i].correspondeproyecto && this.lstProcesoSeleccion[i].comentario == "") {
              this.funciones.mensaje("info", "Debe ingresar un comentario en la fila: " + (i + 1).toString());
            } else {
              if (this.lstProcesoSeleccion[i].correspondeproyecto) {
                this.lstProcesoSeleccion[i].mostrar_control = "";
              } else {
                this.lstProcesoSeleccion[i].mostrar_control = "L";
              }
              this.servicio.registrarProcesoSeleccionComentario(this.lstProcesoSeleccion[i]).subscribe(
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
            this.lstProcesoSeleccion[i].usuario_modificacion = sessionStorage.getItem("Usuario");
            if (!this.lstProcesoSeleccion[i].correspondeproyecto && this.lstProcesoSeleccion[i].comentario == "") {
              this.funciones.mensaje("info", "Debe ingresar un comentario en la fila: " + (i + 1).toString());
            } else {
              if (this.lstProcesoSeleccion[i].correspondeproyecto) {
                this.lstProcesoSeleccion[i].mostrar_control = "";
              } else {
                this.lstProcesoSeleccion[i].mostrar_control = "L";
              }
              this.servicio.actualizarProcesoSeleccionComentario(this.lstProcesoSeleccion[i]).subscribe(
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
      }
    }
  }

  editarComentario(index) {
    if (this.lstProcesoSeleccion[index].fecha_modificacion == null) {
      this.lstProcesoSeleccion[index].accion = "G"; // GRABAR
    } else {
      this.lstProcesoSeleccion[index].accion = "EE"; // GRABAR EXISTENTE
    }
    this.lstProcesoSeleccion[index].mostrar_control = "T";
    //this.lstProcesoSeleccion[index].accion = "G";
  }

  seleccionarTodosLosRegistros(estado: any) {
    this.seleccionTodo = estado.currentTarget.checked;
    if (this.lstProcesoSeleccion != null) {
      for (let i = 0; i < this.lstProcesoSeleccion.length; i++) {
        this.lstProcesoSeleccion[i].seleccion = estado.currentTarget.checked;
        if (this.lstProcesoSeleccion[i].fecha_modificacion == null) {
          this.lstProcesoSeleccion[i].accion = "G";
        } else {
          this.lstProcesoSeleccion[i].accion = "EE";
        }
      }
    }
  }

  seleccionIndividual(estado: any, index) {
    if (this.lstProcesoSeleccion != null) {
      this.lstProcesoSeleccion[index].seleccion = estado.currentTarget.checked;
      if (this.lstProcesoSeleccion[index].fecha_modificacion == null) {
        this.lstProcesoSeleccion[index].accion = "G";
      } else {
        this.lstProcesoSeleccion[index].accion = "EE";
      }
      let contSeleccionados = 0;
      for (let i = 0; i < this.lstProcesoSeleccion.length; i++) {
        if (this.lstProcesoSeleccion[i].seleccion) {
          contSeleccionados++;
        }
      }
      if (contSeleccionados == 0) {
        this.seleccionTodo = false;
      }
    }

  }
  mostrarSeleccionIndividual(index) {
    if (this.lstProcesoSeleccion[index].seleccion) {
      return true;
    } else {
      return false;
    }
  }

  cambiarPagina(pagina) {
    this.seleccionTodo = false;
    this.paginaActiva = pagina.page;
    this.paginaActual = pagina.page;
    this.entidadBusqueda = new ProcesoSeleccionBienesServiciosRequest();
    this.entidadBusqueda.snip = this.snip == null ? 0 : this.snip;
    this.entidadBusqueda.tipo = TipoObjeto.BIENES_SERVICIOS;
    this.entidadBusqueda.numero_Pagina = (pagina.page * 5) - 4;
    this.entidadBusqueda.num_filas = 5;
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
    this.entidadBusqueda.tipo = TipoObjeto.BIENES_SERVICIOS;
    this.entidadBusqueda.numero_Pagina = (pagina * 5) - 4;
    this.entidadBusqueda.num_filas = 5;
    this.entidadBusqueda.codigo_unificado = this.codigo_unificado;
    this.entidadBusqueda.id_fase = this.idFase;
    this.consultarProcesoSeleccion(this.entidadBusqueda, this.idProyecto);
  }

  config;
  bsModalRef: BsModalRef;
  nom_muni: string = "";
  pProyecto = [];
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
    model.tipo = TipoObjeto.BIENES_SERVICIOS;
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
