import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class AvanceSeguimientoExpedienteService {

  constructor(private http: HttpClient) { }

  listarComboEntregableExpediente(idSeguimiento: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarNumeroInformeEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoExpediente=${idSeguimiento}`);
  }

  listarAvanceEntregableExpediente(idSeguimiento: number, codSnip: number, idFase: number, skip: number, take: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAvanceInformeEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoExpediente=${idSeguimiento}&intIdCodSnip=${codSnip}&intIdFase=${idFase}&intSkip=${skip}&intTake=${take}`);
  }

  insertarAvanceEntregableExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/InsertarAvanceInformeEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarAvanceEntregableExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ModificarAvanceInformeEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularAvanceEntregableExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/AnularAvanceInformeEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
