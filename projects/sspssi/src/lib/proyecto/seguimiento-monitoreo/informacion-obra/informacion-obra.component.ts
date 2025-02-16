import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { SeguimientoMonitoreo, _SeguimientoMonitoreo, Fase } from '../../../../models/response/seguimiento-monitoreo';
import { Functions, TipoFase } from '../../../../appSettings';
import { FacadeService } from '../../../../patterns/facade.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
//import { AmpliacionModalComponent } from '../../ampliacion-modal/ampliacion-modal.component';
import { ModalAdelantoDirectoComponent } from '../modal-adelanto-directo/modal-adelanto-directo.component';
import { ModalAdelantoMaterialesComponent } from '../modal-adelanto-materiales/modal-adelanto-materiales.component';
import { ProyectoComponent as MenuTabsComponent } from '../../proyecto.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { AmpliacionModalComponent } from '../ampliacion-modal/ampliacion-modal.component';

@Component({
  selector: 'ssi-informacion-obra',
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

  idMunicipalidad: number;
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

  //constructor(public funciones: Functions, private fs: FacadeService, private sMant: MaestraService, private modalService: BsModalService, private menuTabs: MenuTabsComponent) {
  constructor(public funciones: Functions, private fs: FacadeService, private sMant: MaestraSsiService, private modalService: BsModalService, private injector: Injector,
    private router: Router, private route: ActivatedRoute) {
    this.model = new SeguimientoMonitoreo();
  }

  ngOnInit() {
    if (this.idFase === 0 && this.idSeguimientoMonitoreoObra === 0) {
      this.bTramo = true;
    } else {
      this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado);
      this.bTramo = false;
    }

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
    this.idMunicipalidad = this.route.snapshot.params.idMunicipalidad;
  }

  _menuTabs: MenuTabsComponent
  public get getMenuTabsComponents(): MenuTabsComponent {
    this._menuTabs = this.injector.get(MenuTabsComponent);
    return this._menuTabs;
  }

  modificarSegMonitoreo(model) {
    this.model.fecha_termino = null;
    this.model.fecha_termino_contractual = null;
    this.model.id_fase = parseInt(this.idFase.toString());
    if (this.divSegMonitoreo) {
      //actualizar
      this.funciones.alertaRetorno("question", "<strong>¿Está seguro de actualizar el registro?</strong>",
        "<div style='color:#E53935;font-weight:400;'>¡Importante!<br>Se eliminarán las Ampliaciones, Monto Directo, " +
        "Monto Materiales, Cronograma y Valorizaciones relacionadas a esta obra.</div>",
        true, (respuesta) => {
          if (respuesta.value) {
            this.bMostrar = true;
            this.model.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
            this.model.usuario_modificacion = sessionStorage.getItem("Usuario");

            let segMonObra = new _SeguimientoMonitoreo();
            segMonObra._BE_Td_Ssppvd_Seguimiento_Monitoreo_Obra = new SeguimientoMonitoreo();
            segMonObra._BE_Td_Ssppvd_Seguimiento_Monitoreo_Obra = model;
            segMonObra._BE_Tm_Ssppvd_Fase = new Fase();
            segMonObra._BE_Tm_Ssppvd_Fase.id_tipo_fase = TipoFase.OBRA;
            segMonObra._BE_Tm_Ssppvd_Fase.id_tramo = parseInt(this.idTramo.toString());
            segMonObra._BE_Tm_Ssppvd_Fase.id_municipalidad = parseInt(this.idMunicipalidad.toString());
            segMonObra._BE_Tm_Ssppvd_Fase.usuario_modificacion = sessionStorage.getItem("Usuario");

            this.fs.seguimientoMonitoreoService.actualizarSeguimientoMonitoreo(segMonObra).subscribe(
              respuesta => {
                if (respuesta > 0) {
                  this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
                  // this.consultaAuditoria("InformacionObra");
                  // this.consultaAuditoria("Valorizaciones");
                  // // this.cCronogramaComponent.consultaAuditoria();
                  this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado);
                  this.router.navigate(['/ssi/monitoreo']);
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
      this.bMostrar = true;
      this.model.usuario_creacion = sessionStorage.getItem("Usuario");
      if (!this.bTramo) {
        this.fs.seguimientoMonitoreoService.registrarSeguimientoMonitoreo(this.model).subscribe(
          respuesta => {
            if (respuesta > 0) {
              sessionStorage.setItem("idSeguimiento_registro", respuesta.toString());
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              this.consultaAuditoria("InformacionObra");
              this.listarSeguimientoMonitoreo(respuesta, this.bEstado);
              this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
              this.eventoInformacionObra(respuesta);
              //this.menuTabs.habilitarRecepcionLiquidacion(false);
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

  eventoInformacionObra(idSegObra) {
    this.eventInformacionObra.emit(idSegObra);
  }

  listarSeguimientoMonitoreo(idSegMonitoreo, bEstado) {
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, bEstado).subscribe(
      respuesta => {
        this.seguimientoMonitoreo = respuesta as any;
        if (this.seguimientoMonitoreo == '{ "data":[{}]}') {
        }
        else {
          this.model = new SeguimientoMonitoreo();
          this.model.monto_garantia_materiales = this.seguimientoMonitoreo[0].monto_garantia_materiales;
          this.model.monto_garantia_directo = this.seguimientoMonitoreo[0].monto_garantia_directo;
          this.model.fecha_inicio_contractual = this.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_inicio_contractual);
          this.model.fecha_termino_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_termino_contractual);
          this.fecha_termino_contractual_temporal = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_termino_contractual);
          this.model.plazo_ejecucion = this.seguimientoMonitoreo[0].plazo_ejecucion;
          this.model.ampliacion = this.seguimientoMonitoreo[0].ampliacion;
          this.model.fecha_term_cont_ampl = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_term_cont_ampl);
          this.model.fecha_term_cont_ampl_paral = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_term_cont_ampl_paral);
          sessionStorage.setItem("idSeguimiento", this.seguimientoMonitoreo[0].id_seguimiento_monitoreo_obra);
          this.divSegMonitoreo = true;
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
      class: "modal-adelanto-materiales"
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
