import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cronograma } from '../models/response/cronograma';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {

  constructor(private http: HttpClient) { }


  listarCronogramasPorSeguimientoMonitoreoObra(id_seguimiento_monitoreo_obra : number, nroPagina: number, nroFilas: number): Observable<any>{
    const url = Settings.API_ENDPOINT + "api/listarCronogramaEjecucionFinancieraObraEjeDir?idSeguimientoMonitoreoObra=" + id_seguimiento_monitoreo_obra + "&intSkip=" + nroFilas + "&intTake=" + nroPagina;
    return this.http.get(url);
  }

  listarTipoDefinicionCronogramaObra(idSeguimientoMonitoreoObra: number): Observable<any>{
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    const url = Settings.API_ENDPOINT + "api/listarTipoDefinicionCronogramaObraEjeDir?idSeguimientoMonitoreoObra=" + idSeguimientoMonitoreoObra ;
    return this.http.get(url, {headers: headers});
  }

  registrarCronogramaOld(cronograma : Cronograma): Observable<any>{
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarCronogramaEjecucionFinancieraObraEjeDir", entidad);
  }

  registrarCronograma(cronograma : string): Observable<any>{
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarCronogramaEjecucionFinancieraObraEjeDir", entidad);
  }

  actualizarCronogramaOld(cronograma : Cronograma): Observable<any>{
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarCronogramaEjecucionFinancieraObraEjeDir", entidad);
  }

  actualizarCronograma(cronograma : string): Observable<any>{
    let entidad = {
      data : JSON.stringify(cronograma)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarCronogramaEjecucionFinancieraObraEjeDir", entidad);
  }

  removerCronograma(cronograma : Cronograma): Observable<any>{
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularCronogramaEjecucionFinancieraObraEjeDir", entidad);
  }

}
