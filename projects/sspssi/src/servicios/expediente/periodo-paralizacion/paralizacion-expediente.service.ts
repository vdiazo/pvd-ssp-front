import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionExpedienteService {

  constructor(private http: HttpClient) { }

  listarParalizacionesExpediente(idSeguimiento: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarParalizacionExpedienteEjeDirSet`;
    return this.http.get(`${href}?idSeguimientoEjecucionExpediente=${idSeguimiento}&intSkip=${num_filas}&intTake=${numero_Pagina}`);
  }

  registrarPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarParalizacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarParalizacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularPeriodoParalizacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularParalizacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
