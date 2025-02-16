import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, AplicarTipoControl } from 'src/app/appSettings';
import { Paralizacion } from 'src/app/models/response/paralizacion';
import { ParalizacionModalComponent } from '../../paralizacion-modal/paralizacion-modal.component';
import { SeguimientoMonitoreo } from 'src/app/models/response/seguimiento-monitoreo';
import { ParalizacionAccion } from 'src/app/models/response/paralizacion-accion';
import { ParalizacionAccionComponent } from '../../paralizacion-accion/paralizacion-accion.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-periodo-paralizacion',
  templateUrl: './periodo-paralizacion.component.html',
  styleUrls: ['./periodo-paralizacion.component.css']
})
export class PeriodoParalizacionComponent implements OnInit {
  model_Paralizacion: Paralizacion;
  @Input() idSeguimientoMonitoreoObra: number
  @Input() tipoPerfil: string

  bsModalRef: BsModalRef;
  listParalizacion;
  model: SeguimientoMonitoreo;
  model_Accion_Paralizacion: ParalizacionAccion;
  UltimaActualizacionParalizacion: string = "";
  UltimaActualizacionAccionParalizacion: string = "";
  mostrarAuditoriaAccionParalizacion: boolean = true;
  idParalizacionObra: number;
  @Input() bEstado: boolean;

  listAccionParalizacion;
  bsModaAccParalizacion: BsModalRef;

  /*Juan Ojeda*/
  totalRegistrosParalizacion;
  paginaActiva: number = 0;
  numPaginasMostrar: number = 5;
  /*Fin*/

  constructor(private fs: FacadeService,
    private modalService: BsModalService,
    public funciones: Functions,
    public securityService: AuthService) { }


  monitoreo_tabSeg_paralizacion_listParalizacion: boolean
  monitoreo_tabSeg_paralizacion_regParalizacion: boolean
  monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion: boolean
  monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones: boolean
  monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_editParalizacion: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_eliParalizacion: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo: boolean


  ngOnInit() {
    this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
    if (sessionStorage.getItem("esSuspension") == "false") {
      this.crearSeguimientoMOnitoreoModel(this.idSeguimientoMonitoreoObra);
      this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
    }




    this.monitoreo_tabSeg_paralizacion_listParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion");
    this.monitoreo_tabSeg_paralizacion_regParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_regParalizacion")
    this.monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones = this.esVisible("monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion")
    this.monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones = this.esVisible("monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones")
    this.monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones = this.esVisible("monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_editParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_editParalizacion")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_eliParalizacion = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_eliParalizacion")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo")
  }

  crearSeguimientoMOnitoreoModel(idSegMonitoreo) {
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, this.bEstado).subscribe(
      respuesta => {
        this.model = new SeguimientoMonitoreo();

        if (respuesta != "{ \"data\":[{}]}") {
          if (respuesta[0].fecha_inicio_contractual != null) {
            this.model.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(respuesta[0].fecha_inicio_contractual);
          }

        }
      });
    // this.fs.seguimientoMonitoreoService.ObtenerSeguimiento(idSegMonitoreo).subscribe();
  }
  rValidacion: any;
  mensajeValidarCausalParalizacion: string = "";
  // validarCausalParalizacion() {
  //   this.fs.paralizacionService.validarCausalParalizacion(this.idSeguimientoMonitoreoObra, "UEI").subscribe(
  //     respuesta => {
  //       this.rValidacion = respuesta as any;
  //       if (!this.rValidacion.estado) {
  //         this.mensajeValidarCausalParalizacion = "";
  //         this.funciones.mensaje("info", "Existe una paralización pendiente de su Reinicio de la Obra y/o pendiente de su ampliación.");
  //       } else {
  //         this.mensajeValidarCausalParalizacion = "validado";
  //       }
  //     });
  // }

  config;
  opnModNuevaParalizacion() {
    this.fs.paralizacionService.validarCausalParalizacion(this.idSeguimientoMonitoreoObra, "UEI", "", 0).subscribe(
      respuesta => {
        this.rValidacion = respuesta as any;
        if (!this.rValidacion.estado) {
          this.mensajeValidarCausalParalizacion = "";
          this.funciones.mensaje("info", "Existe una paralización pendiente de su Reinicio de la Obra y/o pendiente de su ampliación.");
        } else {
          this.mensajeValidarCausalParalizacion = "validado";
        }

        if (this.mensajeValidarCausalParalizacion == "validado") {
          this.model_Paralizacion = new Paralizacion();
          this.model_Paralizacion.id_paralizacion_obra = 0;
          this.model_Paralizacion.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
          this.model_Paralizacion.perfil = this.tipoPerfil;

          this.config = {
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
              modelParalizacion: this.model_Paralizacion, fecha_inicio_contractual: this.model.fecha_inicio_contractual
            }
          };

          this.bsModalRef = this.modalService.show(ParalizacionModalComponent, this.config);
          this.bsModalRef.content.retornoValores.subscribe(
            () => {
              this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
              this.consultaAuditoria("Paralizacion");
            }
          )
        } else {
          this.funciones.mensaje("info", "Existe una paralización pendiente de su Reinicio de la Obra y/o pendiente de su Ampliación");
        }
        this.mensajeValidarCausalParalizacion = "";
      });

  }

  /*Juan Ojeda*/
  //paralizaciones
  listarParalizacion(id, pNumPagina, pNumFilas) {
    let sum = 0;
    this.fs.paralizacionService.listarParalizacion(id, this.tipoPerfil, pNumPagina, pNumFilas).subscribe(
      respuesta => {
        let paralizacionReturn;
        paralizacionReturn = respuesta as any;
        if (paralizacionReturn.cantidad_registro == 0) {
          this.listParalizacion = [];
        } else {
          /*Juan Ojeda*/
          this.listParalizacion = paralizacionReturn.paralizacion_obra;
          this.totalRegistrosParalizacion = paralizacionReturn.cantidad_registro;
          /*Fin*/

          if (this.listParalizacion) {
            this.listParalizacion.forEach(element => {

              let fechaInicio = new Date(element.fecha_inicio).getTime();
              let fechaFin = new Date(element.fecha_termino).getTime();

              var day_as_milliseconds = 86400000;
              var diff_in_millisenconds = fechaFin - fechaInicio;
              var diff_in_days = diff_in_millisenconds / day_as_milliseconds;

              sum = sum + diff_in_days;

              element.fecha_inicio = this.funciones.formatDate(element.fecha_inicio);
              element.fecha_termino = this.funciones.formatDate(element.fecha_termino);
              element.fecha_termino_sugerido = this.funciones.formatDate(element.fecha_termino);


            });
          }

          //this.RecalcularFechaTerminoParalizacion(sum);
        }
      }
    )
  };

  // RecalcularFechaTerminoParalizacion(numDias) {
  //   this.model.fecha_term_cont_ampl_paral = this.funciones.SumDaytoDate(this.model.fecha_term_cont_ampl, numDias);
  // }

  consultaAuditoria(pNombreTipoAuditoria) {
    this.fs.maestraService.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
      }
    );
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return " " + (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        return "";
      }
    }
    //Fin
  }

  /*Juan*/
  numPagina: number = 0;
  cambiarPaginaParalizacion(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numPagina = ((pagina.page - 1) * this.numPaginasMostrar);
    this.listAccionParalizacion = [];
    this.totalRegistrosParalizacionAccion = 0;
    this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.numPagina, this.numPaginasMostrar);
  }

  /*Fin Juan */
  //AccionParalizacion

  numPaginaAccionParalizacion: number = 0;
  numPaginasMostrarAccionParalizacion: number = 5;
  paginaActivaAccionParalizacion: number = 0;
  totalRegistrosParalizacionAccion: number = 0;
  idParalizacionAccionObraParametro: number = 0;
  cambiarPaginaAccionParalizacion(pagina) {
    this.paginaActivaAccionParalizacion = ((pagina.page - 1) * this.numPaginasMostrarAccionParalizacion);
    this.numPaginaAccionParalizacion = ((pagina.page - 1) * this.numPaginasMostrarAccionParalizacion);
    this.listarAccionParalizacion(this.idParalizacionAccionObraParametro, this.numPaginaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
  }

  listarAccionParalizacion(id, pNumPagina, pNumFilas) {
    this.fs.paralizacionAccionService.listarAccionParalizacion(id, pNumPagina, pNumFilas).subscribe(
      respuesta => {
        let paralizacionAccionReturn;
        paralizacionAccionReturn = respuesta as any;
        if (paralizacionAccionReturn.cantidad_registro == 0) {
          this.listAccionParalizacion = [];
        } else {
          this.listAccionParalizacion = paralizacionAccionReturn.paralizacion_accion_obra;
          this.totalRegistrosParalizacionAccion = paralizacionAccionReturn.cantidad_registro;
          this.listAccionParalizacion.forEach(element => {
            element.fecha = this.funciones.formatDate(element.fecha);
          });
        }
        if (paralizacionAccionReturn.auditoria != null) {
          this.UltimaActualizacionAccionParalizacion = (paralizacionAccionReturn.auditoria.usuario == null ? "" : paralizacionAccionReturn.auditoria.usuario) + (paralizacionAccionReturn.auditoria.fecha == null ? "" : " - " + this.funciones.formatFullDate(paralizacionAccionReturn.auditoria.fecha));
        }

      }
    )
  };

  ObtenerDetalleAccionesParalizacion(pIdParalizacionObra) {
    this.mostrarAuditoriaAccionParalizacion = false;
    this.idParalizacionAccionObraParametro = pIdParalizacionObra;
    this.listarAccionParalizacion(pIdParalizacionObra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion)
  }

  eliminarAccionParalizacion(model) {
    this.fs.paralizacionService.validarCausalParalizacionEliminar(this.idSeguimientoMonitoreoObra, this.tipoPerfil, model.id_paralizacion_obra).subscribe(
      (respuesta: any) => {
        if (!respuesta.estado) {
          this.funciones.mensaje("info", "Primero debe eliminar la ampliación asociado a la paralización");
          return false;
        } else {
          /**inicio */
          model.usuario_eliminacion = sessionStorage.getItem("Usuario");

          let strData = { id_paralizacion_accion_obra: model.id_paralizacion_accion_obra, usuario_eliminacion: model.usuario_eliminacion }
          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
            if (respuesta.value) {
              this.fs.paralizacionAccionService.eliminarAccionParalizacion(strData).subscribe(
                () => {
                  this.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
                  this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
                }
              );
            }
          });
          /**fin de validacion */
        }

      });












  }

  /*Fin */


  numAccionParalizacion: any;
  editarParalizacion(model: Paralizacion) {
    let cont = 0;
    this.fs.paralizacionAccionService.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion).subscribe(
      (respuesta: any) => {
        this.numAccionParalizacion = respuesta.paralizacion_accion_obra;

        for (let index = 0; index < this.numAccionParalizacion.length; index++) {
          if (this.numAccionParalizacion[index].cod_paralizacion_accion == "TPAO06" && this.numAccionParalizacion[index].cod_tipo_documento == "TDOC07") {
            cont++;
          }

        }
        if (cont > 0) {
          this.funciones.mensaje("warning", "No puede editar la paralización por tener acta de reinicio de obra");
          return false;
        } else {
          /**inicio */
          model.perfil = this.tipoPerfil;
          this.config = {
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
              modelParalizacion: model
            }
          };

          this.bsModalRef = this.modalService.show(ParalizacionModalComponent, this.config);
          this.bsModalRef.content.retornoValores.subscribe(
            () => {
              this.listarParalizacion(model.id_seguimiento_monitoreo_obra, this.paginaActiva, this.numPaginasMostrar);
              this.consultaAuditoria("Paralizacion");
            }
          )
          /**termino */
        }

      }
    )

  }

  eliminarParalizacion(model) {
    let cont = 0;
    this.fs.paralizacionAccionService.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion).subscribe(
      (respuesta: any) => {
        this.numAccionParalizacion = respuesta.paralizacion_accion_obra;

        for (let index = 0; index < this.numAccionParalizacion.length; index++) {
          if (this.numAccionParalizacion[index].cod_paralizacion_accion == "TPAO06" && this.numAccionParalizacion[index].cod_tipo_documento == "TDOC07") {
            cont++;
          }
        }
        if (cont > 0) {
          this.funciones.mensaje("warning", "No puede eliminar la paralización por tener acta de reinicio de obra");
          return false;
        } else {
          this.listarAccionesParalizacionEliminar(model);
        }
      }
    )
  }

  listarAccionesParalizacionEliminar(model) {
    this.fs.paralizacionAccionService.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion).subscribe(
      respuesta => {
        let paralizacionAccionReturnEliminar;
        paralizacionAccionReturnEliminar = respuesta as any;
        if (paralizacionAccionReturnEliminar.cantidad_registro == 0) {
          model.usuario_eliminacion = sessionStorage.getItem("Usuario");
          let strData = { id_paralizacion_obra: model.id_paralizacion_obra, usuario_eliminacion: model.usuario_eliminacion }//modificar bd

          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
            if (respuesta.value) {
              this.fs.paralizacionService.eliminarParalizacion(strData).subscribe(
                () => {
                  this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
                  this.consultaAuditoria("Paralizacion");
                }
              );
            }
          });
        } else {
          this.funciones.mensaje("warning", "La paralización a eliminar contiene acciones asociadas.");
        }

      }
    )
  };

  openModalAccParalizacion(model) {
    this.model_Accion_Paralizacion = new ParalizacionAccion();
    this.model_Accion_Paralizacion.id_paralizacion_accion_obra = 0;
    this.model_Accion_Paralizacion.id_paralizacion_obra = model.id_paralizacion_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelAccionParalizacion: this.model_Accion_Paralizacion, minDate: model.fecha_inicio, maxDate: model.fecha_termino
      }
    };

    this.bsModaAccParalizacion = this.modalService.show(ParalizacionAccionComponent, this.config);
    this.bsModaAccParalizacion.content.retornoValores.subscribe(
      () => {
        this.listarAccionParalizacion(this.model_Accion_Paralizacion.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
        this.listarParalizacion(model.id_seguimiento_monitoreo_obra, this.paginaActiva, this.numPaginasMostrar);
      }
    )
  }


  editarAccionParalizacion(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelAccionParalizacion: model, minDate: model.fecha_inicio, maxDate: model.fecha_termino
      }
    };

    this.bsModaAccParalizacion = this.modalService.show(ParalizacionAccionComponent, this.config);
    this.bsModaAccParalizacion.content.retornoValores.subscribe(
      () => {
        this.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
      }
    )
  }

  esVisible(hasClaimType): boolean {
    hasClaimType = hasClaimType + "_" + this.tipoPerfil;
    let value = this.securityService.hasClaim(hasClaimType) == AplicarTipoControl.Visible;
    return value;
  }
}