import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadComponenteService {

  constructor(private http: HttpClient) { }

  listarEspecialidadComponenteExpediente(): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ListarTipoEspecialidadComponenteEjeDirSet`;
    return this.http.get(`${href}`);
  }

  insertarEspecialidadComponenteExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarTipoEspecialidadEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarEspecialidadComponenteExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarTipoEspecialidadEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  anularEspecialidadComponenteExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularTipoEspecialidadEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
