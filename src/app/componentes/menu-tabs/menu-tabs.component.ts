import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsConsultaPrincipalService } from '../../services/ws-consulta-principal.service';

@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.css']
})
export class MenuTabsComponent implements OnInit {
  idProyecto: number;
  idTramo: number;
  idFase: number;
  idSeguimientoMonitoreo: number;
  bSegMonitoreo: boolean;
  fecha_inicio_contractual_parametro: string = "";

  snip: number;
  idMunicipalidad: number;
  idTipoFase: number;
  rutavariables: string;

  Proyecto: {
    cod_snip: number,
    cod_unificado: number,
    id_proyecto: number,
    nombre_proyecto: string
  };

  constructor(private route: ActivatedRoute, private ssWS: WsConsultaPrincipalService) {
    this.idProyecto = this.route.snapshot.firstChild.params.idProyecto;
    this.idTramo = this.route.snapshot.firstChild.params.idTramo;
    this.idFase = this.route.snapshot.firstChild.params.idFase;
    this.snip = this.route.snapshot.firstChild.params.snip;
    this.idMunicipalidad = this.route.snapshot.firstChild.params.idMunicipalidad;
    this.idTipoFase = this.route.snapshot.firstChild.params.idTipoFase;

    sessionStorage.setItem("idFase", this.idFase.toString());


    //this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo);
    // Fixed by Ronald Saavedra


    if (this.route.snapshot.firstChild.params.idSeguimientoMonitoreo == 0) {
      this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento"));
      if (isNaN(this.idSeguimientoMonitoreo)) {
        this.idSeguimientoMonitoreo = 0;
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.firstChild.params.idSeguimientoMonitoreo);
    }

    this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
    //if(!sessionStorage.getItem("esSuspension")){
      this.idSeguimientoMonitoreo > 0 && this.fecha_inicio_contractual_parametro != "null" ? this.bSegMonitoreo = false : this.bSegMonitoreo = true;
    //}

    
    this.Proyecto = {
      cod_snip: 0,
      cod_unificado: 0,
      id_proyecto: 0,
      nombre_proyecto: ''
    };
    this.rutavariables = this.idSeguimientoMonitoreo + '/' + this.idTramo + '/' + this.idFase + '/' + this.idProyecto + '/' + this.snip + '/' + this.idMunicipalidad + '/' + this.idTipoFase;
  }

  ngOnInit() {
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