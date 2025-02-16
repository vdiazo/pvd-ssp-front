import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionExpedienteService {

  constructor(private http: HttpClient) { }

  listarAmpliacionExpediente(idSeguimiento: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAmpliacionExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoEjecucionExpediente=${idSeguimiento}&intSkip=${num_filas}&intTake=${numero_Pagina}`);
  }

  registrarAmpliacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/InsertarAmpliacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarAmpliacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ModificarAmpliacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularAmpliacionExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/AnularAmpliacionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
