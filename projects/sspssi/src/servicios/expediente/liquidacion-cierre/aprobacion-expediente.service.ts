import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AprobacionExpedienteService {

  constructor(private http: HttpClient) { }

  listarAprobacionExpediente(id_seguimientoExpediente: number, skip: number, take: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAprobacionExpedienteEjeDirSet?intId_seguimiento_ejecucion_expediente=${id_seguimientoExpediente}&skip=${skip}&take=${take}`;
    return this.http.get(href);
  }

  registrarAprobacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/InsertarAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarAprobacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ModificarAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularAprobacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/AnularAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
