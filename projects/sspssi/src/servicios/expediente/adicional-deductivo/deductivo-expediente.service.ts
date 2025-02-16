import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DeductivoExpedienteService {

  constructor(private http: HttpClient) { }

  listarDeductivoExpediente(id_seguimiento_expediente: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarDeductivoExpedienteEjeDirSet?intIdSeguimientoExpediente=${id_seguimiento_expediente}&intSkip=${num_filas}&intTake=${numero_Pagina}`;
    return this.http.get(href);
  }

  registrarDeductivoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarDeductivoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  actualizarDeductivoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarDeductivoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularDeductivoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularDeductivoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
