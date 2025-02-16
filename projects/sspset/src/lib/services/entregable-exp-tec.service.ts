import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class EntregableExpTecService {

  constructor(
    private http:HttpClient
  ) { }

  listarTipoEntregableExpediente(id_seguimiento_ejecucion_expediente : number):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarTipoEntregableExpediente?intIdSegEjecExpediente="+id_seguimiento_ejecucion_expediente, {headers:headers});
  }

  listarEntregableExpediente(id_seguimiento_monitoreo_obra : number, nroPagina: number, nroFilas: number):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    const url = Settings.API_ENDPOINT_SET + "api/listarEntregableExpediente?intIdSeguimientoExpediente=" + id_seguimiento_monitoreo_obra + "&intSkip=" + nroFilas + "&intTake=" + nroPagina;
    return this.http.get(url, {headers:headers});
  }

  obtenerEntregableExpediente(intId_entregable_expediente : number):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    const url = Settings.API_ENDPOINT_SET + "api/obtenerEntregableExpediente?intIdSegEjecExpediente=" + intId_entregable_expediente;
    return this.http.get(url, {headers:headers});
  }




  procesarEntregableExpediente(entregable : string):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(entregable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ProcesarEntregableExpediente", entidad, {headers : headers});
  }

  modificarEntregableExpediente(entregable : string):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers =new HttpHeaders({
      'content-type':'application/json',
      'Authorization':`Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(entregable)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarEntregableExpediente", entidad, {headers : headers});
  }

  anularEntregableExpediente(entregable):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({
      'content-type':'application/json',
      'Authorization':`Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(entregable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularEntregableExpediente", entidad,{headers : headers});
  }


}
