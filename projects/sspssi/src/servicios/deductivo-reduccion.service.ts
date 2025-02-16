import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DeductivoReduccionService {

  constructor(private http: HttpClient) { }

  listarDeductivoReduccion(id_seguimiento_monitoreo_obra: number, num_filas: number, numero_Pagina: number):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarDeductivoReduccionObraEjeDir/" + id_seguimiento_monitoreo_obra + "/" + num_filas + "/" + numero_Pagina);
  }

  registrarDeductivoReduccion(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarDeductivoReduccionObraEjeDir/", entidad);
  }

  actualizarDeductivoReduccion(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarDeductivoReduccionObraEjeDir/", entidad)
  }

  eliminarDeductivoReduccion(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularDeductivoReduccionObraEjeDir", entidad)
  }
}
