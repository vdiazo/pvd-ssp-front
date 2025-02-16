import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Functions } from '../../appSettings/functions';
import { Proyecto } from '../../models/request/proyecto-request';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { MaestraSsiService } from '../../servicios/maestra-ssi.service';
import { FacadeService } from '../../patterns/facade.service';
import { MapaComponent } from '../mapa/mapa.component';
import { ModalPdfComponent } from '../modal-pdf/modal-pdf.component';
import { ExcelService } from './exportar-reporte/reporte-principal';
import 'rxjs/add/operator/map';
import { TramoService } from '../../servicios/tramo.service';
import { take } from 'rxjs/operators';
import { SeguimientoPreinversionService } from '../../servicios/preinversion/seguimiento-preinversion.service';

@Component({
  selector: 'ssi-info-principal',
  templateUrl: './info-principal.component.html',
  styleUrls: ['./info-principal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InfoPrincipalComponent implements OnInit {
  public beProyecto: Proyecto = new Proyecto();
  proyectos = [];
  detalleTramos = [];
  proyectoMostrarTemporal = [];
  id_proyecto: number = 0;
  suma: number = 0;
  numColumnasDetalle: number = 0;
  anchoFase: number = 0;
  returnAnchoFase: string = "";
  anchoFaseDetalle: number = 0;
  returnAnchoFaseDetalle: string = "";
  p: number = this.beProyecto.num_pagina;
  totalfilasPorPagina: number = 0;
  contVecesEntrada: number = 1;
  mostrarDetalle: boolean = false;
  EstadoBusqueda: boolean = false;
  buscarProyecto: FormControl = new FormControl();
  buscarMunicipalidad: FormControl = new FormControl();
  buscarUnidadEjecutora: FormControl = new FormControl();
  proyects;
  unidadesEjecutoras;
  parametroEjecucionEstado: string;
  arrProyectosSeleccionados = [];
  id_municipalidad: string;
  nombre_municipalidad: string;
  estado_perfil: boolean = true;
  mostrar_fase_cabecera: boolean = false;
  lstTiposFase;
  numIdfase: number;
  listEstado: any = [];
  codigo_estado: string;
  numFases: number = 0;
  /*Paginacion*/
  numPagina: number = 0;
  totalRegistrosPrincipal;
  paginaActiva: number = 0;
  /*Fin*/
  public loading: boolean;
  styleLoader: string = 'oculto';
  /////////
  config;
  bsModalRef: BsModalRef;
  contadorExportar: number = 0;

  listRegiones = [];
  codDepa: string = null;

  arrCabeceraPrimeraFila = [];
  arrCabeceraSegundaFila = [];
  arrCabeceraTerceraFila = [];
  arrColsRowsPanPrimeraFila = [];
  arrColsRowsPanSegundaFila = [];
  arrColsRowsPanTerceraFila = [];
  arrDetalle = [];

  fasesCabeceraDetalle = [];
  fasesCabeceraDetalleMostrar = [];

  constructor(private fs: FacadeService,
    private router: Router,
    public funciones: Functions,
    private modalService: BsModalService,
    private svcMaestra: MaestraSsiService,
    private excelService: ExcelService,
    private tramoService: TramoService,
    private preinversionSvc: SeguimientoPreinversionService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {

    let nombrePerfil = sessionStorage.getItem("Nombre_Perfil");
    this.estado_perfil = ((nombrePerfil == "RESPONSABLE" || nombrePerfil == "COLABORADOR") ? true : false);

    this.beProyecto.id_municipalidad = parseInt(sessionStorage.getItem("IdMunicipalidad"));
    this.beProyecto.cod_depa = sessionStorage.getItem("Coddepa");
    this.beProyecto.nombre_perfil = sessionStorage.getItem("Nombre_Perfil");
    this.beProyecto.id_zona = parseInt(sessionStorage.getItem("IdZona"));
    this.beProyecto.id_usuario = parseInt(sessionStorage.getItem("IdUsuario"));
    this.beProyecto.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil"));
    this.beProyecto.nombre_municipalidad = sessionStorage.getItem("Municipalidad");
    this.beProyecto.codigo_estado = sessionStorage.getItem("p_id_estado");
    this.beProyecto.id_fase = parseInt(sessionStorage.getItem("p_id_fase"));

    if (sessionStorage.getItem('p_id_municipalidad') == null) {
      this.inicializarConsultaPrincipal(1);
    } else {
      this.asignarParametrosBusquedaBusquedaInicial();
    }

    this.ConsultaMunicipalidadesAutoComplete();
    this.ConsultarProyectosAutocomplete();
    this.consultaTiposFase();
    this.consultarRegiones();
    this.setearIdSeguimientoObra();
    this.listarEstado();
  }

  setearIdSeguimientoObra() {
    if (sessionStorage.getItem("idSeguimiento") != null) {
      if (parseInt(sessionStorage.getItem("idSeguimiento").toString()) > 0) {
        sessionStorage.removeItem("idSeguimiento");
        sessionStorage.removeItem("idSeguimiento_registro");
      }
    }
  }

  consultarRegiones(): void {
    this.fs.maestraService.listarDepartamentos().subscribe(
      respuesta => {
        this.listRegiones = respuesta as any;
      }
    )

    /* let codigoUsuario: number = 0;

    if (this.beProyecto.id_perfil == 10 || this.beProyecto.id_perfil == 6 || this.beProyecto.id_perfil == 3 || this.beProyecto.id_perfil == 2) {
      codigoUsuario = this.beProyecto.id_usuario;
    }

    this.svcPerfiles.listarRegionesSegunPerfilUsuario(this.beProyecto.id_perfil, codigoUsuario).subscribe(
      data => {
        this.listRegiones = data as any[];
      }
    ) */
  }

  consultaTiposFase() {
    this.fs.wsConsultaPrincipalService.listarTipoFases().subscribe(
      data => {
        this.lstTiposFase = data;
        this.numFases = this.lstTiposFase.length;
        this.numColumnasDetalle = this.lstTiposFase.length + 8;
      });
  }

  listarEstado() {
    this.fs.maestraService.listarEstadoProyecto().subscribe(
      respuesta => {
        this.listEstado = respuesta;
      }
    )
  }

  desabilitarUnidadEjecutora(pEstado) {
    return pEstado;
  }

  IrEjecucionEstado(pIdSeguimientoMonitoreo, pIdTramo, pIdFase, idProyecto?: number, pidTipoFase?: number, pSnip?: number, pidMunicipalidad?: number, pNombreTipoFase?: string) {
    /* if (pidTipoFase != 5) {
      return false;
    } */
    let vIdFase: number = (pIdFase != null ? pIdFase : 0);
    let vIdSeguimientoMonitoreo: Number = (pIdSeguimientoMonitoreo != null ? pIdSeguimientoMonitoreo : 0);
    let vIdTramo: Number = (pIdTramo != null ? pIdTramo : 0);
    let vSnip: Number = (pSnip != null ? pSnip : 0);
    let vIdMunicipalidad: Number = (pidMunicipalidad != null ? pidMunicipalidad : 0);

    if (pNombreTipoFase == "OBRA") {
      sessionStorage.setItem("DatosAuditoria", "");
      this.svcMaestra.consultDatosAuditoria(vIdFase).subscribe(
        respuesta => {
          sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
          this.router.navigate(["/ssi/proyecto/info-general", vIdSeguimientoMonitoreo, vIdTramo, vIdFase, idProyecto, vSnip, vIdMunicipalidad]);
        }
      );
    }
    else if (pNombreTipoFase == "EXPEDIENTE TÉCNICO") {
      sessionStorage.setItem("DatosAuditoria", "");
      this.svcMaestra.consultDatosAuditoriaExpediente(vIdFase).subscribe(
        respuesta => {
          sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
          this.router.navigate(["/ssi/expediente/info-general", vIdSeguimientoMonitoreo, vIdTramo, vIdFase, idProyecto, vSnip, vIdMunicipalidad]);
        }
      );
    }
    else if (pNombreTipoFase == "PRE INVERSION") {
      sessionStorage.setItem("DatosAuditoria", "");
      const param = { id_fase: vIdFase };
      this.preinversionSvc.listarAuditoriaPreinversion(param).subscribe((data: any) => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(data));
        this.router.navigate(["/ssi/preinversion/info-general", vIdSeguimientoMonitoreo, vIdTramo, vIdFase, idProyecto, vSnip, vIdMunicipalidad]);
      });
    }
  }

  ConsultaMunicipalidadesAutoComplete() {
    this.buscarMunicipalidad.valueChanges.subscribe(
      term => {
        if (term != '') {
          if (term.length > 2) {
            let idMunicipalidad: number = 0;
            if (term.split('|').length > 1) {
              term = term.split('|')[1];
            }
            // this.maestraServices.listarMunicipalidadPorFiltro(idMunicipalidad, term).subscribe(
            this.fs.maestraService.listarMunicipalidadPorFiltro(this.beProyecto, term).subscribe(
              data => {
                if (data.length != 0) {
                  this.unidadesEjecutoras = data;
                } else {
                  this.unidadesEjecutoras = [];
                }
              })
          } else {
            this.unidadesEjecutoras = undefined;
          }
        } else {
          this.unidadesEjecutoras = undefined;
          this.beProyecto.id_municipalidad = 0;
        }
      })
  }

  ConsultarProyectosAutocomplete() {
    this.buscarProyecto.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            const busqueda = term;
            this.tramoService.BusquedaProyecto(busqueda).subscribe(
              data => {
                this.proyects = data;
              });
          } else {
            this.proyects = null;
          }
        }
      });
    /* var self = this;

    self.buscarProyecto.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            self.beProyecto.nombre_proyecto = term.toUpperCase();
            self.beProyecto.cod_snip = 0;
            (<any>window).Pace.ignore(function () {
              self.fs.wsConsultaPrincipalService.wsConsultaAutocompletadoPrincipal(self.beProyecto).subscribe(
                data => {
                  let proyectoReturn;
                  proyectoReturn = data as any;
                  self.proyects = proyectoReturn.proyecto;
                  if (self.beProyecto.cod_snip == 0) {
                    self.beProyecto.cod_snip_texto = '';
                  }
                })
            });
          } else {
            self.proyects = undefined;
          }
        }
      }) */
  }

  mostrarProyectoInicial(beProyecto) {
    this.ConsultaPrincipal(beProyecto);
  }

  mostrarMunicipalidadSeleccionado(pMunicipalidadSeleccionada) {
    this.beProyecto.id_municipalidad = pMunicipalidadSeleccionada.split('|')[0];
    this.beProyecto.nombre_municipalidad = pMunicipalidadSeleccionada.split('|')[1];
    //this.beUnidadEjecutoraResponse.id_municipalidad = this.beProyecto.id_municipalidad;
    this.proyects = undefined;
  }

  mostrarProyectoSeleccionado(pProyectoSeleccionado) {
    this.beProyecto.id_proyecto = pProyectoSeleccionado.split('|')[0];
    this.beProyecto.nombre_proyecto = pProyectoSeleccionado.split('|')[1];
    this.proyects = undefined;
  }

  limpiarAutocomplete() {
    this.proyects = undefined;
  }

  limpiarAutocompleteMunicipalidad() {
    this.unidadesEjecutoras = undefined;
  }

  getProyectoSeleccionado(pIdProyecto) {
    if (!this.EstadoBusqueda) {
      if (this.arrProyectosSeleccionados != null) {
        for (let i = 0; i < this.arrProyectosSeleccionados.length; i++) {
          if (this.arrProyectosSeleccionados.indexOf(pIdProyecto) == -1) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  verTramos(idProyecto) {
    this.EstadoBusqueda = false;
    if (this.arrProyectosSeleccionados.indexOf(idProyecto) == -1) {
      this.arrProyectosSeleccionados.push(idProyecto);
      //this.ConsultaDetalleTramo(idProyecto, this.beUnidadEjecutoraResponse.id_municipalidad,this.beProyecto.nombre_proyecto);
      this.ConsultaDetalleTramo(idProyecto, this.beProyecto);
    } else {
      if (this.arrProyectosSeleccionados != null && this.arrProyectosSeleccionados != undefined) {
        for (let i = 0; i < this.arrProyectosSeleccionados.length; i++) {
          if (this.arrProyectosSeleccionados[i] == idProyecto) {
            this.arrProyectosSeleccionados.splice(i, 1);
            for (let j = 0; j < this.detalleTramos.length; j) {
              if (this.detalleTramos[j].id_proyecto == idProyecto) {
                this.detalleTramos.splice(j, 1)
              } else {
                j++;
              }
            }
          }
        }
      }
    }
  }

  //ConsultaDetalleTramo(pIdProyecto, pIdMunicipalidad,pNombreProyecto) {
  ConsultaDetalleTramo(pIdProyecto, pbeProyecto) {
    if (pbeProyecto.nombre_municipalidad == "") {
      //pIdMunicipalidad = 0;
      pbeProyecto.id_municipalidad = 0;
    }
    //this.servicio.wsConsultaTramosPorProyecto(pIdProyecto, pIdMunicipalidad,pNombreProyecto).subscribe(
    this.fs.wsConsultaPrincipalService.wsConsultaTramosPorProyecto(pIdProyecto, pbeProyecto).subscribe(
      data => {
        this.detalleTramos = this.detalleTramos.concat(data);
        return true;
      }
    )
  }

  mostrarFila(idProyectoSeleccionado, idProyecto) {
    if (!this.EstadoBusqueda) {
      if (this.proyectos != null) {
        if (idProyectoSeleccionado == idProyecto) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  /* Mostrar Fecha de Inicio y Fecha de Termino*/
  getDatosFaseProyectoIdSegMonitoreo(FasesRow, p_id_tipo_fase) {
    let vIdSeguimientoMonitoreo: number = 0;
    for (let row of FasesRow) {
      if (row.id_tipo_fase == p_id_tipo_fase) {
        if (row.id_tipo_fase == 4 && row.id_tipo_fase != "") {
          vIdSeguimientoMonitoreo = row.id_seguimiento_ejecucion_expediente
        }
        if (row.id_tipo_fase == 5 && row.id_tipo_fase != "") {
          vIdSeguimientoMonitoreo = row.id_seguimiento_monitoreo_obra;
        }
        // vIdSeguimientoMonitoreo = row.id_seguimiento_monitoreo_obra;
      }
    }
    return vIdSeguimientoMonitoreo;
  }

  getDatosFaseProyectoIdFase(FasesRow, p_id_tipo_fase) {
    let vIdFase: number = 0;
    for (let row of FasesRow) {
      if (row.id_tipo_fase == p_id_tipo_fase) {
        vIdFase = row.id_fase;
        if (vIdFase == null) {
          vIdFase = 0;
        }
      }
    }
    return vIdFase;
  }

  getFasePorProyecto(FasesRow, id_tipo_fase, tipo) {
    if (tipo == 1) {
      let retorno: boolean;

      for (let row of FasesRow) {
        if (row.id_tipo_fase == id_tipo_fase) {
          return true;
        } else {
          retorno = false;
        }
      }
      return retorno;
    } else {  //tipo==2
      let retorno: any;

      for (let row of FasesRow) {
        if (row.id_tipo_fase == id_tipo_fase) {
          retorno = this.funciones.fixed(row.porcentaje_avance, 1);
          return retorno;
        } else {
          retorno = 0;
        }
      }
      return retorno;
    }
  }

  getFasePorProyectoDetalle(pNumero) {
    if (pNumero != null) {
      return this.funciones.fixed(pNumero, 1);
    } else
      return 0.00;
  }

  getFaseValidacion(fase, pIdTipoFase) {
    if (fase != null) {
      for (let i = 0; i < fase.length; i++) {
        if (fase[i].id_tipo_fase == pIdTipoFase) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  getDetalleTramo(pIdProyectoSeleccionado) {
    let proyectoMostrar = [];
    if (this.detalleTramos != null && this.detalleTramos != undefined) {
      for (let i = 0; i < this.detalleTramos.length; i++) {
        if (pIdProyectoSeleccionado == this.detalleTramos[i].id_proyecto) {
          proyectoMostrar = proyectoMostrar.concat(this.detalleTramos[i]);
        }
      }
    }
    return proyectoMostrar;
  }

  mostrarPorcentaje(porcentaje) {
    if (porcentaje == null || porcentaje == undefined || porcentaje == "") {
      return true;
    }
    return false;
  }

  getInformacionTramoModeloDetalle(indexProyecto) {
    let numMaxColumns = 1;
    let idIndexTramoReturn = 0;
    if (this.proyectos[indexProyecto].tramos != null) {
      for (let i = 0; i < this.proyectos[indexProyecto].tramos.length; i++) {
        if (this.proyectos[indexProyecto].tramos[i].fases != null) {
          const numFases = this.proyectos[indexProyecto].tramos[i].fases.length;
          if (numFases > numMaxColumns) {
            numMaxColumns = numFases;
            idIndexTramoReturn = i;
          }
        }
      }
      if (this.proyectos[indexProyecto].tramos.length > 0) {
        return this.proyectos[indexProyecto].tramos[idIndexTramoReturn].fases;
      } else {
        return this.proyectos[indexProyecto].tramos;
      }
    }
  }

  getPorcentajeAvanceFaseDetalle(tramo, index) {
    let returnPorcentaje: string;
    if (tramo != null) {
      if (tramo.fases[index] != null) {
        let porcentaje = tramo.fases[index].porcentaje_avance;
        if (porcentaje != null) {
          returnPorcentaje = porcentaje.toString() + '%';
        } else {
          returnPorcentaje = "";
        }

        return returnPorcentaje;
      } else {
        return '';
      }

    } else {
      return '';
    }
  }

  asignarParametrosBusquedaBusquedaInicial() {
    let pbeProyecto = new Proyecto();
    pbeProyecto.id_municipalidad = Number(sessionStorage.getItem("p_id_municipalidad"));
    pbeProyecto.nombre_municipalidad = sessionStorage.getItem("p_nombre_municipalidad");
    pbeProyecto.nombre_proyecto = sessionStorage.getItem("p_nombre_proyecto");
    this.codDepa = (sessionStorage.getItem("p_codDepa") == "") ? null : sessionStorage.getItem("p_codDepa");
    this.numIdfase = Number(sessionStorage.getItem("p_id_fase")) == 0 ? null : Number(sessionStorage.getItem("p_id_fase"));
    this.codigo_estado = (sessionStorage.getItem("p_id_estado") == "") ? null : sessionStorage.getItem("p_id_estado");
    pbeProyecto.cod_snip_texto = sessionStorage.getItem("p_cod_snip_texto");
    pbeProyecto.num_pagina = Number(sessionStorage.getItem("p_numero_pagina"));
    pbeProyecto.codigo_estado = sessionStorage.getItem("p_id_estado");
    pbeProyecto.id_fase = Number(sessionStorage.getItem("p_id_fase"));

    this.beProyecto.id_municipalidad = pbeProyecto.id_municipalidad;
    this.beProyecto.nombre_municipalidad = pbeProyecto.nombre_municipalidad;
    this.beProyecto.nombre_proyecto = pbeProyecto.nombre_proyecto;
    this.beProyecto.cod_snip_texto = pbeProyecto.cod_snip_texto;
    this.beProyecto.num_pagina = pbeProyecto.num_pagina;
    this.beProyecto.codigo_estado = pbeProyecto.codigo_estado;
    this.beProyecto.id_fase = pbeProyecto.id_fase;

    pbeProyecto.id_usuario = parseInt(sessionStorage.getItem("IdUsuario"));
    pbeProyecto.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil"));

    this.paginaActiva = Number(sessionStorage.getItem("p_numero_pagina_activa"));
    this.ConsultaPrincipal(pbeProyecto);
  }

  asignarParametrosBusquedaSessionStorage(beProyecto: Proyecto) {
    sessionStorage.removeItem("p_id_municipalidad");
    sessionStorage.removeItem("p_nombre_municipalidad");
    sessionStorage.removeItem("p_nombre_proyecto");
    sessionStorage.removeItem("p_codDepa");
    sessionStorage.removeItem("p_cod_snip_texto");
    sessionStorage.removeItem("p_numero_pagina");
    sessionStorage.removeItem("p_numero_pagina_activa");
    sessionStorage.removeItem("p_ id_fase");
    sessionStorage.removeItem("p_id_estado");


    sessionStorage.setItem("p_id_municipalidad", beProyecto.id_municipalidad.toString());
    sessionStorage.setItem("p_nombre_municipalidad", beProyecto.nombre_municipalidad);
    sessionStorage.setItem("p_nombre_proyecto", beProyecto.nombre_proyecto);
    sessionStorage.setItem("p_codDepa", beProyecto.coddepartamento);
    sessionStorage.setItem("p_cod_snip_texto", beProyecto.cod_snip_texto);
    sessionStorage.setItem("p_numero_pagina", beProyecto.num_pagina.toString());
    sessionStorage.setItem("p_numero_pagina_activa", this.paginaActiva.toString());
    sessionStorage.setItem("p_id_fase", beProyecto.id_fase.toString());
    sessionStorage.setItem("p_id_estado", beProyecto.codigo_estado.toString());
  }

  ConsultaPrincipal(beProyecto: Proyecto) {
    if (beProyecto.nombre_municipalidad == '') {
      beProyecto.id_municipalidad = 0;
    }
    this.EstadoBusqueda = true;
    this.arrProyectosSeleccionados = [];
    this.detalleTramos = [];

    beProyecto.coddepartamento = (this.codDepa == null ? '' : this.codDepa);
    beProyecto.codigo_estado = (this.codigo_estado == null ? '' : this.codigo_estado);
    beProyecto.id_fase = (this.numIdfase == null ? 0 : this.numIdfase);
    this.asignarParametrosBusquedaSessionStorage(beProyecto);
    this.fs.wsConsultaPrincipalService.wsConsultaPrincipalExpedienteFiltro(beProyecto)
      .pipe(take(1))
      .subscribe(
        data => {
          this.loading = false;
          let proyectoReturn;
          proyectoReturn = data as any;
          this.proyectos = proyectoReturn.proyecto;
          this.totalfilasPorPagina = proyectoReturn.cantidad_registro;
          if (beProyecto.cod_snip == 0) {
            beProyecto.cod_snip_texto = '';
          }
          //this.pager = this.pagerService.getPager(this.totalfilasPorPagina, this.beProyecto.page);
          this.SetearPaginaActiva(this.paginaActiva);
        }
      )
  }

  SetearPaginaActiva(parametro) {
    setTimeout(() => { this.paginaActiva = parametro; }, 1)
  }

  CompararEquidadNombreTramoProyecto(pNombreProyecto, pNombreTramo) {
    if (pNombreTramo != null) {
      if (pNombreProyecto == pNombreTramo) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  abrirConsultaSnip(pSnip) {
    if (pSnip >= 1000000) {
      window.open('http://ofi5.mef.gob.pe/invierte/ejecucion/verFichaEjecucion/' + pSnip, '_blank');
    } else {
      window.open('http://ofi4.mef.gob.pe/bp/ConsultarPIP/frmConsultarPIP.asp?accion=consultar&txtCodigo=' + pSnip, '_blank');
    }
  }

  inicializarConsultaPrincipal(pagina) {
    this.detalleTramos = [];
    this.arrProyectosSeleccionados = [];
    this.EstadoBusqueda = true;
    this.loading = true;
    this.paginaActiva = pagina;
    this.beProyecto.num_pagina = ((pagina - 1) * this.beProyecto.num_filas);
    this.ConsultaPrincipal(this.beProyecto);
  }

  cambiarPaginaPrincipal(pagina) {
    this.detalleTramos = [];
    this.arrProyectosSeleccionados = [];
    this.EstadoBusqueda = true;
    this.loading = true;
    this.paginaActiva = pagina.page;
    this.beProyecto.num_pagina = ((pagina.page - 1) * this.beProyecto.num_filas);
    this.ConsultaPrincipal(this.beProyecto);
  }

  modalMapa(obj) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-reporte-financiero',
      initialState: {
        idProyecto: obj.id_proyecto,
        idTramo: obj.id_tramo
      }
    };
    this.bsModalRef = this.modalService.show(MapaComponent, this.config);
  }

  modalPDF(obj) {
    let entidadAyuda: any = {};
    let fecha: Date = new Date();
    let ListaFinanciera: any;
    let ArregloFinanciera: any = [];
    let montototal: any = 0;

    if (obj.id_tipo_fase == 5) {
      this.svcMaestra.AyudaMemoria(obj.id_tramo).subscribe(
        data => {
          entidadAyuda = data;
          if (entidadAyuda.gestion_transferencia != null) {
            entidadAyuda.gestion_transferencia.forEach(element => {
              montototal = montototal + element.monto_transferido;
            });
          }
          ListaFinanciera = entidadAyuda.fuente_financiera;
          if (data != '' && ListaFinanciera) {
            ListaFinanciera.forEach(element => {
              if (element.anio == fecha.getFullYear()) {
                ArregloFinanciera.push(element);
              }
            });
          }
        },
        error => '',
        () => {
          if (entidadAyuda != '') {
            this.config = {
              ignoreBackdropClick: true,
              keyboard: false,
              initialState: {
                idTramo: obj.id_tramo,
                entidadAyuda: entidadAyuda,
                fecha: fecha,
                ListaFinanciera: ListaFinanciera,
                ArregloFinanciera: ArregloFinanciera,
                monto_total: montototal,
                idFase: obj.id_tipo_fase
              }
            };
            this.bsModalRef = this.modalService.show(ModalPdfComponent, this.config);
          } else {
            this.funciones.alertaSimple('error', 'Verificar informacion', '', true)
          }
        }
      )
    } else if (obj.id_tipo_fase == 4) {
      this.svcMaestra.AyudaMemoriaExpediente(obj.id_tramo).subscribe(
        data => {
          entidadAyuda = data;
        },
        error => '',
        () => {
          if (entidadAyuda != '') {
            this.config = {
              ignoreBackdropClick: true,
              keyboard: false,
              initialState: {
                idTramo: obj.id_tramo,
                entidadAyuda: entidadAyuda,
                fecha: fecha,
                idFase: obj.id_tipo_fase
              }
            };
            this.bsModalRef = this.modalService.show(ModalPdfComponent, this.config);
          } else {
            this.funciones.alertaSimple('error', 'Verificar informacion', '', true)
          }
        }
      )
    }
  }

  busquedaEstado(estadoProyecto) {
    this.codigo_estado = estadoProyecto;
    this.ConsultaPrincipal(this.beProyecto);
  }

  obtenerCabeceraGrilla(pArrExportacion) {
    // LlenarDetalle
    this.arrDetalle = [];
    this.arrDetalle.push((pArrExportacion.proyecto == null ? "" : pArrExportacion.proyecto) + "\n\nTRAMO: (" + (pArrExportacion.tramo == null ? "" : pArrExportacion.tramo) + ")");
    this.arrDetalle.push((pArrExportacion.entidad == null ? "" : pArrExportacion.entidad));
    this.arrDetalle.push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].nombre_tipo_infraestructura == null ? "" : pArrExportacion.tipo_infraestructura[0].nombre_tipo_infraestructura)));
    this.arrDetalle.push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].unidad_medida == null ? "" : pArrExportacion.tipo_infraestructura[0].unidad_medida)));
    this.arrDetalle.push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].meta_global == null ? "" : pArrExportacion.tipo_infraestructura[0].meta_global)));
    this.arrDetalle.push((pArrExportacion.avance_bimensual == null ? "" : pArrExportacion.avance_bimensual + "%"));
    this.arrDetalle.push((pArrExportacion.avance_acumulado == null ? "" : pArrExportacion.avance_acumulado + "%"));
    this.arrDetalle.push((pArrExportacion.fecha_inicio_programado == null ? "" : pArrExportacion.fecha_inicio_programado));
    this.arrDetalle.push((pArrExportacion.fecha_inicio_ejecucion == null ? "" : pArrExportacion.fecha_inicio_ejecucion));
    this.arrDetalle.push((pArrExportacion.fecha_termino_programado == null ? "" : pArrExportacion.fecha_termino_programado));
    this.arrDetalle.push((pArrExportacion.fecha_termino_ejecucion == null ? "" : pArrExportacion.fecha_termino_ejecucion));
    //this.arrDetalle.push((pArrExportacion.monto_transferido == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(pArrExportacion.monto_transferido.toString()))));

    this.arrCabeceraPrimeraFila = [];
    this.arrCabeceraSegundaFila = [];
    this.arrCabeceraTerceraFila = [];
    this.arrColsRowsPanPrimeraFila = [];
    this.arrColsRowsPanSegundaFila = [];
    this.arrColsRowsPanTerceraFila = [];
    let contTerceraFila = 1;

    this.arrColsRowsPanPrimeraFila.push(
      { "columna": 1, "colspan": 0, "rowspan": 2 }
      , { "columna": 2, "colspan": 0, "rowspan": 2 }
      , { "columna": 3, "colspan": 0, "rowspan": 2 }
      , { "columna": 4, "colspan": 1, "rowspan": 0 }
      , { "columna": 6, "colspan": 1, "rowspan": 0 }
      , { "columna": 8, "colspan": 0, "rowspan": 2 }
      , { "columna": 9, "colspan": 0, "rowspan": 2 }
      , { "columna": 10, "colspan": 0, "rowspan": 2 }
      , { "columna": 11, "colspan": 0, "rowspan": 2 }
      //, { "columna": 12, "colspan": 0, "rowspan": 2 }
    );
    this.arrCabeceraPrimeraFila = [
      "Naturaleza / Descripción del Producto"
      , "Gobierno Local"
      , "Tipo de Infraestructura"
      , "Expediente Técnico o Documento"
      , ""
      , "Avance Físico"
      , ""
      , "Fecha de Inicio Programado"
      , "Fecha de Inicio Ejecución"
      , "Fecha de Término Programado"
      , "Fecha de Término de Ejecución"
      //, "Monto Transferido (Soles)"
      , "Cronograma Según Expediente Técnico"
    ];

    if (pArrExportacion != null) {
      //if (pArrExportacion.cronograma_expediente_tecnico != null) {
      if (pArrExportacion.periodo_inicio != null) {
        this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": this.funciones.obtenerDiferenciaMeses(pArrExportacion.periodo_inicio, pArrExportacion.periodo_fin) - 1, "rowspan": 0, "color": "0178BA" });
        for (let i = 0; i < this.funciones.obtenerDiferenciaMeses(pArrExportacion.periodo_inicio, pArrExportacion.periodo_fin) - 1; i++) {
          this.arrCabeceraPrimeraFila.push("");
        }
      } else {
        this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
      }

      // } else {
      //   this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 2 });
      // }

      this.arrCabeceraPrimeraFila.push("Monto Durante la Ejecución Física (Soles)");

      if (pArrExportacion.periodo_inicio != null) {
        //if (pArrExportacion.monto_ejecucion_fisica != null) {
        this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": this.funciones.obtenerDiferenciaMeses(pArrExportacion.periodo_inicio, pArrExportacion.periodo_fin) - 1, "rowspan": 0, "color": "408baf" });
        for (let i = 0; i < this.funciones.obtenerDiferenciaMeses(pArrExportacion.periodo_inicio, pArrExportacion.periodo_fin) - 1; i++) {
          this.arrCabeceraPrimeraFila.push("");
        }
      } else {
        this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
      }
      // } else {
      //   this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 2 });
      // }
    }

    this.arrColsRowsPanPrimeraFila.push(
      { "columna": this.arrCabeceraPrimeraFila.length + 1, "colspan": 0, "rowspan": 2 }
      , { "columna": this.arrCabeceraPrimeraFila.length + 2, "colspan": 0, "rowspan": 2 }
      , { "columna": this.arrCabeceraPrimeraFila.length + 3, "colspan": 5, "rowspan": 0 });

    this.arrCabeceraPrimeraFila.push("Total (Soles)"
      , "% Avance de Ejecución (Del Proyecto de Inversión)"
      , "Contrataciones", "", "", "", "", "", "Estado Situacional");

    this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 2 });

    //Segunda Fila
    this.arrCabeceraSegundaFila = ["", "", "", "Unidad de Medida (Km o m)", "Meta Global (Cantidad)"
      , "Avance Bimensual (%)", "Avance Acumulado (%)", "", "", "", ""];

    this.arrColsRowsPanSegundaFila.push(
      { "columna": 4, "colspan": 0, "rowspan": 1 }
      , { "columna": 5, "colspan": 0, "rowspan": 1 }
      , { "columna": 6, "colspan": 0, "rowspan": 1 }
      , { "columna": 7, "colspan": 0, "rowspan": 1 }
    );

    let arrMatrizMeses: any[];
    if (pArrExportacion != null) {
      if (pArrExportacion.periodo_inicio != null) {
        let anioInicio = pArrExportacion.periodo_inicio.split('/')[2];
        let anioFin = pArrExportacion.periodo_fin.split('/')[2];

        arrMatrizMeses = this.funciones.obtenerMatrizDiferenciaFechas(pArrExportacion.periodo_inicio, pArrExportacion.periodo_fin);
        for (let i = anioInicio; i <= anioFin; i++) {
          this.arrCabeceraSegundaFila.push(i);
          this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": this.funciones.contarNumeroMeses(arrMatrizMeses, i) - 1, "rowspan": 0, "color": "0178BA" });
          for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, i) - 1; j++) {
            this.arrCabeceraSegundaFila.push("");
          }
        }

        for (let x = anioInicio; x <= anioFin; x++) {
          this.arrCabeceraSegundaFila.push(x);
          this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": this.funciones.contarNumeroMeses(arrMatrizMeses, x) - 1, "rowspan": 0, "color": "408baf" });
          for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, x) - 1; j++) {
            this.arrCabeceraSegundaFila.push("");
          }
        }
      } else {
        this.arrCabeceraSegundaFila.push("");
        this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
        this.arrCabeceraSegundaFila.push("");
        this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
      }
    }

    this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length + 3, "colspan": 0, "rowspan": 1 }
      , { "columna": this.arrCabeceraSegundaFila.length + 4, "colspan": 0, "rowspan": 1 }
      , { "columna": this.arrCabeceraSegundaFila.length + 5, "colspan": 0, "rowspan": 1 }
      , { "columna": this.arrCabeceraSegundaFila.length + 6, "colspan": 0, "rowspan": 1 }
      , { "columna": this.arrCabeceraSegundaFila.length + 7, "colspan": 0, "rowspan": 1 }
      , { "columna": this.arrCabeceraSegundaFila.length + 8, "colspan": 0, "rowspan": 1 }
    );
    //pintar informacion detalle
    let encontroMes = "";
    let encontroAnio = "";
    if (arrMatrizMeses != null) {
      for (let n = 0; n < arrMatrizMeses.length; n++) {
        if (pArrExportacion.cronograma_expediente_tecnico != null) {
          pArrExportacion.cronograma_expediente_tecnico.forEach(element => {
            if (element.anio == arrMatrizMeses[n].Anio) {
              encontroAnio = "si";
              if (element.array_agg != null) {
                element.array_agg.forEach(mes => {
                  if (mes.periodo == this.funciones.obtenerCorrelativoMes(arrMatrizMeses[n].Mes)) {
                    encontroMes = "si";
                    this.arrDetalle.push((mes.valoracion_programada == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(mes.valoracion_programada.toString()))));
                  }
                });
                if (encontroMes == "") {
                  this.arrDetalle.push("");
                } else {
                  encontroMes = "";
                }
              } else {
                this.arrDetalle.push("");
              }
            }
          });
          //Si no encontro data en ese año
          if (encontroAnio == "") {
            //for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, arrMatrizMeses[n].Anio) - 1; j++) {
            this.arrDetalle.push("");
            //}
          } else {
            encontroAnio = "";
          }
        } else {
          //for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, arrMatrizMeses[n].Anio) - 1; j++) {
          this.arrDetalle.push("");
          //}
        }
      }
    } else {
      this.arrDetalle.push("");
    }
    //Detalle Ejecución Fisica
    encontroMes = "";
    encontroAnio = "";
    if (arrMatrizMeses != null) {
      for (let n = 0; n < arrMatrizMeses.length; n++) {
        if (pArrExportacion.monto_ejecucion_fisica != null) {
          pArrExportacion.monto_ejecucion_fisica.forEach(element => {
            if (element.anio == arrMatrizMeses[n].Anio) {
              encontroAnio = "si";
              if (element.periodo != null) {
                element.periodo.forEach(mes => {
                  if (mes.mes == this.funciones.obtenerCorrelativoMes(arrMatrizMeses[n].Mes)) {
                    encontroMes = "si";
                    this.arrDetalle.push((mes.monto == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(mes.monto.toString()))));
                  }
                });
                if (encontroMes == "") {
                  this.arrDetalle.push("");
                } else {
                  encontroMes = "";
                }
              }
            }
          });
          //Si no encontro data en ese año
          if (encontroAnio == "") {
            this.arrDetalle.push("");
          } else {
            encontroAnio = "";
          }
        } else {
          //for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, arrMatrizMeses[n].Anio) - 1; j++) {
          this.arrDetalle.push("");
          //}
        }
      }
    } else {
      this.arrDetalle.push("");
    }

    this.arrDetalle.push((pArrExportacion.monto_total == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(pArrExportacion.monto_total.toString()))));
    this.arrDetalle.push((pArrExportacion.avance_ejecucion_transferencia == null ? "" : pArrExportacion.avance_ejecucion_transferencia + "%"));
    this.arrDetalle.push((pArrExportacion.tipo_servicio == null ? "" : pArrExportacion.tipo_servicio));
    this.arrDetalle.push((pArrExportacion.numero_procedimiento_seleccion == null ? "" : pArrExportacion.numero_procedimiento_seleccion));
    this.arrDetalle.push("");
    if (pArrExportacion.contrato != null) {
      let numContrato = "";
      let rucProveedor = "";
      let nomProveedor = "";
      for (let y = 0; y < pArrExportacion.contrato.length; y++) {
        if (y == 0) {
          numContrato = numContrato + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].numero_contrato == null ? "" : pArrExportacion.contrato[y].numero_contrato);
          rucProveedor = rucProveedor + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].ruc_proveedor == null ? "" : pArrExportacion.contrato[y].ruc_proveedor);
          nomProveedor = nomProveedor + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].nombre_proveedor == null ? "" : pArrExportacion.contrato[y].nombre_proveedor);
        } else {
          numContrato = numContrato + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].numero_contrato == null ? "" : pArrExportacion.contrato[y].numero_contrato);
          rucProveedor = rucProveedor + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].ruc_proveedor == null ? "" : pArrExportacion.contrato[y].ruc_proveedor);
          nomProveedor = nomProveedor + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].nombre_proveedor == null ? "" : pArrExportacion.contrato[y].nombre_proveedor);
        }
      }
      this.arrDetalle.push(numContrato);
      this.arrDetalle.push(rucProveedor);
      this.arrDetalle.push(nomProveedor);
    }
    //Pintar Estado Situacional
    let estadoSituacional = "";
    if (pArrExportacion != null) {
      if (pArrExportacion.estado_situacional != null) {
        for (let i = 0; i < pArrExportacion.estado_situacional.length; i++) {
          if (i == 0) {
            estadoSituacional = estadoSituacional + (i + 1).toString() + ".- " + pArrExportacion.estado_situacional[i].titulo + ":" + "\n  " + pArrExportacion.estado_situacional[i].descripcion;
          } else {
            estadoSituacional = estadoSituacional + "\n\n" + (i + 1).toString() + ".- " + pArrExportacion.estado_situacional[i].titulo + ":" + "\n  " + pArrExportacion.estado_situacional[i].descripcion;
          }

        }
      }
    }
    this.arrDetalle.push(estadoSituacional);

    //fin
    this.arrCabeceraSegundaFila.push("", "", "Tipo Procedimiento", "Numero de Procedimiento de Selección", "¿El Contrato es Exclusivo de la Inversión?", "Número de Contrato", "RUC del Proveedor", "Nombre de Proveedor", "");

    //Tercera Fila
    this.arrCabeceraTerceraFila = ["", "", "", "", "", "", "", "", "", "", ""];
    if (pArrExportacion != null) {
      if (arrMatrizMeses != null) {
        for (let i = 0; i < arrMatrizMeses.length; i++) {
          this.arrCabeceraTerceraFila.push(this.funciones.obtenerAbreviacionMes(arrMatrizMeses[i].Mes));
          this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
        }

        for (let y = 0; y < arrMatrizMeses.length; y++) {
          this.arrCabeceraTerceraFila.push(this.funciones.obtenerAbreviacionMes(arrMatrizMeses[y].Mes));
          this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
        }
      } else {
        this.arrCabeceraTerceraFila.push("");
        this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
        this.arrCabeceraTerceraFila.push("");
        this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
      }

    }
    this.arrCabeceraTerceraFila.push("", "", "", "", "", "", "", "", "");
  }

  exportarReportePrincipal(model) {
    this.fs.wsConsultaPrincipalService.exportarSeguimientoMonitoreo(model).subscribe(
      data => {
        if (data != "") {
          let arrDatos;
          arrDatos = data as any;
          this.obtenerCabeceraGrilla(arrDatos);
          let arrDatosCabecera = [];
          arrDatosCabecera.push(["ENTIDAD:", arrDatos.entidad]
            , ["CÓDIGO UNIFICADO:", arrDatos.cod_unificado]
            , ["NOMBRE DE LA INVERSIÓN:", arrDatos.tramo]
            , ["PERIODO:", (arrDatos.periodo_inicio == null ? "" : this.funciones.obtenerAbreviacionMes(parseInt(arrDatos.periodo_inicio.split('/')[1])) + " - " + arrDatos.periodo_inicio.split('/')[2] + " / " + this.funciones.obtenerAbreviacionMes(parseInt(arrDatos.periodo_fin.split('/')[1])) + " - " + arrDatos.periodo_fin.split('/')[2])]
            , ["NÚMERO DE CONVENIO:", arrDatos.convenio
            ]);

          this.excelService.generateExcel(this.arrDetalle, "FORMATO N° 02: SEGUIMIENTO FÍSICO Y FINANCIERO DE LA EJECUCIÓN DE INVERSIONES*", this.arrCabeceraPrimeraFila, this.arrCabeceraSegundaFila, this.arrCabeceraTerceraFila, arrDatosCabecera, this.arrColsRowsPanPrimeraFila, this.arrColsRowsPanSegundaFila, this.arrColsRowsPanTerceraFila);
        } else {
          this.funciones.mensaje("info", "No existe información a exportar.");
        }
      }
    )
  }

  exportarReportePrincipalGeneral() {
    if (this.beProyecto.nombre_municipalidad == "") {
      this.beProyecto.id_municipalidad = 0;
    }
    this.fs.wsConsultaPrincipalService.exportarSeguimientoMonitoreoGeneral(this.beProyecto).subscribe(
      data => {
        if (data != "") {
          let arrDatos;
          arrDatos = data as any;
          let strPeriodoRango = this.obtenerPeriodosRango(arrDatos);
          arrDatos.forEach(element => {
            this.obtenerCabeceraGrillaGeneral(element, strPeriodoRango, this.contadorExportar);
            this.contadorExportar++;
          });

          this.excelService.generateExcelGeneral(this.arrDetalle, "FORMATO N° 02: SEGUIMIENTO FÍSICO Y FINANCIERO DE LA EJECUCIÓN DE INVERSIONES*", this.arrCabeceraPrimeraFila, this.arrCabeceraSegundaFila, this.arrCabeceraTerceraFila, this.arrColsRowsPanPrimeraFila, this.arrColsRowsPanSegundaFila, this.arrColsRowsPanTerceraFila);
          if (this.beProyecto.cod_snip == 0) {
            this.beProyecto.cod_snip_texto = "";
          }

        } else {
          this.funciones.mensaje("info", "No existe información a exportar.");
        }
      }
    )
  }

  obtenerPeriodosRango(arrDatos) {
    this.contadorExportar = 0;
    this.arrDetalle = [];
    let anioInicio = 0;
    let anioFin = 0;
    let anioInicioTemporal = 0;
    let anioFinTemporal = 0;
    let cont = 1;
    arrDatos.forEach(element => {
      this.arrDetalle.push([]);
      if (element.periodo_inicio != null) {
        if (cont == 1) {
          anioInicioTemporal = parseInt(element.periodo_inicio.split('/')[2]);
          anioFinTemporal = parseInt(element.periodo_fin.split('/')[2]);
          cont++;
        }
        anioInicio = parseInt(element.periodo_inicio.split('/')[2]);
        anioFin = parseInt(element.periodo_fin.split('/')[2]);
        if (anioInicioTemporal > anioInicio) {
          anioInicioTemporal = anioInicio;
        }

        if (anioFinTemporal < anioFin) {
          anioFinTemporal = anioFin;
        }
      }
    });

    if (cont == 1) {
      return "";
    } else {
      return anioInicioTemporal + "-" + anioFinTemporal;
    }
  }

  obtenerCabeceraGrillaGeneral(pArrExportacion, arrPeriodoRango, contador) {
    //LlenarDetalle
    //this.arrDetalle = [];
    this.arrDetalle[contador].push((pArrExportacion.cod_unificado == null ? "" : pArrExportacion.cod_unificado));
    this.arrDetalle[contador].push((pArrExportacion.periodo_inicio == null ? "" : this.funciones.obtenerAbreviacionMes(parseInt(pArrExportacion.periodo_inicio.split('/')[1])) + " - " + pArrExportacion.periodo_inicio.split('/')[2] + " / " + this.funciones.obtenerAbreviacionMes(parseInt(pArrExportacion.periodo_fin.split('/')[1])) + " - " + pArrExportacion.periodo_fin.split('/')[2]));

    if (pArrExportacion.convenio != null) {
      let numConvenio = "";
      for (let y = 0; y < pArrExportacion.convenio.length; y++) {
        if (y == 0) {
          numConvenio = numConvenio + (pArrExportacion.convenio.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.convenio[y].siglas == null ? "" : pArrExportacion.convenio[y].siglas);
        } else {
          numConvenio = numConvenio + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.convenio[y].siglas == null ? "" : pArrExportacion.convenio[y].siglas);
        }
      }
      this.arrDetalle[contador].push(numConvenio);
    }

    this.arrDetalle[contador].push((pArrExportacion.proyecto != null && pArrExportacion.tramo != null ?
      (pArrExportacion.proyecto == pArrExportacion.tramo ? pArrExportacion.proyecto :
        (pArrExportacion.proyecto == null ? "" : pArrExportacion.proyecto
          + "\n\nTRAMO: (" + (pArrExportacion.tramo == null ? "" : pArrExportacion.tramo) + ")")) :
      (pArrExportacion.proyecto == null ? "" : pArrExportacion.proyecto
        + "\n\nTRAMO: (" + (pArrExportacion.tramo == null ? "" : pArrExportacion.tramo) + ")"
      )));

    this.arrDetalle[contador].push((pArrExportacion.entidad == null ? "" : pArrExportacion.entidad));
    this.arrDetalle[contador].push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].nombre_tipo_infraestructura == null ? "" : pArrExportacion.tipo_infraestructura[0].nombre_tipo_infraestructura)));
    this.arrDetalle[contador].push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].unidad_medida == null ? "" : pArrExportacion.tipo_infraestructura[0].unidad_medida)));
    this.arrDetalle[contador].push((pArrExportacion.tipo_infraestructura == null ? "" : (pArrExportacion.tipo_infraestructura[0].meta_global == null ? "" : pArrExportacion.tipo_infraestructura[0].meta_global)));
    this.arrDetalle[contador].push((pArrExportacion.avance_bimensual == null ? "" : pArrExportacion.avance_bimensual + "%"));
    this.arrDetalle[contador].push((pArrExportacion.avance_acumulado == null ? "" : pArrExportacion.avance_acumulado + "%"));
    this.arrDetalle[contador].push((pArrExportacion.fecha_inicio_programado == null ? "" : pArrExportacion.fecha_inicio_programado));
    this.arrDetalle[contador].push((pArrExportacion.fecha_inicio_ejecucion == null ? "" : pArrExportacion.fecha_inicio_ejecucion));
    this.arrDetalle[contador].push((pArrExportacion.fecha_termino_programado == null ? "" : pArrExportacion.fecha_termino_programado));
    this.arrDetalle[contador].push((pArrExportacion.fecha_termino_ejecucion == null ? "" : pArrExportacion.fecha_termino_ejecucion));
    //this.arrDetalle[contador].push((pArrExportacion.monto_transferido == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(pArrExportacion.monto_transferido.toString()))));

    let arrMatrizMeses: any[];
    let anioInicio = 0;
    let anioFin = 0;
    if (arrPeriodoRango != "") {
      anioInicio = arrPeriodoRango.split('-')[0];
      anioFin = arrPeriodoRango.split('-')[1];
      arrMatrizMeses = this.funciones.obtenerMatrizDiferenciaFechasGeneral(anioInicio, anioFin);
    }

    if (contador == 0) {
      this.arrCabeceraPrimeraFila = [];
      this.arrCabeceraSegundaFila = [];
      this.arrCabeceraTerceraFila = [];
      this.arrColsRowsPanPrimeraFila = [];
      this.arrColsRowsPanSegundaFila = [];
      this.arrColsRowsPanTerceraFila = [];

      this.arrColsRowsPanPrimeraFila.push(
        { "columna": 1, "colspan": 0, "rowspan": 2 } //agregados
        , { "columna": 2, "colspan": 0, "rowspan": 2 }
        , { "columna": 3, "colspan": 0, "rowspan": 2 }
        , { "columna": 4, "colspan": 0, "rowspan": 2 }
        , { "columna": 5, "colspan": 0, "rowspan": 2 }
        , { "columna": 6, "colspan": 0, "rowspan": 2 }
        , { "columna": 7, "colspan": 1, "rowspan": 0 }
        , { "columna": 9, "colspan": 1, "rowspan": 0 }
        , { "columna": 11, "colspan": 0, "rowspan": 2 }
        , { "columna": 12, "colspan": 0, "rowspan": 2 }
        , { "columna": 13, "colspan": 0, "rowspan": 2 }
        , { "columna": 14, "colspan": 0, "rowspan": 2 }
        //, { "columna": 15, "colspan": 0, "rowspan": 2 }
      );
      this.arrCabeceraPrimeraFila = [
        "C.U."
        , "PERIODO"
        , "NÚMERO DE CONVENIO"
        , "Naturaleza / Descripción del Producto"
        , "UEI Responsable"
        , "Tipo de Infraestructura"
        , "Expediente Técnico o Documento"
        , ""
        , "Avance Físico"
        , ""
        , "Fecha de Inicio Programado"
        , "Fecha de Inicio Ejecución"
        , "Fecha de Término Programado"
        , "Fecha de Término de Ejecución"
        //, "Monto Transferido (Soles)"
        , "Cronograma Según Expediente Técnico"
      ];

      if (pArrExportacion != null) {
        if (arrPeriodoRango != "") { //El Año Inicio Menor 

          this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": (((anioFin - anioInicio) + 1) * 12) - 1, "rowspan": 0, "color": "0178BA" });
          for (let i = 0; i < (((anioFin - anioInicio) + 1) * 12) - 1; i++) {
            this.arrCabeceraPrimeraFila.push("");
          }

          this.arrCabeceraPrimeraFila.push("Monto Durante la Ejecución Física (Soles)");
          this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": (((anioFin - anioInicio) + 1) * 12) - 1, "rowspan": 0, "color": "408baf" });
          for (let i = 0; i < (((anioFin - anioInicio) + 1) * 12) - 1; i++) {
            this.arrCabeceraPrimeraFila.push("");
          }
        } else {
          this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
          this.arrCabeceraPrimeraFila.push("Monto Durante la Ejecución Física (Soles)");
          this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
        }
      }

      this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length + 1, "colspan": 0, "rowspan": 2 }
        , { "columna": this.arrCabeceraPrimeraFila.length + 2, "colspan": 0, "rowspan": 2 }
        , { "columna": this.arrCabeceraPrimeraFila.length + 3, "colspan": 5, "rowspan": 0 });

      this.arrCabeceraPrimeraFila.push("Total (Soles)"
        , "% Avance de Ejecución (Del Proyecto de Inversión)"
        , "Contrataciones", "", "", "", "", "", "Estado Situacional", "Estado Proyecto");

      this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length - 1, "colspan": 0, "rowspan": 2 });
      this.arrColsRowsPanPrimeraFila.push({ "columna": this.arrCabeceraPrimeraFila.length, "colspan": 0, "rowspan": 2 });

      //Segunda Fila
      this.arrCabeceraSegundaFila = ["", "", "", "", "", "", "Unidad de Medida (Km o m)", "Meta Global (Cantidad)"
        , "Avance Bimensual (%)", "Avance Acumulado (%)", "", "", "", ""];

      this.arrColsRowsPanSegundaFila.push({ "columna": 7, "colspan": 0, "rowspan": 1 }
        , { "columna": 8, "colspan": 0, "rowspan": 1 }
        , { "columna": 9, "colspan": 0, "rowspan": 1 }
        , { "columna": 10, "colspan": 0, "rowspan": 1 }
      );

      if (pArrExportacion != null) {
        if (arrPeriodoRango != "") {
          for (let i = anioInicio; i <= anioFin; i++) {
            this.arrCabeceraSegundaFila.push(i);
            this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 11, "rowspan": 0, "color": "0178BA" });
            for (let j = 0; j < 11; j++) {
              this.arrCabeceraSegundaFila.push("");
            }
          }

          for (let x = anioInicio; x <= anioFin; x++) {
            this.arrCabeceraSegundaFila.push(x);
            this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 11, "rowspan": 0, "color": "408baf" });
            for (let j = 0; j < 11; j++) {
              this.arrCabeceraSegundaFila.push("");
            }
          }
        } else {
          this.arrCabeceraSegundaFila.push("");
          this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
          this.arrCabeceraSegundaFila.push("");
          this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
        }
      }

      this.arrColsRowsPanSegundaFila.push({ "columna": this.arrCabeceraSegundaFila.length + 3, "colspan": 0, "rowspan": 1 }
        , { "columna": this.arrCabeceraSegundaFila.length + 4, "colspan": 0, "rowspan": 1 }
        , { "columna": this.arrCabeceraSegundaFila.length + 5, "colspan": 0, "rowspan": 1 }
        , { "columna": this.arrCabeceraSegundaFila.length + 6, "colspan": 0, "rowspan": 1 }
        , { "columna": this.arrCabeceraSegundaFila.length + 7, "colspan": 0, "rowspan": 1 }
        , { "columna": this.arrCabeceraSegundaFila.length + 8, "colspan": 0, "rowspan": 1 }
      );
    }

    //pintar informacion detalle
    let encontroMes = "";
    let encontroAnio = "";
    if (arrMatrizMeses != null) {
      for (let n = 0; n < arrMatrizMeses.length; n++) {
        if (pArrExportacion.cronograma_expediente_tecnico != null) {
          pArrExportacion.cronograma_expediente_tecnico.forEach(element => {
            if (element.anio == arrMatrizMeses[n].Anio) {
              encontroAnio = "si";
              if (element.array_agg != null) {
                element.array_agg.forEach(mes => {
                  if (mes.periodo == this.funciones.obtenerCorrelativoMes(arrMatrizMeses[n].Mes)) {
                    encontroMes = "si";
                    this.arrDetalle[contador].push((mes.valoracion_programada == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(mes.valoracion_programada.toString()))));
                  }
                });
                if (encontroMes == "") {
                  this.arrDetalle[contador].push("");
                } else {
                  encontroMes = "";
                }
              } else {
                this.arrDetalle[contador].push("");
              }
            }
          });
          //Si no encontro data en ese año
          if (encontroAnio == "") {
            //for (let j = 0; j < 12; j++) {
            this.arrDetalle[contador].push("");
            //}
          } else {
            encontroAnio = "";
          }
        } else {
          //for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, arrMatrizMeses[n].Anio) - 1; j++) {
          this.arrDetalle[contador].push("");
          //}
        }
      }
    } else {
      if (arrPeriodoRango == "") {
        this.arrDetalle[contador].push("");
      } else {
        arrMatrizMeses.forEach(element => {
          this.arrDetalle[contador].push("");
        });
      }
    }

    //Detalle Ejecución Fisica
    encontroMes = "";
    encontroAnio = "";
    if (arrMatrizMeses != null) {
      for (let n = 0; n < arrMatrizMeses.length; n++) {
        if (pArrExportacion.monto_ejecucion_fisica != null) {
          pArrExportacion.monto_ejecucion_fisica.forEach(element => {
            if (element.anio == arrMatrizMeses[n].Anio) {
              encontroAnio = "si";
              if (element.periodo != null) {
                element.periodo.forEach(mes => {
                  if (mes.mes == this.funciones.obtenerCorrelativoMes(arrMatrizMeses[n].Mes)) {
                    encontroMes = "si";
                    this.arrDetalle[contador].push((mes.monto == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(mes.monto.toString()))));
                  }
                });
                if (encontroMes == "") {
                  this.arrDetalle[contador].push("");
                } else {
                  encontroMes = "";
                }
              } else {
                this.arrDetalle[contador].push("");
              }
            }
          });
          //Si no encontro data en ese año
          if (encontroAnio == "") {
            //for (let j = 0; j < 12; j++) {
            this.arrDetalle[contador].push("");
            //}
          } else {
            encontroAnio = "";
          }
        } else {
          //for (let j = 0; j < this.funciones.contarNumeroMeses(arrMatrizMeses, arrMatrizMeses[n].Anio) - 1; j++) {
          this.arrDetalle[contador].push("");
          //}
        }
      }
    } else {
      if (arrPeriodoRango == "") {
        this.arrDetalle[contador].push("");
      } else {
        arrMatrizMeses.forEach(element => {
          this.arrDetalle[contador].push("");
        });
      }
    }


    this.arrDetalle[contador].push((pArrExportacion.monto_total == null ? "" : this.funciones.format(this.funciones.setearValorDecimal(pArrExportacion.monto_total.toString()))));
    this.arrDetalle[contador].push((pArrExportacion.avance_ejecucion_transferencia == null ? "" : pArrExportacion.avance_ejecucion_transferencia + "%"));
    this.arrDetalle[contador].push((pArrExportacion.tipo_servicio == null ? "" : pArrExportacion.tipo_servicio));
    this.arrDetalle[contador].push((pArrExportacion.numero_procedimiento_seleccion == null ? "" : pArrExportacion.numero_procedimiento_seleccion));
    this.arrDetalle[contador].push("");
    if (pArrExportacion.contrato != null) {
      let numContrato = "";
      let rucProveedor = "";
      let nomProveedor = "";
      for (let y = 0; y < pArrExportacion.contrato.length; y++) {
        if (y == 0) {
          numContrato = numContrato + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].numero_contrato == null ? "" : pArrExportacion.contrato[y].numero_contrato);
          rucProveedor = rucProveedor + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].ruc_proveedor == null ? "" : pArrExportacion.contrato[y].ruc_proveedor);
          nomProveedor = nomProveedor + (pArrExportacion.contrato.length > 1 ? "\n" + (y + 1).toString() + ".- " : "") + (pArrExportacion.contrato[y].nombre_proveedor == null ? "" : pArrExportacion.contrato[y].nombre_proveedor);
        } else {
          numContrato = numContrato + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].numero_contrato == null ? "" : pArrExportacion.contrato[y].numero_contrato);
          rucProveedor = rucProveedor + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].ruc_proveedor == null ? "" : pArrExportacion.contrato[y].ruc_proveedor);
          nomProveedor = nomProveedor + "\n" + (y + 1).toString() + ".- " + (pArrExportacion.contrato[y].nombre_proveedor == null ? "" : pArrExportacion.contrato[y].nombre_proveedor);
        }
      }
      this.arrDetalle[contador].push(numContrato);
      this.arrDetalle[contador].push(rucProveedor);
      this.arrDetalle[contador].push(nomProveedor);
    } else {
      this.arrDetalle[contador].push("");
      this.arrDetalle[contador].push("");
      this.arrDetalle[contador].push("");
    }
    //Pintar Estado Situacional
    let estadoSituacional = "";
    if (pArrExportacion != null) {
      if (pArrExportacion.estado_situacional != null) {
        for (let i = 0; i < pArrExportacion.estado_situacional.length; i++) {
          if (i == 0) {
            estadoSituacional = estadoSituacional + (i + 1).toString() + ".- " + pArrExportacion.estado_situacional[i].titulo + ":" + "\n  " + pArrExportacion.estado_situacional[i].descripcion;
          } else {
            estadoSituacional = estadoSituacional + "\n\n" + (i + 1).toString() + ".- " + pArrExportacion.estado_situacional[i].titulo + ":" + "\n  " + pArrExportacion.estado_situacional[i].descripcion;
          }

        }
      }
    }
    this.arrDetalle[contador].push(estadoSituacional);
    this.arrDetalle[contador].push(pArrExportacion.estado);

    //fin
    if (contador == 0) {
      this.arrCabeceraSegundaFila.push("", "", "Tipo Procedimiento", "Numero de Procedimiento de Selección", "¿El Contrato es Exclusivo de la Inversión", "Número de Contrato", "RUC del Proveedor", "Nombre de Proveedor", "", "");

      //Tercera Fila
      this.arrCabeceraTerceraFila = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

      if (pArrExportacion != null) {
        if (arrMatrizMeses != null) {
          for (let i = 0; i < arrMatrizMeses.length; i++) {
            this.arrCabeceraTerceraFila.push(this.funciones.obtenerAbreviacionMes(arrMatrizMeses[i].Mes));
            this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
          }

          for (let y = 0; y < arrMatrizMeses.length; y++) {
            this.arrCabeceraTerceraFila.push(this.funciones.obtenerAbreviacionMes(arrMatrizMeses[y].Mes));
            this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
          }
        } else {
          this.arrCabeceraTerceraFila.push("");
          this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "0178BA" });
          this.arrCabeceraTerceraFila.push("");
          this.arrColsRowsPanTerceraFila.push({ "columna": this.arrCabeceraTerceraFila.length, "colspan": 0, "rowspan": 0, "color": "408baf" });
        }

      }


      this.arrCabeceraTerceraFila.push("", "", "", "", "", "", "", "", "", "");
    }
  }

  LimpiarControles() {
    this.beProyecto.cod_snip_texto = "";
    this.beProyecto.nombre_proyecto = "";
    if (sessionStorage.getItem("Nombre_Perfil") != "RESPONSABLE") {
      this.beProyecto.nombre_municipalidad = "";
      if (this.beProyecto.nombre_municipalidad == "") {
        this.beProyecto.id_municipalidad = 0;
      }
    }
    this.buscarMunicipalidad.setValue("");
    this.codDepa = undefined;
    this.codigo_estado = null;
    this.numIdfase = null;
    this.inicializarConsultaPrincipal(1);
    this.consultarRegiones();
  }
}
