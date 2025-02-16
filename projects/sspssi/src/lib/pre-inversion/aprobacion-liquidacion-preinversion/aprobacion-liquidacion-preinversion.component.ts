import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ssi-aprobacion-liquidacion-preinversion',
  templateUrl: './aprobacion-liquidacion-preinversion.component.html',
  styleUrls: ['./aprobacion-liquidacion-preinversion.component.css']
})
export class AprobacionLiquidacionPreinversionComponent implements OnInit {

  idSeguimientoMonitoreo: number = 0;
  idFase: number = 0;
  UltimaActualizacion: string = '';
  constructor() { }

  ngOnInit() {
    this.listarSeguimiento();
  }

  listarSeguimiento() {
    this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
    this.idFase = parseInt(sessionStorage.getItem('idFase'), 10);
  }


}
