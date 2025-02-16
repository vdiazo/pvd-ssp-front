import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class EntregaTerrenoService {

  constructor(private http: HttpClient) { }

  listarEntregaTerreno(idSeguimiento: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarTerrenoExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdSeguimientoEjecucionExpediente=${idSeguimiento}&skip=${num_filas}&take=${numero_Pagina}`);
  }

  registrarEntregaTerreno(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarTerrenoEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  modificarEntregaTerreno(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarTerrenoEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  anularEntregaTerreno(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularTerrenoEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
