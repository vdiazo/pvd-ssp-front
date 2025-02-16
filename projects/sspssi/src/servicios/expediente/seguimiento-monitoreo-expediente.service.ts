import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from 'projects/sspssi/src/appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoMonitoreoExpedienteService {

  constructor(private http: HttpClient) { }

  listarSeguimientoMonitoreoExpediente(id_seguimiento_expediente: number, bEstado: boolean): Observable<any> {
    return this.http.get(`${Settings.API_ENDPOINT}api/listarSeguimientoEjecucionExpedienteEjeDirSet?strId_seguimiento_ejecucion_expediente=${id_seguimiento_expediente}&estado=${bEstado}`);
  }

  registrarSeguimientoMonitoreoExpediente(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/insertarSeguimientoEjecucionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }

  modificarSeguimientoMonitoreo(data: any): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/modificarSeguimientoEjecucionExpedienteEjeDirSet`;
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(href, entidad);
  }
}
