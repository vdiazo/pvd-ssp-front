import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class MetasProyectoService {

  constructor(private http: HttpClient) { }

  listarMetasProyectoExpediente(idAprobacionExpediente: number, intSkip: number, intTake: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarMetaAprobacionExpedienteEjeDirSet?idAprobacionExpediente=${idAprobacionExpediente}&intSkip=${intSkip}&intTake=${intTake}`;
    return this.http.get(href);
  }

  registrarMetasProyectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarMetaAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarMetasProyectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarMetaAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularMetasProyectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularMetaAprobacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
