import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-seguimiento-preinversion',
  templateUrl: './seguimiento-preinversion.component.html',
  styleUrls: ['./seguimiento-preinversion.component.css']
})
export class SeguimientoPreinversionComponent implements OnInit {

  isOpen: boolean = true;
  separator = '';
  divSegMonitoreo = true; // comienza en false
  idSeguimientoMonitoreo: number = 0;
  fechaInicioContractual: Date = null;
  idTramo: number = 0;
  idFase: number = 0;

  constructor(public funciones: Functions, private route: ActivatedRoute) { }

  ngOnInit() {
    this.idFase = this.route.snapshot.params.idFase;
    this.idTramo = this.route.snapshot.params.idTramo;

    if (this.route.snapshot.params.idSeguimientoMonitoreo == 0) {
      if (sessionStorage.getItem('idSeguimiento_registro') != undefined && sessionStorage.getItem('idSeguimiento') == undefined) {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      } else {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
        if (isNaN(this.idSeguimientoMonitoreo)) {
          this.idSeguimientoMonitoreo = 0;
        }
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo, 10);
    }
  }

  setIdSegMonitoreo(respuesta) {
    this.divSegMonitoreo = respuesta.id_seguimiento > 0;
    this.idSeguimientoMonitoreo = respuesta.id_seguimiento;
    this.fechaInicioContractual = respuesta.fecha_inicio_contractual;
  }

}
