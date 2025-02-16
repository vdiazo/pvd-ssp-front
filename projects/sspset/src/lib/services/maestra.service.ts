import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpEvent, HttpErrorResponse,HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Proyecto } from '../../models/proyecto'; 

import { Settings } from '../../appSettings/settings';
//import { AuthService } from '../auth/auth.service';

import { Observable } from 'rxjs/Observable';

import { IUnidadEjecutora, IEstadosSituacionales } from '../../lib/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class MaestraService { 

  constructor(
    private http: HttpClient,
    private httpFile: Http,
    //private authService: AuthService
  ) { }


  /*registrarArchivoData(file: any, tipo: any) {
    let formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    let headers = new Headers()
    //let accessToken = this.authService.getAccessToken();
    //headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.NODE_ENDPOINT + "uploadSingleFile?tipoArchivo=AMPLIACION";
    return this.httpFile.post(apiUrl1, formData, options);
  }*/

  registrarArchivoData(file: any, tipo: any) {
    let formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    let headers = new Headers()
    let accessToken = sessionStorage.getItem("token");
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipo;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  registrarArchivoDataExpediente(file: any, tipo: any) {
    let formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    let headers = new HttpHeaders()
    let accessToken = sessionStorage.getItem("token");
    headers.set("Authorization", `Bearer ${accessToken}`);
    //let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipo;
    return this.http.post(apiUrl1, formData,{
      headers: headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
   
  }

  listarTipoDocumento():Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarTipoDocumento",{ headers: headers});
  }

  listarTipoColegiatura():Observable<any> {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/ListarColegiaturaExpediente",{ headers: headers });
  }

  listarResponsables(idSeguimientoMonitoreoObra) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarResponsableExpediente?intId_seguimiento_monitoreo_obra=" + idSeguimientoMonitoreoObra,{ headers: headers });
  }

  ConsultaTramosPorProyecto(beProyecto: Proyecto): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT_SET + "api/ListarProyectoGeneral?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad);
  }


  /**cronograma */
  listarProgramaEjecucionFinanciera() {
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProgramaEjecucionFinancieraObra");
  }

  listarDocumentoAprobacion() {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarActividadCronogramaExpedienteControl",{headers : headers});
  }

  //valorizacion
  /*listarEstadosSituacional() : Observable<IEstadosSituacionales[]> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IEstadosSituacionales[]>(Settings.API_ENDPOINT_SET + "api/listarValorizacionExpedienteControl",{ headers: headers });
  }*/

  listarEstadosSituacional() : Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarValorizacionExpedienteControl",{ headers: headers });
  }

}
