import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Settings } from '../../appSettings/settings';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import { Observable } from "rxjs/Observable";
import { MetodoService } from './metodo.service';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient, private httpFile: Http, private metodo:MetodoService) { }

  /*ValidarConvenio(convenio: any): Observable<any> {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/ValidarConvenioEjeDir', entidad);
  }*/

  /*eliminarConvenioSosem(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularConvenioEjeDir', entidad);
  }*/

  BusquedaProyecto(snip, siaf): Observable<any> {

    return this.http.get(Settings.API_ENDPOINT_SET + 'api/ObtenerProyectoEjeDir?cod_snip=' + snip + '&cod_unificado=' + siaf);
  }

  ListarEjecutora(idmuni): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarEjecutora?strIdMunicipalidad=' + idmuni);
  }

  listarConvenioXidTramoXidMunicipalidad(idFase: number, idMunicipalidad: number, numFilas, numPaginas): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarConvenio/' + idFase + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas,{headers:headers});
  }

  ListarConvenios(snip: number, siaf: number, nomProyecto, nomTramo, idfase: number, nomSiglas, skip: number, take: number): Observable<any> {
    let token = sessionStorage.getItem("token");
    let entidad = {
      cod_snip: snip,
      cod_unificado: siaf,
      "nombre_proyecto": nomProyecto,
      "nombre_tramo": nomTramo,
      id_fase: idfase,
      "siglas": nomSiglas,
      skip: skip,
      take: take
    }
    let parametros = [{ parametro: "data", valor: JSON.stringify(entidad) }]
    return this.metodo._POST(Settings.API_ENDPOINT_SET + 'api/ObtenerConvenioEjeDir', parametros)
  }

  ListarCompromisos(): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarcompromisoEjeDir', { headers: headers });
  }
  ListarTipoInversion(): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarTipoInversionEjeDir');
  }
  ListarBrecha(): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarBrecha', {headers: headers});
  }

  ListarPrograma(): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarProgramaEjeDir');
  }

  registrarArchivo(file: any): Observable<any> {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipoArchivo.convenio;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
