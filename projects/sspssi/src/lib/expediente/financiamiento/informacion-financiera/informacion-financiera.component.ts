import { Component, OnInit, Input } from '@angular/core';
import { InfoFinancieraService } from 'projects/sspssi/src/servicios/info-financiera.service';
import { ActivatedRoute } from '@angular/router';
import { InformacionFinanciera } from 'projects/sspssi/src/models/response/informacion-financiera';

@Component({
  selector: 'ssi-informacion-financiera',
  templateUrl: './informacion-financiera.component.html',
  styleUrls: ['./informacion-financiera.component.css']
})
export class InformacionFinancieraComponent implements OnInit {

  codigoSnip: number;
  idFase: number;
  @Input() listInfoFinanciera = [];
  infoFinanciera: InformacionFinanciera;
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 10;
  numPaginasMostrar: number = 10;
  infoFinancieraBody = [];

  constructor(private servicio: InfoFinancieraService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.totalRegistros = this.listInfoFinanciera.length;
    this.codigoSnip = this.route.snapshot.params.snip;
    this.idFase = this.route.snapshot.params.idFase;
    if (this.totalRegistros > 0) {
      this.listarMontosTotales(this.listInfoFinanciera);
      this.infoFinanciera = this.paginar(this.listInfoFinanciera, this.numero_Pagina, this.num_filas, this.totalRegistros);
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

  listarInformacionFinanciera(codSnip: number, idFase: number, numfila: number, numPagina: number) {
    this.servicio.listarInformacionFinanciera(codSnip, idFase).subscribe(
      respuesta => {
        let listaInfoFinanciera = JSON.parse(respuesta as any);
        this.totalRegistros = listaInfoFinanciera.LisBE_Info_Financiera.length;
        this.infoFinanciera = this.paginar(listaInfoFinanciera.LisBE_Info_Financiera, numPagina, numfila, this.totalRegistros);
      }
    );
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarInformacionFinanciera(this.codigoSnip, this.idFase, this.num_filas, this.numero_Pagina);
  }

  listarMontosTotales(lista) {
    let pia = 0,
      pim = 0,
      dev = 0,
      ene = 0,
      feb = 0,
      mar = 0,
      abr = 0,
      may = 0,
      jun = 0,
      jul = 0,
      ago = 0,
      set = 0,
      oct = 0,
      nov = 0,
      dic = 0,
      compromisoanual = 0,
      certificadoanual = 0;

    lista.forEach(function (obj) {
      pia += obj.pia;
      pim += obj.pim;
      dev += obj.dev;
      ene += obj.ene;
      feb += obj.feb;
      mar += obj.mar;
      abr += obj.abr;
      may += obj.may;
      jun += obj.jun;
      jul += obj.jul;
      ago += obj.ago;
      set += obj.set;
      oct += obj.oct;
      nov += obj.nov;
      dic += obj.dic;
      compromisoanual += obj.compromisoanual;
      certificadoanual += obj.certificadoanual;
    });

    this.infoFinancieraBody.push({
      "anio": "TOTAL",
      "pia": pia,
      "pim": pim,
      "dev": dev,
      "ene": ene,
      "feb": feb,
      "mar": mar,
      "abr": abr,
      "may": may,
      "jun": jun,
      "jul": jul,
      "ago": ago,
      "set": set,
      "oct": oct,
      "nov": nov,
      "dic": dic,
      "compromisoanual": compromisoanual,
      "certificadoanual": certificadoanual
    });
  }
}
