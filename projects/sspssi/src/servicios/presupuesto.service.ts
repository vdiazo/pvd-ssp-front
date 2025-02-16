import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  constructor(private http: HttpClient) { }

  listar(IdSeguimientoMonitoreoObra: number, intSkip: number, intTake: number): Observable<any> {
    let url = Settings.API_ENDPOINT + "api/listarPresupuestoAdicionalObraEjeDir/" + IdSeguimientoMonitoreoObra + "/" + intSkip + "/" + intTake;
    return this.http.get(url);
  }

  grabar(data): Observable<any> {
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarPresupuestoAdicionalObraEjeDir", entity);
  }

  actualizar(data): Observable<any> {
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarPresupuestoAdicionalObraEjeDir", entity);
  }

  eliminar(data): Observable<any> {
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/anularPresupuestoAdicionalObraEjeDir", entity);
  }

}
