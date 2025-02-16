import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from '../../patterns/facade.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../appSettings/funciones';
import { AplicarTipoControl } from '../../../appSettings/enumeraciones';
import { Paralizacion } from '../../../models/response/paralizacion';
import { SeguimientoMonitoreo } from '../../../models/response/seguimiento-monitoreo';
import { ParalizacionAccion } from '../../../models/response/paralizacion-accion';
import { ParalizacionAccionExpTecComponent } from '../paralizacion-accion-exp-tec/paralizacion-accion-exp-tec.component';
import { ParalizacionModalExpTecComponent } from '../paralizacion-modal-exp-tec/paralizacion-modal-exp-tec.component';
import { AuthService } from '../../auth/auth.service';




@Component({
  selector: 'set-periodo-paralizacion-exp-tec',
  templateUrl: './periodo-paralizacion-exp-tec.component.html',
  styleUrls: ['./periodo-paralizacion-exp-tec.component.css']
})
export class PeriodoParalizacionExpTecComponent implements OnInit {

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

  totalRegistrosParalizacion;
  paginaActiva: number = 0;
  numPaginasMostrar: number = 5;

  constructor(private fs: FacadeService,
    private modalService: BsModalService,
    public funciones: Funciones,
    public securityService: AuthService) { }


  monitoreo_tabSeg_paralizacion_listParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_regParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_nuevParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_editParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_eliParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_listAccionParalizacion_editAccionParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_listAccionParalizacion_eliAccionParalizacion_exp_tec: boolean
  monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo_exp_tec: boolean


  ngOnInit() {
    this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
    this.crearSeguimientoMOnitoreoModel(this.idSeguimientoMonitoreoObra);
    this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);


    this.monitoreo_tabSeg_paralizacion_listParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_exp_tec");
    this.monitoreo_tabSeg_paralizacion_regParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_regParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_nuevParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_nuevParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_regDetalleParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_editParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_editParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_eliParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_eliParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_listDetalleParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_listAccionParalizacion_editAccionParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listAccionParalizacion_editAccionParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_listAccionParalizacion_eliAccionParalizacion_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listAccionParalizacion_eliAccionParalizacion_exp_tec")
    this.monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo_exp_tec = this.esVisible("monitoreo_tabSeg_paralizacion_listParalizacion_verArchivo_exp_tec")
  }

  crearSeguimientoMOnitoreoModel(idSegMonitoreo) {
    this.fs.seguimientoMonitoreoExpTecService.listarSeguimientoMonitoreo(idSegMonitoreo, this.bEstado).subscribe(
      respuesta => {
        this.model = new SeguimientoMonitoreo();

        if (respuesta != "{ \"data\":[{}]}") {
          this.model.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(respuesta[0].fecha_inicio_contractual);  
        }
      });
  }

  config;
  opnModNuevaParalizacion() {
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

    this.bsModalRef = this.modalService.show(ParalizacionModalExpTecComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
        //this.consultaAuditoria("Paralizacion");
      }
    )
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

 /* consultaAuditoria(pNombreTipoAuditoria) {
    this.fs.maestraService.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
      }
    );
  }*/

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

  numPagina: number = 0;
  cambiarPaginaParalizacion(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numPagina = ((pagina.page - 1) * this.numPaginasMostrar);
    this.listAccionParalizacion = [];
    this.totalRegistrosParalizacionAccion = 0;
    this.listarParalizacion(this.idSeguimientoMonitoreoObra, this.numPagina, this.numPaginasMostrar);
  }

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
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");

    let strData = { id_paralizacion_accion_obra: model.id_paralizacion_accion_obra, usuario_eliminacion: model.usuario_eliminacion }


    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.paralizacionAccionService.eliminarAccionParalizacion(strData).subscribe(
          () => {
            this.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
          }
        );
      }
    });
  }

  /*Fin */



  editarParalizacion(model: Paralizacion) {
    model.perfil = this.tipoPerfil;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelParalizacion: model
      }
    };

    this.bsModalRef = this.modalService.show(ParalizacionModalExpTecComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarParalizacion(model.id_seguimiento_monitoreo_obra, this.paginaActiva, this.numPaginasMostrar);
        //this.consultaAuditoria("Paralizacion");
      }
    )
  }

  eliminarParalizacion(model) {
    this.listarAccionesParalizacionEliminar(model);
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
                 // this.consultaAuditoria("Paralizacion");
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

    this.bsModaAccParalizacion = this.modalService.show(ParalizacionAccionExpTecComponent, this.config);
    this.bsModaAccParalizacion.content.retornoValores.subscribe(
      () => {
        this.listarAccionParalizacion(this.model_Accion_Paralizacion.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
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

    this.bsModaAccParalizacion = this.modalService.show(ParalizacionAccionExpTecComponent, this.config);
    this.bsModaAccParalizacion.content.retornoValores.subscribe(
      () => {
        this.listarAccionParalizacion(model.id_paralizacion_obra, this.paginaActivaAccionParalizacion, this.numPaginasMostrarAccionParalizacion);
      }
    )
  }

  esVisible(hasClaimType) : boolean {
    hasClaimType = hasClaimType + "_" + this.tipoPerfil;
    let value = this.securityService.hasClaim(hasClaimType) == AplicarTipoControl.Visible; 
    return value;
  }

}
