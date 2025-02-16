import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-aprobacion-liquidacion-expediente',
  templateUrl: './aprobacion-liquidacion-expediente.component.html',
  styleUrls: ['./aprobacion-liquidacion-expediente.component.css']
})
export class AprobacionLiquidacionExpedienteComponent implements OnInit {

  idSeguimientoMonitoreo: number;
  codSnip: number;
  idFase: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.codSnip = this.route.snapshot.params.snip;
    this.idFase = parseInt(this.route.snapshot.params.idFase, 10);
    this.idSeguimientoMonitoreo = parseInt(this.route.snapshot.params.idSeguimientoMonitoreo, 10);
  }

}
