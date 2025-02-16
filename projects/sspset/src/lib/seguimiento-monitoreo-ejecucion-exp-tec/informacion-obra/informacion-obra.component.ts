import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';

import { SeguimientoMonitoreo,_SeguimientoMonitoreo,Fase } from '../../../models/response/seguimiento-monitoreo';
import { ModalAmpliacionesComponent }  from '../modales/modal-ampliaciones/modal-ampliaciones.component';

import { FacadeService } from '../../patterns/facade.service';
import { Funciones } from '../../../appSettings/funciones';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuTabsComponent } from '../../menu-tabs/menu-tabs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'set-informacion-obra',
  templateUrl: './informacion-obra.component.html',
  styleUrls: ['./informacion-obra.component.css']
})
export class InformacionObraComponent implements OnInit {
  model: SeguimientoMonitoreo;
  divSegMonitoreo:boolean = false;
  @Input() idFase: number;
  @Input() idTramo: number;
  @Input() idSeguimientoMonitoreoObra: number;
  @Input() bEstadoHistorial: boolean;
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

  @Output() EventEliminarAmpliacion: EventEmitter<any> = new EventEmitter();

  constructor(
    public funciones: Funciones,
    private fs: FacadeService,
    //private sMant: MaestraService,
    private modalService: BsModalService,
    private injector: Injector,
    private router: Router
  ) {
    this.model=new SeguimientoMonitoreo();
   }

  ngOnInit() {
    if (this.idFase === 0 && this.idSeguimientoMonitoreoObra === 0) {
      this.bTramo = true;
    } else {
      this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreoObra, this.bEstado);
      this.bTramo = false;
    }

    //Datos Auditoria
    //this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    //this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
  }

  _menuTabs: MenuTabsComponent
  public get getMenuTabsComponents(): MenuTabsComponent {
    this._menuTabs = this.injector.get(MenuTabsComponent);
    return this._menuTabs;
  }


  modificarSegMonitoreo(model) {
    this.model.fecha_termino = null;
    //this.model.fecha_termino_contractual = null;
    this.model.id_fase = this.idFase;

    if (this.divSegMonitoreo) {
      //actualizar
      this.funciones.alertaRetorno("question", "<strong>¿Está seguro de actualizar el registro?</strong>",
        "<div style='color:#E53935;font-weight:400;'>¡Importante!<br>Se eliminarán las Ampliaciones, " +
        " informes o entregables y Avance de elaboración del expediente técnico.</div>",
        true, (respuesta) => {
          if (respuesta.value) {
            this.bMostrar = true;
            this.model.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
            this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
            let parametrosUpdate={
              id_seguimiento_ejecucion_expediente:model.id_seguimiento_monitoreo_obra,
              id_fase:model.id_fase,
              fecha_inicio_contractual:model.fecha_inicio_contractual,
              plazo_ejecucion:model.plazo_ejecucion,
              usuario_modificacion:sessionStorage.getItem("Usuario"),
            }
            //this.fs.seguimientoMonitoreoExpTecService.modificarSeguimientoEjecucionExpediente(this.model).subscribe(
              this.fs.seguimientoMonitoreoExpTecService.modificarSeguimientoEjecucionExpediente(parametrosUpdate).subscribe(
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
      this.bMostrar = true;
      this.model.usuario_creacion = sessionStorage.getItem("Usuario");
      if (!this.bTramo) {
        let parametro={
          id_fase:JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase,
          plazo_ejecucion:this.model.plazo_ejecucion,
          fecha_inicio_contractual:this.model.fecha_inicio_contractual,
          usuario_creacion:sessionStorage.getItem("Usuario")
        }
        this.fs.seguimientoMonitoreoExpTecService.insertarSeguimientoEjecucionExpediente(parametro).subscribe(
          respuesta => {
            if (respuesta > 0) {
              sessionStorage.setItem("idSeguimiento_registro", respuesta.toString());
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              //this.consultaAuditoria("InformacionObra");
              this.listarSeguimientoMonitoreo(respuesta, this.bEstado);
              this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
              this.eventoInformacionObra(respuesta);
              //this.menuTabs.habilitarRecepcionLiquidacion(false);
              let parametroExpediente={"id_fase":this.idFase,"id_seguimiento_monitoreo":respuesta,"usuario_creacion":sessionStorage.getItem("Usuario")};
              this.fs.seguimientoMonitoreoExpTecService.insertarContenidoExpediente(parametroExpediente).subscribe(
                respuestaExp=>{

                }
              )
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
        //segMonObra._BE_Tm_Ssppvd_Fase.id_tipo_fase = TipoFase.OBRA;
        segMonObra._BE_Tm_Ssppvd_Fase.id_tramo = this.idTramo;
        segMonObra._BE_Tm_Ssppvd_Fase.usuario_creacion = sessionStorage.getItem("Usuario");

        this.fs.seguimientoMonitoreoExpTecService.insertarSeguimientoEjecucionExpediente(segMonObra).subscribe(
          respuesta => {
            let nuevSegMonitoreo = respuesta as any;
            sessionStorage.setItem("idSeguimiento_registro", nuevSegMonitoreo.toString());
            this.listarSeguimientoMonitoreo(nuevSegMonitoreo, this.bEstado);
            this.eventoInformacionObra(nuevSegMonitoreo);
            //this.consultaAuditoria("InformacionObra");
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
    this.fs.seguimientoMonitoreoExpTecService.listarSeguimientoEjecucionExpediente(idSegMonitoreo, bEstado).subscribe(
      respuesta => {
        this.seguimientoMonitoreo = respuesta as any;
        if (this.seguimientoMonitoreo == '{ "data":[{}]}') {
        }
        else {
          this.divSegMonitoreo = true;
          this.model = new SeguimientoMonitoreo();
          this.model.monto_garantia_materiales = this.seguimientoMonitoreo[0].monto_garantia_materiales;
          this.model.monto_garantia_directo = this.seguimientoMonitoreo[0].monto_garantia_directo;
          this.model.fecha_inicio_contractual = this.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_inicio_contractual);
          this.model.fecha_termino_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_termino_contractual);
          this.fecha_termino_contractual_temporal = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_termino_contractual);
          this.model.plazo_ejecucion = this.seguimientoMonitoreo[0].plazo_ejecucion;
          this.model.ampliacion = this.seguimientoMonitoreo[0].ampliacion;
          this.model.fecha_term_cont_ampl = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_term_cont_ampl);
          //this.model.fecha_term_cont_ampl_paral = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_term_cont_ampl_paral);
          sessionStorage.setItem("idSeguimiento", this.seguimientoMonitoreo[0].id_seguimiento_ejecucion_expediente);
          this.divSegMonitoreo = true;
          this.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      }
    )
  }


  opnModRegAmpliacion() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      initialState: {
        id_seguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        //id_seguimientoMonitoreoObra: 53,
        fecha_inicio_contractual: this.model.fecha_inicio_contractual,
        bEstado: this.bEstado
      },
      class: "modal-ampliacion-plazo"
    };

    this.bsModalRef = this.modalService.show(ModalAmpliacionesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarSeguimientoMonitoreo(data, this.bEstado);
        this.EventEliminarAmpliacion.emit(1);
      }
    )
  }

  setFecTerContractual(fecha, dias) {
    if (dias != null) {
      dias = dias > 0 ? dias - 1 : dias;
      this.model.fecha_termino_contractual = this.funciones.SumDaytoDate(fecha, dias);
    } else {
      this.model.fecha_termino_contractual = this.fecha_termino_contractual_temporal;
    }
  }



}
