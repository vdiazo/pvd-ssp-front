import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsConsultaPrincipalService } from '../../servicios/ws-consulta-principal.service';

@Component({
  selector: 'ssi-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {

  idProyecto = 0;
  idTramo = 0;
  idFase = 0;
  idSeguimientoMonitoreo = 0;
  bSegMonitoreo = false;

  snip: number;
  idMunicipalidad: number;
  rutavariables: string;

  Proyecto: {
    cod_snip: number;
    cod_unificado: number;
    id_proyecto: number;
    nombre_proyecto: string;
    descripcion: string
  };

  constructor(private route: ActivatedRoute, private ssWS: WsConsultaPrincipalService) {
    this.idProyecto = this.route.snapshot.firstChild.params.idProyecto;
    this.idTramo = this.route.snapshot.firstChild.params.idTramo;
    this.idFase = this.route.snapshot.firstChild.params.idFase;
    this.snip = this.route.snapshot.firstChild.params.snip;
    this.idMunicipalidad = this.route.snapshot.firstChild.params.idMunicipalidad;

    sessionStorage.setItem('idFase', this.idFase.toString());

    if (this.route.snapshot.firstChild.params.idSeguimientoMonitoreo == 0) {
      this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
      if (isNaN(this.idSeguimientoMonitoreo)) {
        this.idSeguimientoMonitoreo = 0;
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.firstChild.params.idSeguimientoMonitoreo, 10);
    }

    this.idSeguimientoMonitoreo > 0 ? this.bSegMonitoreo = false : this.bSegMonitoreo = true;
    this.Proyecto = {
      cod_snip: 0,
      cod_unificado: 0,
      id_proyecto: 0,
      nombre_proyecto: '',
      descripcion: ''
    };
    this.rutavariables = this.idSeguimientoMonitoreo + '/' + this.idTramo + '/' + this.idFase + '/' + this.idProyecto + '/' + this.snip + '/' + this.idMunicipalidad;
  }

  ngOnInit() {
    this.ssWS.getProyecto(this.idProyecto, this.idTramo).subscribe(
      respuesta => {
        this.Proyecto = respuesta[0] as any;
        sessionStorage.setItem('CodUnificado', this.Proyecto['cod_unificado'].toString());
        sessionStorage.setItem('UnidadEjecutora', this.Proyecto['nombre_municipalidad']);
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
