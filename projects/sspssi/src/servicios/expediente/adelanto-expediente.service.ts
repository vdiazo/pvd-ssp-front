import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdelantoExpedienteService {

  constructor(private http: HttpClient) { }

  listarAdelantoDirectoExpediente(idSeguimiento: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAdelantoDirectoExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoEjecucionExpediente=${idSeguimiento}&skip=${num_filas}&take=${numero_Pagina}`);
  }

  registrarAdelantoDirectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarAdelantoDirectoEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  modificarAdelantoDirectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarAdelantoDirectoEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  anularAdelantoDirectoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularAdelantoDirectoEjeDirSet`;
    let entidad = {
      data: JSON.stringify(data)
    };
    return this.http.post(href, entidad);
  }
}
