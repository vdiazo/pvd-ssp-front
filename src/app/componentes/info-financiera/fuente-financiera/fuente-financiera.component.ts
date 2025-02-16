import { Component, OnInit, Input } from '@angular/core';
import { InfoFinancieraService } from '../../../services/info-financiera.service';
import { ActivatedRoute } from '@angular/router';
import { FuenteFinanciera } from '../../../models/response/fuente-financiera';

@Component({
  selector: 'app-fuente-financiera',
  templateUrl: './fuente-financiera.component.html',
  styleUrls: ['./fuente-financiera.component.css']
})
export class FuenteFinancieraComponent implements OnInit {
  codigoSnip: number;
  idFase: number;
  @Input() listFteFinanciera = [];
  fteFinanciera: FuenteFinanciera;
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 10;
  numPaginasMostrar: number = 10;
  infoFteFinancieraBody = [];

  constructor(private servicio: InfoFinancieraService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.totalRegistros = this.listFteFinanciera.length;
    this.codigoSnip = this.route.snapshot.params.snip;
    this.idFase = this.route.snapshot.params.idFase;
    if (this.totalRegistros > 0) {
      this.listarMontosTotales(this.listFteFinanciera);
      this.fteFinanciera = this.paginar(this.listFteFinanciera, this.numero_Pagina, this.num_filas, this.totalRegistros);
    }
  }

  paginar(lista: any, numPagina: number, numfila: number, total: number) {
    let listFor = [];
    for (let i = numPagina; i < numPagina + numfila; i++) {
      if (i < total) {
        listFor.push(lista[i]);
      } else {
        i = numPagina + numfila;
      }
    };
    return listFor as any;
  }

  listarInformacionFinanciera(codSnip: number,idFase: number, numfila: number, numPagina: number) {
    this.servicio.listarInformacionFinanciera(codSnip,idFase).subscribe(
      respuesta => {
        let ListaFteFinanciera = JSON.parse(respuesta as any);
        this.totalRegistros = ListaFteFinanciera.LisBE_Fuente_Financiera.length;
        this.fteFinanciera = this.paginar(ListaFteFinanciera.LisBE_Fuente_Financiera, numPagina, numfila, this.totalRegistros);
      }
    );
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarInformacionFinanciera(this.codigoSnip,this.idFase, this.num_filas, this.numero_Pagina);
  }

  listarMontosTotales(lista) {
    let montopim = 0,
      montodev = 0;

    lista.forEach(function (obj) {
      montopim += obj.montopim;
      montodev += obj.montodev;
    });

    this.infoFteFinancieraBody.push({
      "anio": "TOTAL",
      "montopim": montopim,
      "montodev": montodev,
    });
  }
}