import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { SeguimientoMonitoreo, _SeguimientoMonitoreo, Fase } from '../../../models/response/seguimiento-monitoreo';
import { Functions, TipoFase } from '../../../appSettings';
import { FacadeService } from '../../../patterns/facade.service';
import { MaestraService } from '../../../services/maestra.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AmpliacionModalComponent } from '../../ampliacion-modal/ampliacion-modal.component';
import { ModalAdelantoDirectoComponent } from '../modal-adelanto-directo/modal-adelanto-directo.component';
import { ModalAdelantoMaterialesComponent } from '../modal-adelanto-materiales/modal-adelanto-materiales.component';
import { MenuTabsComponent } from '../../menu-tabs/menu-tabs.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informacion-obra',
  templateUrl: './informacion-obra.component.html',
  styleUrls: ['./informacion-obra.component.css']
})
export class InformacionObraComponent implements OnInit {

  model: SeguimientoMonitoreo;
  divSegMonitoreo = false;
  @Input() idFase: number;
  @Input() idTramo: number;
  @Input() idSeguimientoMonitoreoObra: number;
  @Output() eventInformacionObra = new EventEmitter();
  bTramo: boolean = false;
  bMostrar: boolean = false;
  seguimientoMonitoreo;
  fecha_inicio_contractual: Date;
  fecha_termino_contractual_temporal: Date;
  guid: string = ""
  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";
  config;
  bsModalRef: BsModalRef;
  @Input() bEstado: boolean;
  @Input() bEstadoHistorial: boolean;



  vFechaInicioMostrar: string = "";
  estadoSuspensionPrimero;
  visibleSinSeguimiento: boolean = false;
  fecha_inicio_contractual_parametro: string = "";
  estadoSuspensionPrimeroParametro: string = "";

  showGuardar: boolean = false;
  //constructor(public funciones: Functions, private fs: FacadeService, private sMant: MaestraService, private modalService: BsModalService, private menuTabs: MenuTabsComponent) { 
  constructor(public funciones: Functions, private fs: FacadeService, private sMant: MaestraService, private modalService: BsModalService, private injector: Injector,
    private router: Router, private ActivatedRoute_: ActivatedRoute) {
    this.model = new SeguimientoMonitoreo();
  }

  ngOnInit() {
    //Id_Perfil=5;
    if (sessionStorage.getItem("Id_Perfil") == "5" && this.ActivatedRoute_.snapshot.params.idSeguimientoMonitoreo != "0") {
      this.showGuardar = false
    }
    else {
      this.showGuardar = true;
    }

    // this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado).subscribe(
    //   respuesta => {
    //     this.model = new SeguimientoMonitoreo();

    //     if (respuesta != "{ \"data\":[{}]}") {
    //       if(respuesta[0].fecha_inicio_contractual!=null){
    //         this.fecha_inicio_validacion=true;
    //       }else{
    //         this.fecha_inicio_validacion=false;
    //       }
    //     }
    //   });



    // this.estadoSuspensionPrimero= sessionStorage.getItem("esSuspension");
    // if(this.estadoSuspensionPrimero=="false"){
    //   this.visibleSinSeguimiento=true;
    // }else{
    //   this.visibleSinSeguimiento=false;
    // }

    this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
    this.estadoSuspensionPrimeroParametro = sessionStorage.getItem("esSuspension");

    if ((this.idFase === 0 && this.idSeguimientoMonitoreoObra === 0)) {
      this.bTramo = true;
    } else {
      this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado);
      this.bTramo = false;

    }

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
  }

  _menuTabs: MenuTabsComponent
  public get getMenuTabsComponents(): MenuTabsComponent {
    this._menuTabs = this.injector.get(MenuTabsComponent);
    return this._menuTabs;
  }

  modificarSegMonitoreo(model) {
    this.model.fecha_termino = null;
    this.model.fecha_termino_contractual = null;
    this.model.id_fase = this.idFase;
    if (this.divSegMonitoreo) {
      // if (sessionStorage.getItem("esSuspension")=="false" && this.idSeguimientoMonitoreoObra!=0) {
      //actualizar
      this.funciones.alertaRetorno("question", "<strong>¿Está seguro de actualizar el registro?</strong>",
        "<div style='color:#E53935;font-weight:400;'>¡Importante!<br>Se eliminarán las Ampliaciones, Monto Directo, " +
        "Monto Materiales, Cronograma y Valorizaciones relacionadas a esta obra.</div>",
        true, (respuesta) => {
          if (respuesta.value) {
            this.bMostrar = true;
            this.model.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
            this.model.id_seguimiento = this.idSeguimientoMonitoreoObra;
            this.model.modifica = false;
            this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
            this.fs.seguimientoMonitoreoService.actualizarSeguimientoMonitoreo(this.model).subscribe(
              // (respuesta: any) => {
              //  if (respuesta.id_seguimiento > 0) {
              respuesta => {
                if (respuesta > 0) {
                  this.router.navigate(['/monitoreo']);
                } else {
                  this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
                }
                this.bMostrar = true;
              }
            );
          }
        });
    }
    else {
      //insertar
      if (this.idSeguimientoMonitoreoObra > 0) {
        this.bMostrar = true;
        this.model.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
        this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
        this.fs.seguimientoMonitoreoService.actualizarSeguimientoMonitoreo(this.model).subscribe(
          /* (respuesta: any) => {
            if (respuesta.id_seguimiento > 0) { */
          respuesta => {
            if (respuesta > 0) {
              sessionStorage.setItem("fecha_inicio_obra", JSON.stringify(this.model.fecha_inicio_contractual));
              this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
              this.divSegMonitoreo = true;
              this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado);
              this.eventoInformacionObra(this.idSeguimientoMonitoreoObra);
              this.consultaAuditoria("InformacionObra");
              this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
              this.bMostrar = false;
              this.funciones.mensaje("success", "Se registro satisfactoriamente el inicio de obra.");
            } else {
              this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
            }

          }
        );
      } else {
        this.bMostrar = true;
        this.model.usuario_creacion = sessionStorage.getItem("Usuario");
        if (!this.bTramo) {
          // console.log(this.model);
          // this.fs.seguimientoMonitoreoService.registrarSeguimientoMonitoreo(this.model).subscribe(
          //   respuesta => {
          //     if (respuesta > 0) {
          //       sessionStorage.setItem("fecha_inicio_obra", JSON.stringify(this.model.fecha_inicio_contractual));
          //       this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
          //       sessionStorage.setItem("idSeguimiento_registro", respuesta.toString());
          //       this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          //       this.consultaAuditoria("InformacionObra");
          //       this.listarSeguimientoMonitoreo(respuesta, this.bEstado);
          //       this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
          //       this.eventoInformacionObra(respuesta);

          //       //this.router.navigate(['/monitoreo']);

          //     } else {
          //       this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
          //     }
          //     this.bMostrar = false;
          //   }
          // );

          // this.fs.seguimientoMonitoreoService.InsertarSeguimiento(this.model).subscribe(
          this.fs.seguimientoMonitoreoService.registrarSeguimientoMonitoreo(this.model).subscribe(
            // (data: any) => {
            // let respuesta = data.id_seguimiento;
            (respuesta) => {
              if (respuesta > 0) {
                sessionStorage.setItem("fecha_inicio_obra", JSON.stringify(this.model.fecha_inicio_contractual));
                this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
                sessionStorage.setItem("idSeguimiento_registro", respuesta.toString());
                this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                this.consultaAuditoria("InformacionObra");
                this.listarSeguimientoMonitoreo(respuesta, this.bEstado);
                this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
                this.eventoInformacionObra(respuesta);

                //this.router.navigate(['/monitoreo']);

              } else {
                this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
              }
              this.bMostrar = false;
            }
          );
        }
        else {
          let segMonObra = new _SeguimientoMonitoreo();
          segMonObra._BE_Td_Ssppvd_Seguimiento_Monitoreo_Obra = new SeguimientoMonitoreo();
          segMonObra._BE_Td_Ssppvd_Seguimiento_Monitoreo_Obra = model;
          segMonObra._BE_Tm_Ssppvd_Fase = new Fase();
          segMonObra._BE_Tm_Ssppvd_Fase.id_tipo_fase = TipoFase.OBRA;
          segMonObra._BE_Tm_Ssppvd_Fase.id_tramo = this.idTramo;
          segMonObra._BE_Tm_Ssppvd_Fase.usuario_creacion = sessionStorage.getItem("Usuario");

          this.fs.seguimientoMonitoreoService.registrarSeguimientoFaseMonitoreo(segMonObra).subscribe(
            respuesta => {
              let nuevSegMonitoreo = respuesta as any;
              sessionStorage.setItem("fecha_inicio_obra", JSON.stringify(model.fecha_inicio_contractual));
              this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
              sessionStorage.setItem("idSeguimiento_registro", nuevSegMonitoreo.toString());
              this.listarSeguimientoMonitoreo(nuevSegMonitoreo, this.bEstado);
              this.eventoInformacionObra(nuevSegMonitoreo);
              this.consultaAuditoria("InformacionObra");
              this.bMostrar = false;
            }
          );
        }
      }
    }
  }

  eventoInformacionObra(idSegObra) {
    this.eventInformacionObra.emit(idSegObra);
  }

  listarSeguimientoMonitoreo(idSegMonitoreo, bEstado) {

    // this.fs.seguimientoMonitoreoService.ObtenerSeguimiento(idSegMonitoreo).subscribe((data:any)=>{
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, bEstado).subscribe((data: any) => {
      // console.log(data);

      this.seguimientoMonitoreo = data[0];
      if (this.seguimientoMonitoreo == '{ "data":[{}]}') {
      }
      else {
        this.model = new SeguimientoMonitoreo();
        //this.model.monto_garantia_materiales = this.seguimientoMonitoreo[0].monto_garantia_materiales;
        //this.model.monto_garantia_directo = this.seguimientoMonitoreo[0].monto_garantia_directo;
        this.model.monto_garantia_materiales = this.seguimientoMonitoreo.monto_garantia_materiales;
        this.model.monto_garantia_directo = this.seguimientoMonitoreo.monto_garantia_directo;

        //           id_seguimiento: 12
        //           id_fase: 511
        //           fecha_inicio_contractual: "2020-03-01T17:50:04"
        //           plazo_ejecucion: 10
        //           fecha_termino_contractual: "2020-03-10T00:00:00"
        //           fecha_term_cont_ampl: "2020-03-10T00:00:00"
        //           ampliacion: 0

        // id_seguimiento_monitoreo_obra: 375
        // id_fase: 511
        // fecha_inicio_contractual: "2020-03-01"
        // plazo_ejecucion: 20
        // fecha_termino_contractual: "2020-03-20"
        // ampliacion: 0
        // fecha_term_cont_ampl: "2020-03-20"
        // paralizacion: 0
        // monto_garantia_directo: 0
        // monto_garantia_materiales: 0
        // fecha_term_cont_ampl_paral: "2020-03-20"
        // console.log(this.seguimientoMonitoreo);

        if (this.seguimientoMonitoreo.fecha_inicio_contractual != null) {
          this.model.fecha_inicio_contractual = this.fecha_inicio_contractual = (this.seguimientoMonitoreo.fecha_inicio_contractual != null) ? new Date(this.seguimientoMonitoreo.fecha_inicio_contractual) : null;
          this.model.fecha_termino_contractual = (this.seguimientoMonitoreo.fecha_termino_contractual != null) ? new Date(this.seguimientoMonitoreo.fecha_termino_contractual) : null;
          this.fecha_termino_contractual_temporal = (this.seguimientoMonitoreo.fecha_termino_contractual_temporal != null) ? new Date(this.seguimientoMonitoreo.fecha_termino_contractual_temporal) : null;
          this.model.fecha_term_cont_ampl = (this.seguimientoMonitoreo.fecha_term_cont_ampl) ? new Date(this.seguimientoMonitoreo.fecha_term_cont_ampl) : null;
          //this.model.fecha_term_cont_ampl_paral = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_term_cont_ampl_paral);
        }

        this.model.plazo_ejecucion = this.seguimientoMonitoreo.plazo_ejecucion;
        this.model.ampliacion = this.seguimientoMonitoreo.ampliacion;

        sessionStorage.setItem("idSeguimiento", this.seguimientoMonitoreo.id_seguimiento);
        if (!this.bEstadoHistorial) {
          if (this.estadoSuspensionPrimeroParametro == "false") {
            if (this.fecha_inicio_contractual_parametro == "null") {
              this.divSegMonitoreo = false;
            } else {
              this.divSegMonitoreo = true;
            }
          } else {
            this.divSegMonitoreo = false;
          }
        }
        else {
          this.divSegMonitoreo = true;
        }



        this.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }
    )
  }

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

  setFecTerContractual(fecha, dias) {
    if (dias != null) {
      dias = dias > 0 ? dias - 1 : dias;
      this.model.fecha_termino_contractual = this.funciones.SumDaytoDate(fecha, dias);
    } else {
      this.model.fecha_termino_contractual = this.fecha_termino_contractual_temporal;
    }
  }

  opnModRegAmpliacion() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        fecha_inicio_contractual: this.model.fecha_inicio_contractual,
        bEstado: this.bEstado
      },
      class: "modal-ampliacion-plazo"
    };

    this.bsModalRef = this.modalService.show(AmpliacionModalComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarSeguimientoMonitoreo(data, this.bEstado);
      }
    )
  }

  opnModAdelantoDirecto() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        bEstado: this.bEstado
      },
      class: "modal-adelanto-directo"
    };

    this.bsModalRef = this.modalService.show(ModalAdelantoDirectoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarSeguimientoMonitoreo(data, this.bEstado);
      }
    )
  }

  opnModAdelantoMateriales() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        bEstado: this.bEstado
      },
      class: "modal-adelanto-materiales"
    };

    this.bsModalRef = this.modalService.show(ModalAdelantoMaterialesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarSeguimientoMonitoreo(data, this.bEstado);
      }
    )
  }
}