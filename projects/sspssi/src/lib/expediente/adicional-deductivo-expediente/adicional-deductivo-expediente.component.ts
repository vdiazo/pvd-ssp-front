import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-adicional-deductivo-expediente',
  templateUrl: './adicional-deductivo-expediente.component.html',
  styleUrls: ['./adicional-deductivo-expediente.component.css']
})
export class AdicionalDeductivoExpedienteComponent implements OnInit {

  idSeguimientoMonitoreo: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem('idSeguimiento'), 10);
  }
}
