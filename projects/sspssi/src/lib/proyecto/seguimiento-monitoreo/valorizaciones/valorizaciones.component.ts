import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccionSeguimientoMonitoreo } from '../../../../models/response/seguimiento-monitoreo-accion';
import { SeguimientoMonitoreo } from '../../../../models/response/seguimiento-monitoreo';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalRegistrarComponent } from './modal-valorizaciones/modal-registrar.component';
import { FacadeService } from '../../../../patterns/facade.service';
import { IAccionSeguimientoMonitoreo, IAccionSegMonitoreo } from '../../../../interfaces/IAccionSeguimientoMonitoreo';
import { Functions } from '../../../../appSettings/functions';
import { GaleriaComponent } from './galeria/galeria.component';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { InformacionFinancieraSigatService } from 'projects/sspssi/src/servicios/informacion-financiera-sigat.service';
import { DeductivoReduccion } from 'projects/sspssi/src/models/response/deductivo-reduccion';
import { DeductivoReduccionService } from 'projects/sspssi/src/servicios/deductivo-reduccion.service';
import { DatePipe } from '@angular/common';
import { PresupuestoAdicional } from '../../../../models/response/presupuesto-adicional';
import { PresupuestoService } from 'projects/sspssi/src/servicios/presupuesto.service';
import { AdelantoDirecto } from '../../../../models/response/adelanto-directo';
import { AdelantoMateriales } from '../../../../models/response/adelanto-materiales';
import { ContratistaService } from 'projects/sspssi/src/servicios/contratista.service';
import { Contratista } from 'projects/sspssi/src/models/response/contratista';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalValorizacionesInfobrasComponent } from './modal-valorizaciones-infobras/modal-valorizaciones-infobras.component';

@Component({
  selector: 'ssi-valorizaciones',
  templateUrl: './valorizaciones.component.html',
  styleUrls: ['./valorizaciones.component.css']
})
export class ValorizacionesComponent implements OnInit {

  nro_contrato: string = '';
  monto_contrato: number = 0;
  // bValorizacion: boolean = false;
  entidad: AccionSeguimientoMonitoreo;
  config;
  id_seguimientoMonitoreoObra: number;
  model: SeguimientoMonitoreo;
  bsModalRef: BsModalRef;
  paginaActiva: number = 0;
  paginaActual: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  totalRegistros: number;
  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";
  montoTotalFisicoReal: number;
  montoTotalFisicoProgramado: number;
  montoTotalFinancieroReal: number;
  montoTotalFinancieroProgramado: number;
  montoTotal: number;
  listAccionSeguimientoMonitoreo: IAccionSegMonitoreo[];
  totalAccionSeguimientoMonitoreo: number = 0;

  seguimientoMonitoreo;
  fecha_inicio_contractual: Date;
  fecha_termino_contractual_temporal: Date;
  guid: string = "";

  datosContrato: any = [];
  fianzasContrato: any = [];
  adelantos: any = [];
  pagosContrato: any = [];
  adicionalesContrato: any = [];
  amortizacionAdelantos: any = [];

  myForm: FormGroup;

  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;
  @Input() snip;
  @Output() ActualizarGrafico = new EventEmitter();

  mensajeContrato: string;
  mensajeCambios: string;
  mensajeRegistroContratista: string = '';
  mensajeAdicionales: string = '';
  mensajeDeductivo: string = '';
  mensajeFianzas: string = '';
  mensajeValorizaciones: string = '';
  mensajeAdelantos: string = '';
  mensajeAdelantoDirecto: string = '';

  // has_seguimientoMonitoreoObra: boolean = false;

  constructor(private modalService: BsModalService, private fs: FacadeService, private sMant: MaestraSsiService, public funciones: Functions,
    private infoSigat: InformacionFinancieraSigatService, private regDeductivo: DeductivoReduccionService, public datePipe: DatePipe, private regAdicional: PresupuestoService, private ServicioContr: ContratistaService,
    private router: Router, public fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.idSeguimientoMonitoreoObra == 0) {//set valor del seguimiento
      this.idSeguimientoMonitoreoObra = parseInt(sessionStorage.getItem("idSeguimiento"));
    }

    if (this.idSeguimientoMonitoreoObra != 0) {
      this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
      this.obtenerFechaContractual(this.idSeguimientoMonitoreoObra);
    }

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");

    //validar nro. de contrato para consulta informacion SIGAT
    let contrato = `^([0-9]{4})\-?([0-9a-zA-Z]{5})$`;
    this.myForm = this.fb.group({
      nro_contrato: ['', [Validators.required, Validators.minLength(10), Validators.pattern(contrato)]]
    });
  }

  obtenerFechaContractual(idSegMonitoreo) {
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, this.bEstado).subscribe(
      respuesta => {
        this.seguimientoMonitoreo = respuesta as any;

        if (this.seguimientoMonitoreo == '{ "data":[{}]}') {
        }
        else {
          this.model = new SeguimientoMonitoreo();
          this.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_inicio_contractual);
        }
      }
    )
  }

  openModalAccSeguimientoObra() {
    this.entidad = new AccionSeguimientoMonitoreo();
    this.entidad.id_accion_seguimiento_monitoreo_obra = 0;
    this.entidad.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        seguimientoMonitoreoAccion: this.entidad, fecha_inicio_contractual: this.model.fecha_inicio_contractual
      },
      class: "modal-standar-md"
    };

    this.bsModalRef = this.modalService.show(ModalRegistrarComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.ActualizarGrafico.emit();
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria("Valorizaciones");
      }
    )
  }

  openModalInfoObras() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        snip: this.snip
      },
      class: "modal-standar-md"
    };
    this.bsModalRef = this.modalService.show(ModalValorizacionesInfobrasComponent, this.config);
  }

  listarAccionSeguimientoMonitoreoObra(id: number, skip: number, take: number) {

    this.fs.valorizacionService.listarValorizaciones(id, skip, take).subscribe(
      (respuesta: IAccionSeguimientoMonitoreo) => {

        //respuesta.accion_seguimiento.sort(this.ordernarFecha);

        let cantidad = respuesta.cantidad_registro - (this.paginaActiva * 5);

        respuesta.accion_seguimiento.map(
          (item) => {
            item.indice = cantidad;
            cantidad = cantidad - 1;
          }
        )
        this.setearMontosValorizaciones(respuesta);
      }
    )
  };

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == "InformacionObra") {
          this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
        } else if (pNombreTipoAuditoria == "Valorizaciones") {
          this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
        } else if (pNombreTipoAuditoria == "Paralizacion") {
          //this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
        }
      }
    );
  }

  private setearMontosValorizaciones(respuesta: IAccionSeguimientoMonitoreo) {

    this.montoTotalFisicoReal = 0;
    this.montoTotalFisicoProgramado = 0;
    this.montoTotalFinancieroReal = 0;
    this.montoTotalFinancieroProgramado = 0;
    this.montoTotal = 0;
    if (respuesta.cantidad_registro == 0) {
      this.listAccionSeguimientoMonitoreo = [];
    }
    else {
      this.totalAccionSeguimientoMonitoreo = respuesta.cantidad_registro;
      this.listAccionSeguimientoMonitoreo = respuesta.accion_seguimiento;
      this.listAccionSeguimientoMonitoreo.forEach(element => {
        element.fecha_valorizacion = this.funciones.formatDate(element.fecha_valorizacion);
      });
      if (respuesta.total_accion_seguimiento != null) {
        this.montoTotalFisicoReal = respuesta.total_accion_seguimiento.avance_fisico_real;
        this.montoTotalFisicoProgramado = respuesta.total_accion_seguimiento.avance_fisico_programado;
        this.montoTotalFinancieroReal = respuesta.total_accion_seguimiento.avance_financiero_real;
        this.montoTotalFinancieroProgramado = respuesta.total_accion_seguimiento.avance_financiero_programado;
        this.montoTotal = respuesta.total_accion_seguimiento.monto;
      }
    }
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

  verImagenesValorizacion(row) {
    let lista_archivos = row.lista_archivos;
    this.config = {
      ignoreBackdropClick: false,
      keyboard: false,
      initialState: {
        listaImagenes: lista_archivos
      }
    };

    this.bsModalRef = this.modalService.show(GaleriaComponent, this.config);
  }

  editarAccionSeguimientoObra(model: IAccionSegMonitoreo) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        seguimientoMonitoreoAccion: model
      }
    };

    this.bsModalRef = this.modalService.show(ModalRegistrarComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.ActualizarGrafico.emit();
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria("Valorizaciones");
      }
    )
  }

  eliminarAccionSeguimientoMonitoreo(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");

    let strData = { id_accion_seguimiento_monitoreo_obra: model.id_accion_seguimiento_monitoreo_obra, usuario_eliminacion: model.usuario_eliminacion }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Avance de Obra?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.valorizacionService.eliminarValorizacion(strData).subscribe(
          () => {
            this.ActualizarGrafico.emit();
            this.listarAccionSeguimientoMonitoreoObra(model.id_seguimiento_monitoreo_obra, this.num_filas, this.numero_Pagina);
            this.consultaAuditoria("Valorizaciones");
          }
        );
      }
    });
  }

  cambiarPaginaAccionSeguimiento(pagina) {
    this.paginaActiva = pagina.page - 1;
    this.paginaActual = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActual;

    this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  obtenerInformacionSigat(nroContrato: any) {
    this.infoSigat.obtenerInformacionFinanciera(nroContrato).subscribe(
      data => {
        if (data != null) {
          this.datosContrato = data.Contrato[0];
          this.mensajeContrato = 'Consulta completa \n';
          this.mensajeCambios = '';

          if (this.datosContrato == null) {
            this.funciones.alertaSimple("info", "No se tiene informacion \n verifique Nro. de Contrato", "", true);
          } else {
            if (this.datosContrato.tipo_contrato.trim() == "Obras") {
              this.adicionalesContrato = data.Adicionales[0];
              this.fianzasContrato = data.Fianzas[0];
              this.amortizacionAdelantos = data.Amortizacion_adelantos[0];
              this.adelantos = data.Amortizacion_adelantos[0];
              this.pagosContrato = data.Pagos_efectuados[0];
              this.monto_contrato = this.datosContrato.n_total_sol;

              this.registrarContratista();
              this.mensajeCambios += this.mensajeRegistroContratista;

              if (this.adicionalesContrato == null) {
                this.mensajeContrato = "No se efectuaron adicionales ni deductivos \n";
                //this.funciones.alertaSimpleTimer("info", "No se han efectuado adicionales ni deductivos", "", true);
              } else {
                this.registrarAdicionalesDeductivos();
                this.mensajeCambios += this.mensajeAdicionales;
                this.mensajeCambios += this.mensajeDeductivo;
              }

              if (this.pagosContrato == null) {
                this.mensajeContrato += "No se han efectuado pagos de valorizaciones \n";
                //this.funciones.alertaSimpleTimer("info", "No se han efectuado pagos de valorizaciones", "", true);
              } else {
                this.registrarValorizaciones();
                this.mensajeCambios += this.mensajeValorizaciones;
              }

              if (this.fianzasContrato == null) {
                this.mensajeContrato += "No se han efectuado entrega de adelantos \n";
                //this.funciones.alertaSimpleTimer("info", "No se han efectuado adelantos", "", true);
              } else {
                this.registrarAdelantos();
                this.mensajeCambios += this.mensajeAdelantoDirecto;
                this.mensajeCambios += this.mensajeAdelantos;
              }
              /* this.funciones.alertaSimple("info", this.mensajeContrato, "", true);
              this.funciones.alertaSimple("success", this.mensajeCambios, "", true); */
              if (this.mensajeContrato != "") {
                this.funciones.alertaRetorno("info", this.mensajeContrato, "", true, (respuesta) => {
                  if (respuesta.value) {
                    this.router.navigate(['/ssi/monitoreo']);
                  }
                });
              }
              if (this.mensajeCambios != "") {
                this.funciones.alertaRetorno("success", this.mensajeCambios, "", true, (respuesta) => {
                  if (respuesta.value) {
                    this.router.navigate(['/ssi/monitoreo']);
                  }
                });
              }
            } else {
              this.funciones.alertaSimple("info", "El contrato no corresponde a una obra\nVerifique Nro. de Contrato", "", true);
            }
          }
        }
      }
    );
  }

  registrarAdelantos() {
    let adeDirecto = 0;
    let adeMateriales = 0;
    let adeDirectoTemp: any = [];
    let adeMaterialesTemp: any = [];

    this.fianzasContrato.forEach(element => {
      if (element.tipo == "A/M") {
        adeMateriales++;
        adeMaterialesTemp.push(element);
      } else if (element.tipo == "A/E" || element.tipo == "ADE") {
        adeDirecto++;
        adeDirectoTemp.push(element);
      }
    });

    this.fs.seguimientoMonitoreoService.listarAdelantoMateriales(this.idSeguimientoMonitoreoObra, 20, this.numero_Pagina).subscribe(
      data => {
        let cantidad = data.cantidad_registro;
        let adeMaterialesRegistro = data.adelanto_materiales;
        if (cantidad <= 0) {
          this.fianzasContrato.forEach(element => {
            if (element.tipo == "A/M") {
              let modelAdelantoMateriales: AdelantoMateriales = new AdelantoMateriales();

              modelAdelantoMateriales.id_adelanto_materiales = 0;
              modelAdelantoMateriales.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdelantoMateriales.nombre_adelanto_materiales = element.descri.trim();
              modelAdelantoMateriales.fecha_inicio = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision_bco));
              modelAdelantoMateriales.fecha_termino = this.funciones.formatFullDateIso(this.fechaString(element.d_fecvcmto));
              modelAdelantoMateriales.monto_garantia = element.monto_cf;
              modelAdelantoMateriales.monto_adelanto = element.monto_cf;
              modelAdelantoMateriales.entidad_financiera = element.banco.trim();
              modelAdelantoMateriales.usuario_creacion = sessionStorage.getItem('Usuario');
              modelAdelantoMateriales.usuario_modificacion = sessionStorage.getItem('Usuario');

              this.fs.seguimientoMonitoreoService.registrarAdelantoMaterial(modelAdelantoMateriales).subscribe(
                respuesta => {
                  if (respuesta > 0) { }
                }
              );
            }
          });
          this.mensajeAdelantos = "Se registro Adelanto(s) de materiales \n";
        } else if (cantidad == adeMateriales) {
          this.mensajeAdelantos = "Registro de adelanto(s) de materiales actualizado \n";
        } else if (cantidad < adeMateriales) {
          //actualizar registros
          let i, j: number;

          for (i = 0; i < adeMaterialesTemp.length; i++) {
            for (j = 0; j < adeMaterialesRegistro.length; j++) {
              if (adeMaterialesTemp[i].banco.trim() == adeMaterialesRegistro[j].entidad_financiera && adeMaterialesTemp[i].monto_cf == adeMaterialesRegistro[j].monto_garantia) {
                delete adeMaterialesTemp[i];
                break;
              }
            }
          }

          adeMaterialesTemp.forEach(element => {
            if (element != null) {
              let modelAdelantoMateriales: AdelantoMateriales = new AdelantoMateriales();

              modelAdelantoMateriales.id_adelanto_materiales = 0;
              modelAdelantoMateriales.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdelantoMateriales.nombre_adelanto_materiales = element.descri.trim();
              modelAdelantoMateriales.fecha_inicio = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision_bco));
              modelAdelantoMateriales.fecha_termino = this.funciones.formatFullDateIso(this.fechaString(element.d_fecvcmto));
              modelAdelantoMateriales.monto_garantia = element.monto_cf;
              modelAdelantoMateriales.monto_adelanto = element.monto_cf;
              modelAdelantoMateriales.entidad_financiera = element.banco.trim();
              modelAdelantoMateriales.usuario_creacion = sessionStorage.getItem('Usuario');
              modelAdelantoMateriales.usuario_modificacion = sessionStorage.getItem('Usuario');

              this.fs.seguimientoMonitoreoService.registrarAdelantoMaterial(modelAdelantoMateriales).subscribe(
                respuesta => {
                  if (respuesta > 0) { }
                }
              );
            }
          });
          this.mensajeAdelantos = "Se actualizo el registro de adelanto(s) de Materiales \n";
        }
      }
    );

    this.fs.seguimientoMonitoreoService.listarAdelantoDirecto(this.idSeguimientoMonitoreoObra).subscribe(
      data => {
        let adeDirectoRegistrado: any = data;
        let cantidad = adeDirectoRegistrado.length;

        if (cantidad == 0 || jQuery.isEmptyObject(adeDirectoRegistrado[0])) {
          this.fianzasContrato.forEach(element => {
            if (element.tipo == "A/E" || element.tipo == "ADE") {
              let modelAdelantoDirecto: AdelantoDirecto = new AdelantoDirecto();

              modelAdelantoDirecto.id_adelanto_directo = 0;
              modelAdelantoDirecto.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdelantoDirecto.nombre_adelanto_directo = element.descri.trim();
              modelAdelantoDirecto.fecha_inicio = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision_bco));
              modelAdelantoDirecto.fecha_termino = this.funciones.formatFullDateIso(this.fechaString(element.d_fecvcmto));
              modelAdelantoDirecto.monto_garantia = element.monto_cf;
              modelAdelantoDirecto.monto_adelanto = element.monto_cf;
              modelAdelantoDirecto.entidad_financiera = element.banco.trim();
              modelAdelantoDirecto.usuario_creacion = sessionStorage.getItem('Usuario');
              modelAdelantoDirecto.usuario_modificacion = sessionStorage.getItem('Usuario');

              this.fs.seguimientoMonitoreoService.registrarAdelantoDirecto(modelAdelantoDirecto).subscribe(
                respuesta => {
                  if (respuesta > 0) { }
                }
              );
            }
          });
          this.mensajeAdelantoDirecto = "Se registro adelanto directo \n";
        } else if (cantidad == adeDirecto) {

          this.mensajeAdelantoDirecto = "Registro de adelanto directo actualizado \n";

        } else if (cantidad < adeDirecto) {
          //actualizacion de registros
          let i, j: number;

          for (i = 0; i < adeDirectoTemp.length; i++) {
            for (j = 0; j < adeDirectoRegistrado.length; j++) {
              if (adeDirectoTemp[i].banco.trim() == adeDirectoRegistrado[j].entidad_financiera && adeDirectoTemp[i].monto_cf == adeDirectoRegistrado[j].monto_garantia) {
                delete adeDirectoTemp[i];
                break;
              }
            }
          }

          adeDirectoTemp.forEach(element => {
            if (element != null) {
              let modelAdelantoDirecto: AdelantoDirecto = new AdelantoDirecto();

              modelAdelantoDirecto.id_adelanto_directo = 0;
              modelAdelantoDirecto.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdelantoDirecto.nombre_adelanto_directo = element.descri.trim();
              modelAdelantoDirecto.fecha_inicio = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision_bco));
              modelAdelantoDirecto.fecha_termino = this.funciones.formatFullDateIso(this.fechaString(element.d_fecvcmto));
              modelAdelantoDirecto.monto_garantia = element.monto_cf;
              modelAdelantoDirecto.monto_adelanto = element.monto_cf;
              modelAdelantoDirecto.entidad_financiera = element.banco.trim();
              modelAdelantoDirecto.usuario_creacion = sessionStorage.getItem('Usuario');
              modelAdelantoDirecto.usuario_modificacion = sessionStorage.getItem('Usuario');

              this.fs.seguimientoMonitoreoService.registrarAdelantoDirecto(modelAdelantoDirecto).subscribe(
                respuesta => {
                  if (respuesta > 0) { }
                }
              );
            }
          });
          this.mensajeAdelantoDirecto = "Se actualizo el registro de adelanto directo \n";
        }
      }
    );
  }

  registrarAdicionalesDeductivos() {
    let nro_adicionales: number = 0;
    let adicionalesTmp: any = [];
    let deductivosTmp: any = [];
    let nro_deductivos: number = 0;

    //contar los adicionales y deductivos que existen en el SIGAT
    this.adicionalesContrato.forEach(element => {
      switch (element.tipo) {
        case "Adicional": {
          adicionalesTmp.push(element);
          nro_adicionales++; break;
        }
        case "Deductivo": {
          deductivosTmp.push(element);
          nro_deductivos++; break;
        }
      }
    });

    //verificar cantidad de adicionales existentes
    this.regAdicional.listar(this.idSeguimientoMonitoreoObra, 20, this.numero_Pagina).subscribe(
      respuesta => {
        let dataReturn = respuesta;
        let cantidad: number = dataReturn.cantidad_registro;
        let adicionalesRegistro = dataReturn.presupuesto_adicional;

        if (cantidad <= 0) {
          this.adicionalesContrato.forEach(element => {
            if (String(element.tipo).toUpperCase() == "ADICIONAL") {
              let modelAdicional = new PresupuestoAdicional();

              let incidenciaDeductivo = ((element.n_total_sol / this.monto_contrato) * 100).toFixed(2);

              modelAdicional.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdicional.monto_presupuesto = element.n_total_sol;
              modelAdicional.resolucion_aprobacion = element.c_numresolucion.trim();
              modelAdicional.resolucion_fecha = this.funciones.formatFullDateIso(this.fechaString(element.d_fecresolucion));
              modelAdicional.incidencia = parseFloat(incidenciaDeductivo);
              modelAdicional.concepto = "Adicional " + element.c_correlativo;
              modelAdicional.adiciona_plazo = false;
              modelAdicional.activo = true;
              modelAdicional.nombre_archivo = '';
              modelAdicional.observacion = '';
              modelAdicional.usuario_creacion = sessionStorage.getItem("Usuario");
              modelAdicional.usuario_modificacion = '';
              modelAdicional.usuario_eliminacion = '';

              this.regAdicional.grabar(modelAdicional).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
            }
          });
          this.mensajeAdicionales = "Se registro Adicional(es) \n";
        } else if (cantidad == nro_adicionales) {
          this.mensajeAdicionales = "Registro de adicional(es) actualizado \n";
        } else if (cantidad < nro_adicionales) {
          //actualizar informacion
          let i, j: number;

          for (i = 0; i < adicionalesTmp.length; i++) {
            for (j = 0; j < adicionalesRegistro.length; j++) {
              if (adicionalesTmp[i].n_total_sol == adicionalesRegistro[j].monto_presupuesto && adicionalesTmp[i].c_numresolucion.trim() == adicionalesRegistro[j].resolucion_aprobacion) {
                delete adicionalesTmp[i];
                break;
              }
            }
          }

          adicionalesTmp.forEach(element => {
            if (element != null) {
              let modelAdicional = new PresupuestoAdicional();

              let incidenciaDeductivo = ((element.n_total_sol / this.monto_contrato) * 100).toFixed(2);

              modelAdicional.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelAdicional.monto_presupuesto = element.n_total_sol;
              modelAdicional.resolucion_aprobacion = element.c_numresolucion.trim();
              modelAdicional.resolucion_fecha = this.funciones.formatFullDateIso(this.fechaString(element.d_fecresolucion));
              modelAdicional.incidencia = parseFloat(incidenciaDeductivo);
              modelAdicional.concepto = "Adicional " + element.c_correlativo;
              modelAdicional.adiciona_plazo = false;
              modelAdicional.activo = true;
              modelAdicional.nombre_archivo = '';
              modelAdicional.observacion = '';
              modelAdicional.usuario_creacion = sessionStorage.getItem("Usuario");
              modelAdicional.usuario_modificacion = '';
              modelAdicional.usuario_eliminacion = '';

              this.regAdicional.grabar(modelAdicional).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
            }
          });
          this.mensajeAdicionales = "Se actualizo el registro de Adicional(es) \n";
        }
      }
    );

    //validar cantidad de deductivos
    this.regDeductivo.listarDeductivoReduccion(this.idSeguimientoMonitoreoObra, 20, this.numero_Pagina).subscribe(
      respuesta => {
        let dataReturn = respuesta;
        let cantidad: number = dataReturn.cantidad_registro;
        let deductivoRegistro = dataReturn.deductivo_reduccion;

        if (cantidad <= 0) {
          this.adicionalesContrato.forEach(element => {
            if (String(element.tipo).toUpperCase() == "DEDUCTIVO") {
              let modelDeductivo = new DeductivoReduccion();

              let incidenciaDeductivo = ((element.n_total_sol / this.monto_contrato) * 100).toFixed(2);

              modelDeductivo.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelDeductivo.monto_presupuesto = element.n_total_sol;
              modelDeductivo.resolucion_aprobacion = element.c_numresolucion.trim();
              modelDeductivo.resolucion_fecha = this.funciones.formatFullDateIso(this.fechaString(element.d_fecresolucion));
              modelDeductivo.incidencia = parseFloat(incidenciaDeductivo);
              modelDeductivo.concepto = "Deductivo " + element.c_correlativo;
              modelDeductivo.nombre_archivo = '';
              modelDeductivo.observacion = '';
              modelDeductivo.usuario_creacion = sessionStorage.getItem("Usuario");
              modelDeductivo.usuario_modificacion = '';
              modelDeductivo.usuario_eliminacion = '';

              this.regDeductivo.registrarDeductivoReduccion(modelDeductivo).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
              this.mensajeDeductivo = "Se registro Deductivo(s) \n";
            }
          });
        }
        else if (cantidad == nro_deductivos) {
          this.mensajeDeductivo = "Registro de deductivo(s) actualizado \n";

        } else if (cantidad < nro_deductivos) {
          //actualizar informacion de deductivos
          let i, j: number;

          for (i = 0; i < deductivosTmp.length; i++) {
            for (j = 0; j < deductivoRegistro.length; j++) {
              if (deductivosTmp[i].n_total_sol == deductivoRegistro[j].monto_presupuesto && deductivosTmp[i].c_numresolucion.trim() == deductivoRegistro[j].resolucion_aprobacion) {
                delete deductivosTmp[i];
                break;
              }
            }
          }

          deductivosTmp.forEach(element => {
            if (element != null) {
              let modelDeductivo = new DeductivoReduccion();

              let incidenciaDeductivo = ((element.n_total_sol / this.monto_contrato) * 100).toFixed(2);

              modelDeductivo.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelDeductivo.monto_presupuesto = element.n_total_sol;
              modelDeductivo.resolucion_aprobacion = element.c_numresolucion;
              modelDeductivo.resolucion_fecha = this.funciones.formatFullDateIso(this.fechaString(element.d_fecresolucion));
              modelDeductivo.incidencia = parseFloat(incidenciaDeductivo);
              modelDeductivo.concepto = "Deductivo " + element.c_correlativo;
              modelDeductivo.nombre_archivo = '';
              modelDeductivo.observacion = '';
              modelDeductivo.usuario_creacion = sessionStorage.getItem("Usuario");
              modelDeductivo.usuario_modificacion = '';
              modelDeductivo.usuario_eliminacion = '';

              this.regDeductivo.registrarDeductivoReduccion(modelDeductivo).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
            }
          });
          this.mensajeDeductivo = "Se actualizo el registro de Deductivo(s) \n"
        }
      }
    );
  }

  registrarValorizaciones() {
    this.fs.valorizacionService.listarValorizaciones(this.idSeguimientoMonitoreoObra, 60, this.numero_Pagina).subscribe(
      respuesta => {
        let dataReturn = respuesta;
        let cantidad = dataReturn.cantidad_registro;
        let valorizacionRegistro = dataReturn.accion_seguimiento;

        let cantidadValSigat = 0;
        let valorizacionSigat: any = [];

        this.pagosContrato.forEach(element => {
          if (element.GIRO <= 0 && (element.c_coddoc_comp == 353 || element.c_coddoc_comp == 354)) {
            cantidadValSigat++;
            valorizacionSigat.push(element);
          }
        });

        if (cantidad <= 0) {
          this.pagosContrato.forEach(element => {
            if (element.tipo == "VAL" && element.GIRO <= 0) {

              let modelValorizacion = new AccionSeguimientoMonitoreo();

              //let valBruta: number = parseFloat((element.VALBRUTA * 1.18).toFixed(2));
              let valBruta: number = element.VALBRUTA * 1.18;

              let avanceFisico: number = parseFloat(((valBruta / this.monto_contrato) * 100).toFixed(2));
              let mes, anio;

              if ((String(element.mes)).length == 1) {
                mes = 0 + String(element.mes).toString();
              } else {
                mes = String(element.mes).toString();
              };
              anio = String(element.anno).toString();

              modelValorizacion.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelValorizacion.id_estado_situacional = 1;
              modelValorizacion.avance_financiero_real = element.NETOPAGAR;
              modelValorizacion.avance_financiero_programado = this.funciones.castToFloat(valBruta);
              modelValorizacion.avance_fisico_programado = element.n_porcen_avan_fisico;
              modelValorizacion.avance_fisico_real = avanceFisico;
              modelValorizacion.fecha_valorizacion = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision));
              modelValorizacion.nombre_archivo = '';
              modelValorizacion.fuente_financiamiento = element.c_codent_fin.trim();
              modelValorizacion.observacion = '';
              modelValorizacion.periodo = anio + mes;
              modelValorizacion.monto = 0;
              modelValorizacion.usuario_creacion = sessionStorage.getItem("Usuario");
              modelValorizacion.usuario_modificacion = '';
              modelValorizacion.usuario_eliminacion = '';

              this.fs.valorizacionService.registrarValorizacionConArchivos(modelValorizacion).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
            } else if (element.tipo == "ADI" && element.GIRO <= 0) {

              let modelValorizacion = new AccionSeguimientoMonitoreo();

              let valBruta: number = element.VALBRUTA * 1.18;

              let avanceFisico: number = parseFloat(((valBruta / this.monto_contrato) * 100).toFixed(2));
              let mes, anio;
              if ((String(element.mes)).length == 1) {
                mes = 0 + String(element.mes).toString();
              } else {
                mes = String(element.mes).toString();
              };
              anio = String(element.anno).toString();

              modelValorizacion.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
              modelValorizacion.id_estado_situacional = 2;
              modelValorizacion.avance_financiero_real = element.NETOPAGAR;
              modelValorizacion.avance_financiero_programado = this.funciones.castToFloat(valBruta);
              modelValorizacion.avance_fisico_programado = element.n_porcen_avan_fisico;
              modelValorizacion.avance_fisico_real = avanceFisico;
              modelValorizacion.fecha_valorizacion = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision));
              modelValorizacion.nombre_archivo = '';
              modelValorizacion.observacion = '';
              modelValorizacion.fuente_financiamiento = element.c_codent_fin.trim();
              modelValorizacion.periodo = anio + mes;
              modelValorizacion.monto = 0;
              modelValorizacion.usuario_creacion = sessionStorage.getItem("Usuario");
              modelValorizacion.usuario_modificacion = '';
              modelValorizacion.usuario_eliminacion = '';

              this.fs.valorizacionService.registrarValorizacionConArchivos(modelValorizacion).subscribe(
                respuesta => {
                  if (respuesta > 0) {
                  }
                }
              );
            }
          });
          this.mensajeValorizaciones = "Se registraron valorizaciones \n";

        } else if (cantidad == cantidadValSigat) {
          this.mensajeValorizaciones = "Registro de valorizaciones actualizado \n";
        } else if (cantidad < cantidadValSigat) {
          //actualizar informacion de deductivos
          let i, j: number;

          for (i = 0; i < valorizacionSigat.length; i++) {
            let fechaValSigat = new Date(this.funciones.formatFullDateIso(this.fechaString(valorizacionSigat[i].d_fecemision)));
            fechaValSigat.setHours(0, 0, 0, 0);
            for (j = 0; j < valorizacionRegistro.length; j++) {
              let fechaValRegistro = new Date(this.funciones.formatFullDateIso(valorizacionRegistro[j].fecha_valorizacion));
              fechaValRegistro.setHours(0, 0, 0, 0);

              if (valorizacionSigat[i].NETOPAGAR == valorizacionRegistro[j].avance_financiero_real && fechaValSigat.getTime() == fechaValRegistro.getTime()) {
                delete valorizacionSigat[i];
                break;
              }
            }
          }

          valorizacionSigat.forEach(element => {
            if (element != null) {
              if (element.tipo == "VAL" && element.GIRO <= 0) {

                let modelValorizacion = new AccionSeguimientoMonitoreo();

                //let valBruta: number = parseFloat((element.VALBRUTA * 1.18).toFixed(2));
                let valBruta: number = element.VALBRUTA * 1.18;

                let avanceFisico: number = parseFloat(((valBruta / this.monto_contrato) * 100).toFixed(2));
                let mes, anio;

                if ((String(element.mes)).length == 1) {
                  mes = 0 + String(element.mes).toString();
                } else {
                  mes = String(element.mes).toString();
                };
                anio = String(element.anno).toString();

                modelValorizacion.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
                modelValorizacion.id_estado_situacional = 1;
                modelValorizacion.avance_financiero_real = element.NETOPAGAR;
                modelValorizacion.avance_financiero_programado = this.funciones.castToFloat(valBruta);
                modelValorizacion.avance_fisico_programado = element.n_porcen_avan_fisico;
                modelValorizacion.avance_fisico_real = avanceFisico;
                modelValorizacion.fecha_valorizacion = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision));
                modelValorizacion.nombre_archivo = '';
                modelValorizacion.fuente_financiamiento = element.c_codent_fin.trim();
                modelValorizacion.observacion = '';
                modelValorizacion.periodo = anio + mes;
                modelValorizacion.monto = 0;
                modelValorizacion.usuario_creacion = sessionStorage.getItem("Usuario");
                modelValorizacion.usuario_modificacion = '';
                modelValorizacion.usuario_eliminacion = '';

                this.fs.valorizacionService.registrarValorizacionConArchivos(modelValorizacion).subscribe(
                  respuesta => {
                    if (respuesta > 0) {
                    }
                  }
                );
              } else if (element.tipo == "ADI" && element.GIRO <= 0) {

                let modelValorizacion = new AccionSeguimientoMonitoreo();

                let valBruta: number = element.VALBRUTA * 1.18;

                let avanceFisico: number = parseFloat(((valBruta / this.monto_contrato) * 100).toFixed(2));
                let mes, anio;
                if ((String(element.mes)).length == 1) {
                  mes = 0 + String(element.mes).toString();
                } else {
                  mes = String(element.mes).toString();
                };
                anio = String(element.anno).toString();

                modelValorizacion.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
                modelValorizacion.id_estado_situacional = 2;
                modelValorizacion.avance_financiero_real = element.NETOPAGAR;
                modelValorizacion.avance_financiero_programado = this.funciones.castToFloat(valBruta);
                modelValorizacion.avance_fisico_programado = element.n_porcen_avan_fisico;
                modelValorizacion.avance_fisico_real = avanceFisico;
                modelValorizacion.fecha_valorizacion = this.funciones.formatFullDateIso(this.fechaString(element.d_fecemision));
                modelValorizacion.nombre_archivo = '';
                modelValorizacion.observacion = '';
                modelValorizacion.fuente_financiamiento = element.c_codent_fin.trim();
                modelValorizacion.periodo = anio + mes;
                modelValorizacion.monto = 0;
                modelValorizacion.usuario_creacion = sessionStorage.getItem("Usuario");
                modelValorizacion.usuario_modificacion = '';
                modelValorizacion.usuario_eliminacion = '';

                this.fs.valorizacionService.registrarValorizacionConArchivos(modelValorizacion).subscribe(
                  respuesta => {
                    if (respuesta > 0) {
                    }
                  }
                );
              }
            }
          });
          this.mensajeValorizaciones = "Se actualizo el registro de valorizaciones \n";
        }
      });
  }

  fechaString(fecha: String): String {
    let dd = fecha.substring(0, 2);
    let mm = fecha.substring(3, 5);
    let yyyy = fecha.substring(6, 10);
    return fecha = mm + '-' + dd + '-' + yyyy;
  }

  registrarContratista() {
    let beResultados;
    let ListDetalleContratista = [];
    let contratistaRegistrar: Contratista;

    //registrar Contratista Contratado
    this.ServicioContr.listarContratista(this.idSeguimientoMonitoreoObra, 5, 0).subscribe(
      data => {
        let respuesta = data as any;
        let cantidad = respuesta[0].cantidad;
        if (cantidad == 0) {
          beResultados = respuesta as any;
          let miembros = beResultados[0].miembros as any;
          let consorcio = beResultados[0].consorcio;

          contratistaRegistrar = new Contratista();
          contratistaRegistrar.id_contratista_seguimiento_obra = 0;
          contratistaRegistrar.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
          contratistaRegistrar.ruc = this.datosContrato.ruc;
          contratistaRegistrar.razon_social = this.datosContrato.proveedor.trim();
          contratistaRegistrar.apellido_representante_legal = "";
          contratistaRegistrar.nombre_representante_legal = "";
          contratistaRegistrar.dni_representante_legal = "";
          contratistaRegistrar.telefono = "";
          contratistaRegistrar.email = "";
          contratistaRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");

          if (consorcio == "S") {
            miembros.forEach(element => {
              contratistaRegistrar.tipo_contratista = true;
              ListDetalleContratista.push({
                id_detalle_contratista_seguimiento_obra: 0,
                id_contratista_seguimiento_obra: 0,
                ruc_detalle: element.ruc_miembro_consorcio,
                razon_social_detalle: element.nombre_miembro_consorcio.trim(),
                usuario_creacion: sessionStorage.getItem("Usuario"),
                activo: true,
                nombre_porcentaje_participacion: element.porcentaje_participacion,
              });
            });
            contratistaRegistrar.ListDetalleContratista = ListDetalleContratista;
          } else {
            contratistaRegistrar.tipo_contratista = false;
            contratistaRegistrar.ListDetalleContratista = [];
          }
          //registrar Contratista
          let registro = JSON.stringify(contratistaRegistrar);

          this.ServicioContr.registrarContratista(registro).subscribe(
            respuesta => {
              if (respuesta > 0) {
              }
            }
          );
          this.mensajeRegistroContratista = "Se efectuo el registro de Contratista \n";
        } else {
          this.mensajeRegistroContratista = "Registro de Contratista actualizado \n";
        }
      }
    );
  }
}