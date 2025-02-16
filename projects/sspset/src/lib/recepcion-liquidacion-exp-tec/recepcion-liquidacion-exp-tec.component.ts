import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'set-recepcion-liquidacion-exp-tec',
  templateUrl: './recepcion-liquidacion-exp-tec.component.html',
  styleUrls: ['./recepcion-liquidacion-exp-tec.component.css']
})
export class RecepcionLiquidacionExpTecComponent implements OnInit {

  idProyecto: number;
  idSeguimientoMonitoreo: number;
  idFase: number;
  separator = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.idFase = this.route.snapshot.params.idFase;
    //this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
    this.idSeguimientoMonitoreo=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idSeguimientoMonitoreo);
  }

}
