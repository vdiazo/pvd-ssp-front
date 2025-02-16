import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-adicional-deductivo',
  templateUrl: './adicional-deductivo.component.html',
  styleUrls: ['./adicional-deductivo.component.css']
})
export class AdicionalDeductivoComponent implements OnInit {

  idSeguimientoMonitoreo: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
  }

}
