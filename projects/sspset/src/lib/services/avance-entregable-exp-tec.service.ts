import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class AvanceEntregableExpTecService {

  constructor(
    private http:HttpClient
  ) { }

  listarAvanceEntregable(id_seguimiento_ejecucion_expediente : number,nroPagina: number, nroFilas: number):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarAvanceEntregable?intIdSeguimientoExpediente="+id_seguimiento_ejecucion_expediente+"&intSkip="+nroFilas+"&intTake="+nroPagina, {headers:headers});
  }

  listarEntregableDetalleExpedienteEntregable(id_seguimiento_actividad : number):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarEntregableDetalleExpedienteEntregable?intIdSeguimientoActividad="+id_seguimiento_actividad, {headers:headers});
  }

  listarSeguimientoActividadTipoAvance(id_seguimiento_ejecucion_expediente : number):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarSeguimientoActividadTipoAvance?idSeguimientoEjecucionExpediente="+id_seguimiento_ejecucion_expediente, {headers:headers});
  }



  insertarAvanceEntregable(AvanceEntregable : string):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(AvanceEntregable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarAvanceEntregable", entidad, {headers : headers});
  }

  modificarAvanceEntregable(AvanceEntregable : string):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(AvanceEntregable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarAvanceEntregable", entidad, {headers : headers});
  }

  anularAvanceEntregable(AvanceEntregable):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({
      'Authorization':`Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(AvanceEntregable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularAvanceEntregable", entidad,{headers : headers});
  }


}
