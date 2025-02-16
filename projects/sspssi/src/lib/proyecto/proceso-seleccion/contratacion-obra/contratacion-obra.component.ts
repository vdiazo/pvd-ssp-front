import { Component, OnInit, Input } from '@angular/core';
import { ProcesoSeleccionService } from '../../../../servicios/proceso-seleccion.service';
import { ActivatedRoute } from '@angular/router';
import { ProcesoSeleccionBienesServiciosRequest } from '../../../../models/request/proceso-seleccion-bs-request';
import { TipoObjeto, AplicarTipoControl } from '../../../../appSettings/enumeraciones';
import { Functions } from '../../../../appSettings/functions';
import { ProcesoSeleccionBienesServicios } from '../../../../models/response/proceso-seleccion-bs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VerResultadosComponent } from '../ver-resultados/ver-resultados.component';
import { AuthService } from '../../../auth/auth.service';
import { WsConsultaPrincipalService } from '../../../../servicios/ws-consulta-principal.service';
import { ContratistaService } from 'projects/sspssi/src/servicios/contratista.service';
import { Contratista } from 'projects/sspssi/src/models/response/contratista';
@Component({
  selector: 'ssi-contratacion-obra',
  templateUrl: './contratacion-obra.component.html',
  styleUrls: ['./contratacion-obra.component.css']
})

export class ContratacionObraComponent implements OnInit {
  snip: number;
  idTramo: number;
  idFase: number;
  idTipoFase: number;
  idMunicipalidad: number;
  idProyecto: number;
  idSeguimientoObra: number;
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
  contratistaRegistrar: Contratista;


  @Input() idSeguimientoMonitoreoObra;

  constructor(private ssWS: WsConsultaPrincipalService, private servicio: ProcesoSeleccionService, private route: ActivatedRoute, public funciones: Functions, private modalService: BsModalService, private autService: AuthService,
    private ServicioContr: ContratistaService) { }

  ngOnInit() {
    this.snip = this.route.snapshot.params.snip;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.idFase = this.route.snapshot.params.idFase;
    this.idTipoFase = this.route.snapshot.params.idTipoFase;
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.codigo_unificado = parseInt(sessionStorage.getItem("CodUnificado"));
    this.habilitar = this.autService.hasClaim("monitoreo_tabSel_obra_modComentario_eje_dir") == AplicarTipoControl.Visible
    this.busqueda(1);
    this.consultarNombreMuni();
    this.SetearIdSeguimientoMonitoreo();
  }

  consultarProcesoSeleccion(parametros: ProcesoSeleccionBienesServiciosRequest, pIdProyecto) {
    this.servicio.listarProcesoSeleccion(parametros).subscribe(
      data => {
        if (data != null) {
          let listContratacionObraCabeceraReturn;
          listContratacionObraCabeceraReturn = data as any;
          this.listContratacionObraCabecera = listContratacionObraCabeceraReturn.resultado;
          this.totalRegistros = listContratacionObraCabeceraReturn.cantidad;
          if (this.listContratacionObraCabecera != null) {
            this.listContratacionObraCabecera.forEach(element => {
              if (String(element.estado_item).toUpperCase() == "CONTRATADO") {
                //this.guardarContratista(element.identificador, TipoObjeto.OBRA);
              }
            });
          }
        } else {
          this.listContratacionObraCabecera = [];
          this.totalRegistros = 0;
        }
        this.ConsultaProcesoSeleccionComentario(pIdProyecto, this.idMunicipalidad);
      }
    );
  }

  ConsultaProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad) {
    this.servicio.listarProcesoSeleccionComentario(pIdProyecto, pIdMunicipalidad).subscribe(
      data => {
        this.listContratacionObraComentario = data;
        this.ObtenerConsultaPrincipal(this.listContratacionObraCabecera, this.listContratacionObraComentario);
      }
    );
  }

  ObtenerConsultaPrincipal(pListProcesoSeleccionCabecera, pListProcesoSeleccionComentario) {
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
              id_proceso_seleccion_obra: pListProcesoSeleccionComentario[j].id_proceso_seleccion_obra,
              fecha_modificacion: pListProcesoSeleccionComentario[j].fecha_modificacion,
              nombre_municipalidad: pListProcesoSeleccionComentario[j].nombre_municipalidad,
              es_anular: pListProcesoSeleccionCabecera[i].es_anular
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
    if (this.listContratacionObra[index].es_anular) {
      if (!estado) {
        this.funciones.alertaRetorno("question", "¿Este proceso ya no formará parte de este proyecto, está de acuerdo?", "", true, (respuesta) => {
          if (respuesta.value) {
            let param = { "id_fase": this.listContratacionObra[index].id_fase, "identificador": this.listContratacionObra[index].identificador, "usuario_eliminacion": sessionStorage.getItem("Usuario") };
            this.servicio.anularFaseIdentificador(param).subscribe((data: any) => {
              this.busqueda(1);
            });
          }
        });
      }
    }
    else {
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
  }

  setearEstadoCorrespondeProyecto(index) {
    if (this.listContratacionObra[index].correspondeproyecto) {
      return true;
    } else {
      return false;
    }
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.idSeguimientoObra = 0;
      } else {
        this.idSeguimientoObra = parseInt(sessionStorage.getItem("idSeguimiento").toString());
      }
    } else {
      this.idSeguimientoObra = parseInt(this.idSeguimientoMonitoreoObra.toString());
      sessionStorage.setItem("idSeguimiento", this.idSeguimientoObra.toString());
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
    this.entidadBusqueda.numero_Pagina = (pagina.page * 10) - 10;
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
    this.entidadBusqueda.tipo = TipoObjeto.OBRA;
    this.entidadBusqueda.numero_Pagina = (pagina * 10) - 10;
    this.entidadBusqueda.num_filas = 10;
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

  guardarContratista(identificador: number, tipo: number) {
    let parametro: ProcesoSeleccionBienesServiciosRequest = new ProcesoSeleccionBienesServiciosRequest();
    let beResultados;
    let ListDetalleContratista = [];

    parametro.tipo = tipo;
    parametro.identificador = identificador;
    //registrar Contratista Contratado
    this.ServicioContr.listarContratista(this.idSeguimientoMonitoreoObra, 5, 0).subscribe(
      data => {
        let respuesta = data as any;
        let cantidad = respuesta[0].cantidad;
        if (cantidad == 0) {
          this.servicio.verResultado(parametro).subscribe(
            respuesta => {
              beResultados = respuesta as any;
              let miembros = beResultados[0].miembros as any;
              let consorcio = beResultados[0].consorcio;

              this.contratistaRegistrar = new Contratista();

              this.contratistaRegistrar.id_contratista_seguimiento_obra = 0;
              this.contratistaRegistrar.id_seguimiento_monitoreo_obra = this.idSeguimientoObra;
              this.contratistaRegistrar.ruc = beResultados[0].ruc_codigo_ganador;
              this.contratistaRegistrar.razon_social = beResultados[0].ganador;
              this.contratistaRegistrar.apellido_representante_legal = "";
              this.contratistaRegistrar.nombre_representante_legal = "";
              this.contratistaRegistrar.dni_representante_legal = "";
              this.contratistaRegistrar.telefono = "";
              this.contratistaRegistrar.email = "";
              this.contratistaRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");

              if (consorcio == "S") {
                miembros.forEach(element => {
                  this.contratistaRegistrar.tipo_contratista = true;
                  ListDetalleContratista.push({
                    id_detalle_contratista_seguimiento_obra: 0,
                    id_contratista_seguimiento_obra: 0,
                    ruc_detalle: element.ruc_miembro_consorcio,
                    razon_social_detalle: element.nombre_miembro_consorcio,
                    usuario_creacion: sessionStorage.getItem("Usuario"),
                    activo: true,
                    nombre_porcentaje_participacion: element.porcentaje_participacion,
                  });
                });
                this.contratistaRegistrar.ListDetalleContratista = ListDetalleContratista;
              } else {
                this.contratistaRegistrar.tipo_contratista = false;
                this.contratistaRegistrar.ListDetalleContratista = [];
              }
              //registrar Contratista
              let registro = JSON.stringify(this.contratistaRegistrar);

              this.ServicioContr.registrarContratista(registro).subscribe(
                data => {
                }
              );
            }
          );
        }
      }
    );
  }

  openModalVerResultados(model) {
    model.snip = this.snip;
    model.id_proyecto = this.idProyecto;
    model.tipo = TipoObjeto.OBRA;
    model.idTramo = this.route.snapshot.params.idTramo;
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
