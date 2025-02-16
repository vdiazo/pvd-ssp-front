import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Settings } from '../appSettings/settings';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Observable } from "rxjs/Observable";
import { MetodoService } from './metodo.service';
@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient, private httpFile: Http, private metodo: MetodoService) { }

  ValidarConvenio(convenio: any): Observable<any> {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/ValidarConvenioEjeDir', entidad);
  }

  registrarConvenioSosem(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/procesoConvenioEjeDir', entidad);

  }

  eliminarConvenioSosem(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularConvenioEjeDir', entidad);
  }

  BusquedaProyecto(snip, siaf): Observable<any> {

    return this.http.get(Settings.API_ENDPOINT + 'api/ObtenerProyectoEjeDir?cod_snip=' + snip + '&cod_unificado=' + siaf);
  }

  ListarEjecutora(idmuni): Observable<any> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + 'api/listarEjecutora?strIdMunicipalidad=' + idmuni, { headers: headers });
  }

  listarConvenioXidTramoXidMunicipalidad(idTramo: number, idMunicipalidad: number, numFilas, numPaginas): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarConvenioEjeDir/' + idTramo + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas);
  }

  ListarConvenios(snip: number, siaf: number, nomProyecto, nomTramo, idfase: number, nomSiglas, skip: number, take: number): Observable<any> {
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
    return this.metodo._POST(Settings.API_ENDPOINT + 'api/ObtenerConvenioEjeDir', parametros)
  }

  ListarConveniosFiltro(snip: number, cod_unificado: number, nomProyecto, nomTramo, estado_convenio: string, idfase: number, nomSiglas, skip: number, take: number): Observable<any> {
    let entidad = {
      cod_snip: snip,
      cod_unificado: cod_unificado,
      "nombre_proyecto": nomProyecto,
      "nombre_tramo": nomTramo,
      "estado_convenio": estado_convenio,
      id_fase: idfase,
      "siglas": nomSiglas,
      skip: skip,
      take: take
    }
    let parametros = [{ parametro: "data", valor: JSON.stringify(entidad) }]
    return this.metodo._POST(Settings.API_ENDPOINT + 'api/ObtenerConvenioEstadoEjeDir', parametros)
  }

  ListarCompromisos(): Observable<any> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get(Settings.API_ENDPOINT + 'api/listarcompromisoEjeDir', { headers: headers });
  }
  ListarTipoInversion(): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTipoInversionEjeDir');
  }
  ListarBrecha(): Observable<any> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + 'api/listarBrecha', {headers: headers});
  }

  ListarPrograma(): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarProgramaEjeDir');
  }

  registrarArchivo(file: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.convenio;

    return this.httpFile.post(apiUrl1, formData, options);
  }
}
