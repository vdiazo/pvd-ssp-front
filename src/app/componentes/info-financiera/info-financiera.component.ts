import { Component, OnInit } from '@angular/core';
import { InfoFinancieraService } from '../../services/info-financiera.service';
import { ActivatedRoute } from '@angular/router';
import { InformacionFinanciera } from '../../models/response/informacion-financiera';
import { FuenteFinanciera } from '../../models/response/fuente-financiera';
import { Snip } from '../../models/response/snip';

@Component({
  selector: 'app-info-financiera',
  templateUrl: './info-financiera.component.html',
  styleUrls: ['./info-financiera.component.css']
})
export class InfoFinancieraComponent implements OnInit {
  separator = "";
  codigoSnip: number;
  idFase: number;
  numero_Pagina: number = 0;
  num_filas: number = 10;
  infoFinanciera: InformacionFinanciera;
  fteFinanciera: FuenteFinanciera;
  _BE_Snip: Snip;
  constructor(private servicio: InfoFinancieraService, private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.codigoSnip = this.route.snapshot.params.snip;
    this.idFase = this.route.snapshot.params.idFase;
    this.listarInformacionFinanciera(this.codigoSnip, this.idFase, this.num_filas, this.numero_Pagina);
  }

  listarInformacionFinanciera(codSnip: number, idFase: number, numfila: number, numPagina: number) {
    this.servicio.listarInformacionFinanciera(codSnip, idFase).subscribe(
      (respuesta: any) => {
        let detalle = respuesta;
        this._BE_Snip = detalle.costo;
        this.infoFinanciera = detalle.ssi;
        // this.fteFinanciera = infoFinanciera.LisBE_Fuente_Financiera;
      }
    );
  }
}
