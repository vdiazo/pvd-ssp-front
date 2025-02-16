import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Proyecto } from '../models/request/proyecto-request';
import { Observable } from 'rxjs/Observable';
import { Settings } from '../appSettings/settings';
import { IBusquedaProyecto } from '../interfaces/IBusquedaProyecto';

@Injectable({
  providedIn: 'root'
})
export class WsConsultaPrincipalService {

  constructor(private http: HttpClient) {
  }

  wsConsultaPrincipal(beProyecto: Proyecto) {

    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }

    let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneralEjeDir?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;

    return this.http.get(url, { headers: headers });
  }

  wsConsultaPrincipalExpediente(beProyecto: Proyecto) {

    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }

    let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneralExpedienteTecnicoEjeDir?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;

    return this.http.get(url, { headers: headers });
  }

  wsConsultaPrincipalExpedienteFiltro(beProyecto: Proyecto) {

    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }

    // let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneralExpedienteTecnicoEjeDir?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;
    let url = `${Settings.API_ENDPOINT}api/ListarProyectoGeneralExpedienteTecnicoFiltroEstadoEjeDir?intCodSnip=${beProyecto.cod_snip}&strNombreProyecto=${beProyecto.nombre_proyecto}&intIdUsuario=${beProyecto.id_usuario}&intIdPerfil=${beProyecto.id_perfil}&intIdMunicipalidad=${beProyecto.id_municipalidad}&strCodDepartamento=${beProyecto.coddepartamento}&intIdTipoFase=${beProyecto.id_fase}&strEstado=${beProyecto.codigo_estado}&intSkip=${beProyecto.num_filas}&intTake=${beProyecto.num_pagina}`;

    return this.http.get(url, { headers: headers });
  }

  wsConsultaAutocompletadoPrincipal(beProyecto: Proyecto): Observable<IBusquedaProyecto> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }
    return this.http.get<IBusquedaProyecto>(Settings.API_ENDPOINT + "api/ListarProyectoFiltroEjeDir?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad, { headers: headers });
  }

  // wsConsultaAutocompletadoPrincipal(searchTerm: string, ) : Observable<IBusquedaProyecto> {
  //   if (beProyecto.cod_snip_texto == "") {
  //     beProyecto.cod_snip = 0;
  //   } else {
  //     beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
  //   }
  //   return this.http.get<IBusquedaProyecto>(Settings.API_ENDPOINT + "api/ListarProyectoFiltro?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad);
  // }

  wsConsultaTramosPorProyecto(idProyecto: number, beProyecto: Proyecto) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/ListarProyectoGeneralTramoEjeDir?intIdProyecto=" + idProyecto + "&intIdMunicipalidad=" + beProyecto.id_municipalidad + "&strNombreTramo=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&strCodDepartamento=" + beProyecto.coddepa, { headers: headers });
  }

  getProyecto(idProyecto: number, idTramo: number) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarProyectoEjeDir?id_proyecto=" + idProyecto + "&id_tramo=" + idTramo, { headers: headers });
  }

  listarTipoFases() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoFaseEjeDir");
  }

  exportarSeguimientoMonitoreo(model) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarSeguimientoFisicoFinancieroEjeDir?intIdTramo=" + model.id_tramo + "&intCodigoSnip=" + model.cod_snip + "&intCodigoUnico=" + model.cod_unificado, { headers: headers });
  }

  exportarSeguimientoMonitoreoGeneral(model: Proyecto) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    if (model.cod_snip_texto == "") {
      model.cod_snip = 0;
    } else {
      model.cod_snip = parseInt(model.cod_snip_texto);
    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarSeguimientoFisicoFinancieroGeneralEjeDir?intCodSnip=" + model.cod_snip + "&strNombreProyecto=" + model.nombre_proyecto + "&intIdMunicipalidad=" + model.id_municipalidad + "&intIdUsuario=" + model.id_usuario + "&intIdPerfil=" + model.id_perfil, { headers: headers });
  }

  cargarDashboard(beProyecto: Proyecto) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }

    let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneralDashboard?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;

    return this.http.get(url, { headers: headers });
  }
}