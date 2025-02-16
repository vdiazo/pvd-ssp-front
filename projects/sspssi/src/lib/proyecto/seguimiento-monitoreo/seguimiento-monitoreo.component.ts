import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings/functions';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { ActivatedRoute } from '@angular/router';
import { SeguimientoMonitoreo } from '../../../models/response/seguimiento-monitoreo';
import { ParalizacionAccion } from '../../../models/response/paralizacion-accion';
import { AccionSeguimientoMonitoreo } from '../../../models/response/seguimiento-monitoreo-accion';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import $ from 'jquery';
import { ComparativoAvanceComponent } from './comparativo-avance/comparativo-avance.component';

@Component({
  selector: 'ssi-seguimiento-monitoreo',
  templateUrl: './seguimiento-monitoreo.component.html',
  styleUrls: ['./seguimiento-monitoreo.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [Functions]
})
export class SeguimientoMonitoreoComponent implements OnInit {
  @ViewChild(CronogramaComponent) cCronogramaComponent: CronogramaComponent;

  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";


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
  fecha_inicio_contractual: Date;

  constructor(private fs: FacadeService,
    private modalService: BsModalService,
    public funciones: Functions,
    private route: ActivatedRoute,
    //private menuTabs: MenuTabsComponent,
    private sMant: MaestraSsiService) {
    this.model = new SeguimientoMonitoreo();
  }

  ngOnInit() {
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
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
    }

    this.has_seguimientoMonitoreoObra = this.idSeguimientoMonitoreo != 0;

    //validar acordeones valorizacion y paralizacion
    if (this.idSeguimientoMonitoreo > 0) {
      this.bValorizacion = true;
      this.bParalizacion = true;
      this.divSegMonitoreo = true;
    } else {
      this.bValorizacion = false;
      this.bParalizacion = false;
      this.divSegMonitoreo = false;
    }
    this.idProyecto = this.route.snapshot.params.idProyecto;

    if (this.idFase === 0 && this.idSeguimientoMonitoreo === 0) {
      this.bTramo = true;
    } else {
      // this.listarSeguimientoMonitoreo(this.idSeguimientoMonitoreo);
      this.bTramo = false;
    }

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
  }

  @ViewChild(ComparativoAvanceComponent) hijo: ComparativoAvanceComponent;

  mostrar_(): void {
    let principal = this;
    if (!$('#graficoAvance').hasClass("open")) {
      $('#graficoAvance').show(200, 'swing', function () {
        $(this).addClass("open");
        principal.hijo.actualizarTamano();
      })
    }
    else {
      $('#graficoAvance').hide(200, 'swing', function () {
        $(this).removeClass("open");
      })

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

  setIdSegMonitoreo(id) {
    this.divSegMonitoreo = id > 0;
    this.idSeguimientoMonitoreo = id;
  }
  ActualizarGrafico_() {
    this.hijo.actualizarTamano();
  };
}