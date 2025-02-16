import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class ResponsableElaboracionExpedienteService {

  constructor(private http:HttpClient) { }

  listarCombosResponsable():Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET +"api/ListarCombosResponsable",{ headers: headers });
  }

  listarResponsableSeguimientoExpediente(idSeguimiento,intSkip,intTake):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET +"api/listarResponsableSeguimientoExpediente?intIdSeguimientoEjecucionExpediente="+idSeguimiento+"&intSkip="+intSkip+"&intTake="+intTake,{ headers: headers });
  }

  insertarResponsableSeguimientoExpediente(responsable:any):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(responsable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarResponsableSeguimientoExpediente", entidad, {headers : headers});
  }

  modificarResponsableExpedienteTecnico(responsable : any):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers =new HttpHeaders({
      'content-type':'application/json',
      'Authorization':`Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(responsable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarResponsableExpedienteTecnico", entidad, {headers : headers});
  }
  
  anularResponsableSeguimientoExpediente(responsable):Observable<any>{
    let token=sessionStorage.getItem("token");
    const headers=new HttpHeaders({
      'content-type':'application/json',
      'Authorization':`Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(responsable)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularResponsableSeguimientoExpediente", entidad,{headers : headers});
  }

}
