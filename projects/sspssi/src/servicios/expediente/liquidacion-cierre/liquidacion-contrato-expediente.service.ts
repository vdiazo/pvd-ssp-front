import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionContratoExpedienteService {

  constructor(private http: HttpClient) { }

  listarLiquidacionExpediente(id_seguimientoExpediente: number, skip: number, take: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarLiquidacionSeguimientoExpedienteEjeDirSet?intIdSeguimientoEjecucionExpediente=${id_seguimientoExpediente}&intSkip=${skip}&intTake=${take}`;
    return this.http.get(href);
  }

  registrarLiquidacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarLiquidacionSeguimientoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarLiquidacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarLiquidacionSeguimientoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularLiquidacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularLiquidacionSeguimientoExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
