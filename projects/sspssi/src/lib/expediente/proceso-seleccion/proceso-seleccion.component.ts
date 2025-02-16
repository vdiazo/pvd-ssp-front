import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-proceso-seleccion',
  templateUrl: './proceso-seleccion.component.html',
  styleUrls: ['./proceso-seleccion.component.css']
})
export class ProcesoSeleccionComponent implements OnInit {

  idSeguimientoMonitoreo: number;
  snip: number;
  separator = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.snip = this.route.snapshot.params.snip;
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
  }

}
