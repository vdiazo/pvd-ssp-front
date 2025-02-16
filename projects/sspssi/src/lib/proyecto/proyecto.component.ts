import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsConsultaPrincipalService } from '../../servicios/ws-consulta-principal.service';
//import { WsConsultaPrincipalService } from '../../services/ws-consulta-principal.service';

@Component({
  selector: 'ssi-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {
  idProyecto: number=0;
  idTramo: number=0;
  idFase: number=0;
  idSeguimientoMonitoreo: number=0;
  bSegMonitoreo: boolean;

  snip: number;
  idMunicipalidad: number;
  rutavariables: string;

  Proyecto: {
    cod_snip: number,
    cod_unificado: number,
    id_proyecto: number,
    nombre_proyecto: string
  };

  constructor(private route: ActivatedRoute, private ssWS:WsConsultaPrincipalService) {
    this.idProyecto = this.route.snapshot.firstChild.params.idProyecto;
    this.idTramo = this.route.snapshot.firstChild.params.idTramo;
    this.idFase = this.route.snapshot.firstChild.params.idFase;
    this.snip = this.route.snapshot.firstChild.params.snip;
    this.idMunicipalidad = this.route.snapshot.firstChild.params.idMunicipalidad;

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


    this.idSeguimientoMonitoreo > 0 ? this.bSegMonitoreo = false : this.bSegMonitoreo = true;
    this.Proyecto = {
      cod_snip: 0,
      cod_unificado: 0,
      id_proyecto: 0,
      nombre_proyecto: ''
    };
    this.rutavariables = this.idSeguimientoMonitoreo + '/' + this.idTramo + '/' + this.idFase + '/' + this.idProyecto + '/' + this.snip + '/' + this.idMunicipalidad;

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
