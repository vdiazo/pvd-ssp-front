import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConvenioService } from '../../../services/convenio.service';
import { HttpClient } from '@angular/common/http';
import { _convenio } from '../../../models/Convenio';

@Component({
  selector: 'app-monto-convenio',
  templateUrl: './monto-convenio.component.html',
  styleUrls: ['./monto-convenio.component.css']
})
export class MontoConvenioComponent implements OnInit {
  idFase: number;
  idMunicipalidad: number;
  listConvenio: _convenio;
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  montoTotal: number;

  constructor(private route: ActivatedRoute, private servicio: ConvenioService, private http: HttpClient) { }

  ngOnInit() {
    this.idFase = parseInt(this.route.snapshot.params.idFase);
    this.idMunicipalidad = parseInt(this.route.snapshot.params.idMunicipalidad);
    this.listarConvenio(this.idFase, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }

  listarConvenio(idTramo, idMunicipalidad, numFilas, numPagina) {
    this.servicio.listarConvenioXidFaseXidMunicipalidad(this.idFase, idMunicipalidad, numFilas, numPagina).subscribe(
      respuesta => {
        let rptaConvenio = respuesta as any;
        this.listConvenio = rptaConvenio.data;
        this.montoTotal = rptaConvenio.monto_total;
        this.totalRegistros = rptaConvenio.cantidad_registro;
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarConvenio(this.idFase, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }
}