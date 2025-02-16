import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { AccionSeguimientoMonitoreo } from '../../models/response/seguimiento-monitoreo-accion';
import { ParalizacionAccion } from '../../models/response/paralizacion-accion';
import { ActivatedRoute } from '@angular/router';
import { SeguimientoMonitoreo, _SeguimientoMonitoreo, Fase } from '../../models/response/seguimiento-monitoreo';
import { FacadeService } from '../../patterns/facade.service';
import { MaestraService } from '../../services/maestra.service';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { InformacionObraComponent } from './informacion-obra/informacion-obra.component';
import { parseDate } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-ejecucion-estado',
  templateUrl: './ejecucion-estado.component.html',
  styleUrls: ['./ejecucion-estado.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [Functions]
})

export class EjecucionEstadoComponent implements OnInit {
  @ViewChild(CronogramaComponent) cCronogramaComponent: CronogramaComponent;
  //@ViewChild(InformacionObraComponent) cInformacionObraComponent: InformacionObraComponent;

  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";

  divMostrarInformacionObra: boolean = true;

  separator = "";
  divSegMonitoreo = false;
  bsModalRef: BsModalRef;
  isOpen = true;
  model: SeguimientoMonitoreo;
  model_Accion_Paralizacion: ParalizacionAccion;
  plazo_ejecucion = 0;
  id_seguimientoMonitoreoObra: number;
  guid: string = ""
  parametro: string;
  idProyecto: number;
  idFase: number;
  idTramo: number;
  snip: number;
  idSeguimientoMonitoreo: number;
  seguimientoMonitoreo;
  accionMonitoreo: AccionSeguimientoMonitoreo;

  //paralizacion: Paralizacion;
  //accionParalizacion: ParalizacionAccion;

  fecha_termino_contractual_temporal: Date;
  segMonitoreo: number;
  bTramo: boolean = false;
  Proyecto;
  Nombre_Proyecto: string;

  totalAccionSeguimientoMonitoreo: number = 0;
  has_seguimientoMonitoreoObra: boolean = false;
  bValorizacion: boolean = false;
  bParalizacion: boolean = false;
  fecha_inicio_contractual_parametro: string = "";
  fecha_inicio_contractual: Date;


  estadoSuspensionPrimero: string = "";

  constructor(private fs: FacadeService,
    private modalService: BsModalService,
    public funciones: Functions,
    private route: ActivatedRoute,
    //private menuTabs: MenuTabsComponent,
    private sMant: MaestraService) {
    this.model = new SeguimientoMonitoreo();
  }

  ngOnInit() {
    this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
    this.estadoSuspensionPrimero = sessionStorage.getItem("esSuspension");

    this.idFase = this.route.snapshot.params.idFase;
    this.idTramo = this.route.snapshot.params.idTramo;
    this.snip = this.route.snapshot.params.snip;
    if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
      if (sessionStorage.getItem("idSeguimiento_registro") != undefined && sessionStorage.getItem("idSeguimiento") == undefined) {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento"));
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      } else {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento_registro"));
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      }
    } else {
      // if (this.estadoSuspensionPrimero == "false") {
      //   this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
      // } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
      //}

    }
    this.has_seguimientoMonitoreoObra = this.idSeguimientoMonitoreo != 0;
    //validar acordeones valorizacion y paralizacion
    if (this.idSeguimientoMonitoreo > 0 && this.fecha_inicio_contractual_parametro != "null" && this.estadoSuspensionPrimero == "false") {
      this.bValorizacion = true;
      this.bParalizacion = true;
      this.divSegMonitoreo = true;
    } else {
      this.bValorizacion = false;
      this.bParalizacion = false;
      this.divSegMonitoreo = false;
    }

    if (this.estadoSuspensionPrimero == "false") {
      this.divMostrarInformacionObra = true;
    } else {
      this.divMostrarInformacionObra = false;
    }


    this.idProyecto = this.route.snapshot.params.idProyecto;
    if (this.idFase === 0 && this.idSeguimientoMonitoreo === 0) {
      this.bTramo = true;
    } else {
      this.bTramo = false;
    }

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
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

  setIdSegMonitoreo(id) {
    this.divSegMonitoreo = id > 0;
    this.idSeguimientoMonitoreo = id;
  }

  refrescarInformacionObra() {
    this.estadoSuspensionPrimero = sessionStorage.getItem("esSuspension");
    if (this.estadoSuspensionPrimero == "true") {
      this.divMostrarInformacionObra = false;
    } else {
      this.divMostrarInformacionObra = true;
    }
  }
}