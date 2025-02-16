import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccionParalizacionExpedienteService {

  constructor(private http: HttpClient) { }

  listarTipoDocumentoAccionParalizacion(): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarTipoDocumentoDetalleExpedienteEjeDirSet`;
    return this.http.get(href);
  }

  listarAccionesParalizacionExpediente(idParalizacion: number, skip: number, take: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarParalizacionAccionExpedienteEjeDirSet?idParalizacionExpediente=${idParalizacion}&intSkip=${skip}&intTake=${take}`;
    return this.http.get(href);
  }

  registrarAccionPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarParalizacionAccionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarAccionPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarParalizacionAccionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularAccionPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularParalizacionAccionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
