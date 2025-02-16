import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CronogramaAvanceService {

  constructor(private http: HttpClient) { }

  listarTipoDocumentoAprobCronogramaExpediente(idSeguimiento: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarTipoInformeExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSegEjecExpediente=${idSeguimiento}`);
  }

  listarTipoDocumentoAprobCronogramaExpedienteMod(idSeguimiento: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarSeguimientoActividadTipoAvanceEjeDirSet`;
    return this.http.get(`${href}?idSeguimientoEjecucionExpediente=${idSeguimiento}`);
  }

  listarTipoComponenteExpediente(idSeguimiento: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarTipoComponenteExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSegEjecExpediente=${idSeguimiento}`);
  }

  listarCronogramaExpediente(idSeguimiento: number, skip: number, take: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarCronogramaExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoExpediente=${idSeguimiento}&intSkip=${skip}&intTake=${take}`);
  }

  insertarCronogramaExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ProcesarCronogramaExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarCronogramaExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ProcesarCronogramaExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
  
  anularCronogramaExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ProcesarCronogramaExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
