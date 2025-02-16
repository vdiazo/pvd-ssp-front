import { Component, OnInit } from '@angular/core';
import { InformacionFinanciera } from 'projects/sspssi/src/models/response/informacion-financiera';
import { FuenteFinanciera } from 'projects/sspssi/src/models/response/fuente-financiera';
import { Snip } from 'projects/sspssi/src/models/response/snip';
import { InfoFinancieraService } from 'projects/sspssi/src/servicios/info-financiera.service';
import { ActivatedRoute } from '@angular/router';

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
    this.codigoSnip = this.route.snapshot.params.snip;
    this.idFase = this.route.snapshot.params.idFase;
    this.listarInformacionFinanciera(this.codigoSnip, this.idFase, this.num_filas, this.numero_Pagina);
  }

  listarInformacionFinanciera(codSnip: number, idFase: number, numfila: number, numPagina: number) {
    this.servicio.listarInformacionFinanciera(codSnip, idFase).subscribe(
      (respuesta: any) => {
        let data = respuesta;
        this._BE_Snip = data.costo;
        this.infoFinanciera = data.ssi;
        // this.fteFinanciera = infoFinanciera.LisBE_Fuente_Financiera;
      }
    );
  }
}
