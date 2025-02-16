import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class RecepcionObraService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarRecepcionObra(intId_seguimiento_ejecucion_expediente,take,skip):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarLiquidacionRecepcionExpediente?intId_seguimiento_ejecucion_expediente=' +intId_seguimiento_ejecucion_expediente + "&skip=" + skip + "&take=" + take,{ headers: headers });
  }

  registrarRecepcionObra(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarLiquidacionRecepcionExpediente/", entidad,{ headers: headers });
  }

  actualizarRecepcionObra(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarLiquidacionRecepcionExpediente/", entidad,{ headers: headers });
  }

  listarEstadoRecepcionObra():Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarEstadoRecepcion', {headers : headers });
  }

  listarTipoDocumentoRecepcionObra():Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarTipoDocumentoRecepcion',{headers : headers});
  }
  anularRecepcionObra(data: any):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularLiquidacionRecepcionExpediente/", entidad,{ headers:headers});

  }
}
