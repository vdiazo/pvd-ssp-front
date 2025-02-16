import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProcesoLiquidacionService {

  constructor(private http: HttpClient) { }


  listarRegistroExpediente(idFase): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarContenidoExpediente?intIdFase=" + idFase, { headers: headers });
  }

  descargaComponentes(param): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarexpedienteexportar?strJson=" + JSON.stringify(param), { headers: headers });
  }


  insertarContenidoExpediente(expediente: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = { data: JSON.stringify(expediente) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/InsertarContenidoExpediente', entidad, { headers: headers });
  }

  insertarContenidoExpedienteArchivo(archivo: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = { data: JSON.stringify(archivo) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/InsertarContenidoExpedienteArchivo', entidad, { headers: headers });
  }

  modificarContenidoExpediente(expediente: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = { data: JSON.stringify(expediente) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/modificarContenidoExpediente', entidad,{ headers: headers });
  }

  anularContenidoExpedienteArchivo(archivo: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = { data: JSON.stringify(archivo) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/AnularContenidoExpedienteArchivo', entidad, { headers: headers });
  }

  listarEstadoLiquidacion(): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarEstadoLiquidacionExpediente", { headers: headers });
  }

  listarTipoDocumentoLiquidacion(): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarTipoDocumentoLiquidacionExpediente", { headers: headers });
  }

  ListarLiquidacionPaginado(idobra, skip, take): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarLiquidacionSeguimientoExpediente/" + idobra + "/" + skip + "/" + take, { headers: headers });
  }

  registrarLiquidacion(liquidacion: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/insertarLiquidacionSeguimientoExpediente', entidad, { headers: headers });
  }

  editarLiquidacion(liquidacion: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/modificarLiquidacionSeguimientoExpediente', entidad, { headers: headers });
  }

  anularLiquidacion(liquidacion: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/anularLiquidacionSeguimientoExpediente', entidad, { headers: headers });
  }

  insertarContenidoNoCorresponde(expediente: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = { data: JSON.stringify(expediente) }
    return this.http.post(Settings.API_ENDPOINT_SET + 'api/InsertarContenidoNoCorresponde', entidad,{ headers: headers });
  }
}
