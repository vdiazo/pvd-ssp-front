import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { WsConsultaPrincipalService } from '../services/ws-consulta-principal.service';

@Component({
  selector: 'set-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.css']
})
export class MenuTabsComponent implements OnInit {
  items: MenuItem[];
  activeItem: MenuItem;
  rutavariables: string;
  idProyecto: number;
  idTramo: number;

  idSeguimientoMonitoreo: number;
  bSegMonitoreo: boolean;

  Proyecto: {
    cod_snip: number,
    cod_unificado: number,
    id_proyecto: number,
    nombre_proyecto: string
  };

  idTipoFase:number;

  constructor(private route: ActivatedRoute, private ssWS: WsConsultaPrincipalService) { 
    if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
      this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento"));
      if (isNaN(this.idSeguimientoMonitoreo)) {
        this.idSeguimientoMonitoreo = 0;
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
    }
    this.idSeguimientoMonitoreo > 0 ? this.bSegMonitoreo = false : this.bSegMonitoreo = true;
    this.Proyecto = {
      cod_snip: 0,
      cod_unificado: 0,
      id_proyecto: 0,
      nombre_proyecto: ''
    };
  }

  ngOnInit() {
    this.idTipoFase=parseInt(this.route.snapshot.params.idTipoFase);
    let datosProyectoExpTec = {
      idSeguimientoMonitoreo: this.route.snapshot.params.idSeguimientoMonitoreo,
      idTramo: this.route.snapshot.params.idTramo,
      idFase: this.route.snapshot.params.idFase,
      idProyecto: this.route.snapshot.params.idProyecto,
      snip: this.route.snapshot.params.snip,
      idMunicipalidad: this.route.snapshot.params.idMunicipalidad,
      idTipoFase:  this.route.snapshot.params.idTipoFase
    }
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.idTramo = this.route.snapshot.params.idTramo;

    sessionStorage.setItem("datosProyectoExpTec", JSON.stringify(datosProyectoExpTec)); 
    this.items = [
      { label: 'Información General Proyecto', icon: 'fa fa-fw fa-bar-chart', routerLink:'infogeneral-exp-tec' },
      { label: 'Financiamiento', icon: 'fa fa-fw fa-calendar', routerLink:'financiamiento-exp-tec' },
      { label: 'Proceso de Selección', icon: 'fa fa-fw fa-book', routerLink:'proceso-seleccion-exp-tec' },
      { label: 'Seguimiento y monitoreo a Ejecución', icon: 'fa fa-fw fa-support', routerLink:'seguimiento-monitoreo-ejecucion-exp-tec' },
      { label: 'Recepción y Liquidación', icon: 'fa fa-fw fa-twitter', routerLink:'recepcion-liquidacion-exp-tec' }
    ];
    
    this.activeItem = this.items[0];
       this.ssWS.getProyecto(this.idProyecto, this.idTramo).subscribe(
       respuesta => {
        this.Proyecto = respuesta[0] as any;
          sessionStorage.setItem("CodUnificado", this.Proyecto["cod_unificado"].toString());
          sessionStorage.setItem("UnidadEjecutora", this.Proyecto["nombre_municipalidad"]);
       }
     );
  }

  funcion() {
    return this.bSegMonitoreo;
  }
  habilitarRecepcionLiquidacion(estado) {
    this.bSegMonitoreo = estado;
  }
}
