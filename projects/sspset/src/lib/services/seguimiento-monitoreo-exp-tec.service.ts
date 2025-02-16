import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';

import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class SeguimientoMonitoreoExpTecService {

  constructor(
    private http:HttpClient,
  ) { }

  listarSeguimientoMonitoreo(data: any, bEstado: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarSeguimientoMonitoreoObra?strIdSeguimientoMonitoreoObra=' + data + '&blEstado=' + bEstado,{ headers: headers});
  }


  listarSeguimientoEjecucionExpediente(data: any, bEstado: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarSeguimientoEjecucionExpediente?strId_seguimiento_ejecucion_expediente=' + data + '&estado=' + bEstado,{ headers: headers });
  }                                                     

  insertarSeguimientoEjecucionExpediente(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarSeguimientoEjecucionExpediente/", entidad,{ headers: headers });
  }

  /*registrarSeguimientoFaseMonitoreo(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/procesoSeguimientoMonitoreoObra/", entidad);
  }*/

  modificarSeguimientoEjecucionExpediente(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarSeguimientoEjecucionExpediente/", entidad,{ headers: headers });
  }

  AnularSeguimientoEjecucionExpediente(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularSeguimientoEjecucionExpediente", entidad,{ headers: headers })
  }

  insertarContenidoExpediente(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarContenidoExpediente/", entidad,{ headers: headers });
  }
}
