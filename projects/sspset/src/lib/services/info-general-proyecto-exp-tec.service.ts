import { Injectable,ɵConsole } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Proyecto } from '../../models/proyecto'; 
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class InfoGeneralProyectoExpTecService {

  constructor(private http: HttpClient) { }

  ListarInfoProyectoExpTecnico(snip): Observable<any>{
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get( Settings.API_ENDPOINT_SET + 'api/listarInfoProyecto?strCodigoUnico=' + snip,{headers : headers});
  }
  /*ConsultaTramosPorProyecto(beProyecto: Proyecto): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarProyectoGeneral?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad);
  }*/

  listarInformacionFinanciera(codSnip: any, idFase: any): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarFuenteFinanciera?strCodigoSnip=" + codSnip + "&intIdFase="+ idFase);
  }
}
