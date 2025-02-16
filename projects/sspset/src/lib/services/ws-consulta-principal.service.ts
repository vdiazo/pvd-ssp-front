import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class WsConsultaPrincipalService {

  constructor(private http: HttpClient) {
  }

  /*wsConsultaPrincipal(beProyecto: Proyecto) {
    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }

    let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneral?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;
    
    return this.http.get(url);
  }*/
  
  /*wsConsultaAutocompletadoPrincipal(beProyecto: Proyecto) : Observable<IBusquedaProyecto> {
    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }
    return this.http.get<IBusquedaProyecto>(Settings.API_ENDPOINT + "api/ListarProyectoFiltro?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad);
  }*/

 /* wsConsultaTramosPorProyecto(idProyecto: number,beProyecto: Proyecto) {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarProyectoGeneralTramo?intIdProyecto=" + idProyecto + "&intIdMunicipalidad=" + beProyecto.id_municipalidad + "&strNombreTramo=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&strCodDepartamento=" + beProyecto.coddepa);
  }*/

  getProyecto(idProyecto: number,idTramo: number): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProyecto?id_proyecto=" + idProyecto + "&id_tramo=" + idTramo,{ headers: headers });
  }

  /*listarTipoFases() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoFase");
  }*/

  /*exportarSeguimientoMonitoreo(model){
    return this.http.get(Settings.API_ENDPOINT + "api/listarSeguimientoFisicoFinanciero?intIdTramo=" + model.id_tramo + "&intCodigoSnip=" + model.cod_snip + "&intCodigoUnico=" + model.cod_unificado);
  }*/

  /*exportarSeguimientoMonitoreoGeneral(model : Proyecto){
    if (model.cod_snip_texto == "") {
      model.cod_snip = 0;
    } else {
      model.cod_snip = parseInt(model.cod_snip_texto);
    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarSeguimientoFisicoFinancieroGeneral?intCodSnip=" + model.cod_snip + "&strNombreProyecto=" + model.nombre_proyecto + "&intIdMunicipalidad=" + model.id_municipalidad + "&intIdUsuario=" + model.id_usuario + "&intIdPerfil=" + model.id_perfil);
  }*/
}

