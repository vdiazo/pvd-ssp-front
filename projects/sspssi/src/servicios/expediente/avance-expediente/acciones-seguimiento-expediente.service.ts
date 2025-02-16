import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccionesSeguimientoExpedienteService {

  constructor(private http: HttpClient) { }

  listarAccionSeguimientoMonitoreoExpediente(idSeguimiento: number, intIdFase: number, intSkip: number, intTake: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ListarAccionSeguimientoEjecucionExpedienteEjeDirSet`;
    return this.http.get(`${href}?intIdFase=${intIdFase}&idSeguimientoEjecucionExpediente=${idSeguimiento}&intSkip=${intSkip}&intTake=${intTake}`);
  }

  listarTipoDocumentoAccionExpediente(): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ListarTipoDocumentoDetalleExpedienteEjeDirSet`;
    return this.http.get(`${href}`);

  }

  insertarAccionSeguimientoMonitoreoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/InsertarAccionSeguimientoEjecucionExpedienteEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  modificarAccionSeguimientoMonitoreoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ModificarAccionSeguimientoEjecucionExpedienteEjeDirSet`;
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(href, formData);
  }

  anularAccionSeguimientoMonitoreoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/anularAccionSeguimientoEjecucionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
