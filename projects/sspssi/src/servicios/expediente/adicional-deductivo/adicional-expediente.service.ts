import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdicionalExpedienteService {

  constructor(private http: HttpClient) { }

  listarAdicionalExpediente(id_seguimiento_expediente: number, num_filas?: number, numero_Pagina?: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAdicionalExpedienteEjeDirSet?intIdSeguimientoEjecucion=${id_seguimiento_expediente}&intSkip=${num_filas}&intTake=${numero_Pagina}`;
    return this.http.get(href);
  }

  registrarAdicionalExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarAdicionalExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  actualizarAdicionalExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarAdicionalExpendienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularAdicionalExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularAdicionalExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
