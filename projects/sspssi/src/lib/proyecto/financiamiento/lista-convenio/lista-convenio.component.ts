import { Component, OnInit } from '@angular/core';
import { _convenio } from 'projects/sspssi/src/models/Convenio';
import { ActivatedRoute } from '@angular/router';
import { ConvenioService } from 'projects/sspssi/src/servicios/convenio.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ssi-lista-convenio',
  templateUrl: './lista-convenio.component.html',
  styleUrls: ['./lista-convenio.component.css']
})
export class ListaConvenioComponent implements OnInit {

  idTramo: number;
  idMunicipalidad: number;
  listConvenio: _convenio;
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;

  constructor(private route: ActivatedRoute, private servicio: ConvenioService, private http: HttpClient) { }

  ngOnInit() {
    this.idTramo = parseInt(this.route.snapshot.params.idTramo);
    this.idMunicipalidad = parseInt(this.route.snapshot.params.idMunicipalidad);
    this.listarConvenio(this.idTramo, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }

  listarConvenio(idTramo, idMunicipalidad, numFilas, numPagina) {
    this.servicio.listarConvenioXidTramoXidMunicipalidad(idTramo, idMunicipalidad, numFilas, numPagina).subscribe(
      respuesta => {
        let rptaConvenio = respuesta as any;
        this.listConvenio = rptaConvenio.data;
        this.totalRegistros = rptaConvenio.cantidad_registro;
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarConvenio(this.idTramo, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }
}
