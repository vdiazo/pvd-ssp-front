import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { sessionStorageItems } from '../../appSettings';

@Component({
  selector: 'app-recepcion-liquidacion',
  templateUrl: './recepcion-liquidacion.component.html',
  styleUrls: ['./recepcion-liquidacion.component.css']
})
export class RecepcionLiquidacionComponent implements OnInit {

  idProyecto: number;
  idSeguimientoMonitoreo: number;
  idFase: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.idFase = this.route.snapshot.params.idFase;
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
    // this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_SEGUIMIENTO_MONITOREO_OBRA));
  }

}
