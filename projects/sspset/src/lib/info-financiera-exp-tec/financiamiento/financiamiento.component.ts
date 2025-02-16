import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { InformacionFinanciera } from '../../../models/informacion-financiera';
import { FuenteFinanciera } from '../../../models/fuente-financiera';
import { Snip } from '../../../models/response/snip';
import { InfoFinancieraService } from '../../services/info-financiera.service';

@Component({
  selector: 'ssi-financiamiento',
  templateUrl: './financiamiento.component.html',
  styleUrls: ['./financiamiento.component.css']
})
export class FinanciamientoComponent implements OnInit {

  separator = "";
  codigoSnip: number;
  idFase: number;
  numero_Pagina: number = 0;
  num_filas: number = 10;
  infoFinanciera: InformacionFinanciera;
  fteFinanciera: FuenteFinanciera;
  _BE_Snip: Snip;

  constructor(private servicio: InfoFinancieraService, private route: ActivatedRoute) { }

  ngOnInit() {
    //this.codigoSnip = this.route.snapshot.params.snip;
    //this.idFase = this.route.snapshot.params.idFase;
    this.codigoSnip = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).snip;
    this.idFase = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase;
    this.listarInformacionFinanciera(this.codigoSnip, this.idFase, this.num_filas, this.numero_Pagina);
  }

  listarInformacionFinanciera(codSnip: number, idFase: number, numfila: number, numPagina: number) {
    this.servicio.listarInformacionFinanciera(codSnip, idFase).subscribe(
      respuesta => {
        if (respuesta != "") {
          let data = respuesta;
          this._BE_Snip = data.costo;
          this.infoFinanciera = data.ssi;
          // this.fteFinanciera = data.LisBE_Fuente_Financiera;
        }

      }
    );
  }
}
