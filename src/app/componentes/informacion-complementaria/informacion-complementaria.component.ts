import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informacion-complementaria',
  templateUrl: './informacion-complementaria.component.html',
  styleUrls: ['./informacion-complementaria.component.css']
})
export class InformacionComplementariaComponent implements OnInit {

  idSeguimientoMonitoreo: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
  }

}
