import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalAmpliacionesComponent } from './modales/modal-ampliaciones/modal-ampliaciones.component';
import { ModalSupervisorComponent } from './modales/modal-supervisor/modal-supervisor.component';
import { ModalInspectorComponent } from './modales/modal-inspector/modal-inspector.component';
//import { ModalAmpliacionComponent } from 'modales/modal-ampliaciones/modal-ampliaciones.component';
import { ActivatedRoute } from '@angular/router';

import { SeguimientoMonitoreo } from '../../models/response/seguimiento-monitoreo';

import { EntregablesExpTecComponent } from '../seguimiento-monitoreo-ejecucion-exp-tec/entregables-exp-tec/entregables-exp-tec.component';
import { AvanceElaboracionExpedienteComponent } from '../seguimiento-monitoreo-ejecucion-exp-tec/avance-elaboracion-expediente/avance-elaboracion-expediente.component';
import { InformacionObraComponent } from '../seguimiento-monitoreo-ejecucion-exp-tec/informacion-obra/informacion-obra.component';


@Component({
  selector: 'set-seguimiento-monitoreo-ejecucion-exp-tec',
  templateUrl: './seguimiento-monitoreo-ejecucion-exp-tec.component.html',
  styleUrls: ['./seguimiento-monitoreo-ejecucion-exp-tec.component.css']
})
export class SeguimientoMonitoreoEjecucionExpTecComponent implements OnInit {

  @ViewChild('EntregableExpTec') EntregableExpTec: EntregablesExpTecComponent;
  @ViewChild('AvanceEntregableExpTec') AvanceEntregableExpTec : AvanceElaboracionExpedienteComponent;
  @ViewChild('InformacionObraExpTec') InformacionObraExpTec : InformacionObraComponent;


  bsModalRef: BsModalRef;
  config: any;

  bsModalSupervisorRef: BsModalRef;
  bsModalResidenteRef: BsModalRef;
  bsModalInspectorRef: BsModalRef;

  idSeguimientoMonitoreo: number;

  @Input() bEstado: boolean;
  @Input() idFase: number;
  @Input() idTramo: number;
  @Input() id_seguimientoMonitoreoObra: number;
  @Input() bEstadoHistorial: boolean;


  /**incio */
  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";


  separator = "";
  divSegMonitoreo = false;
  isOpen = true;
  model: SeguimientoMonitoreo;
  //model_Accion_Paralizacion: ParalizacionAccion;
  plazo_ejecucion = 0;
  // id_seguimientoMonitoreoObra: number;
  guid: string = ""
  parametro: string;
  idProyecto: number;
  // idFase: number;
  // idTramo: number;
  seguimientoMonitoreo;
  //accionMonitoreo: AccionSeguimientoMonitoreo;

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



  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
      //this.idSeguimientoMonitoreo=12;
     this.idFase = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase//this.route.snapshot.params.idFase;
      this.idTramo =JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTramo //this.route.snapshot.params.idTramo;

      let fasei=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase;
      //if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
        if (JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idSeguimientoMonitoreo == 0) {
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
        //this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
        this.idSeguimientoMonitoreo=JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idSeguimientoMonitoreo;
      }

    this.has_seguimientoMonitoreoObra = this.idSeguimientoMonitoreo != 0;

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
      this.bTramo = false;
    }

    //Datos Auditoria
    //this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    //this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
  }

  setIdSegMonitoreo(id) {
    this.divSegMonitoreo = id > 0;
    this.idSeguimientoMonitoreo = id;
  }

}
