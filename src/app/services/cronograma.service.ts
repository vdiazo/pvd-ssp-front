import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cronograma } from 'src/app/models/response/cronograma';
import { Settings } from 'src/app/appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {

  constructor(private http: HttpClient) { }


  listarCronogramasPorSeguimientoMonitoreoObra(id_seguimiento_monitoreo_obra : number, nroPagina: number, nroFilas: number){
    const url = Settings.API_ENDPOINT + "api/listarCronogramaEjecucionFinancieraObra?idSeguimientoMonitoreoObra=" + id_seguimiento_monitoreo_obra + "&intSkip=" + nroFilas + "&intTake=" + nroPagina;
    return this.http.get(url);
  }

  listarTipoDefinicionCronogramaObra(idSeguimientoMonitoreoObra: number){
    const url = Settings.API_ENDPOINT + "api/listarTipoDefinicionCronogramaObra?idSeguimientoMonitoreoObra=" + idSeguimientoMonitoreoObra;
    return this.http.get(url);
  }

  registrarCronogramaOld(cronograma : Cronograma){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarCronogramaEjecucionFinancieraObra", entidad);
  }

  registrarCronograma(cronograma : string){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarCronogramaEjecucionFinancieraObra", entidad);
  }

  actualizarCronogramaOld(cronograma : Cronograma){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarCronogramaEjecucionFinancieraObra", entidad);
  }

  actualizarCronograma(cronograma : string){
    let entidad = {
      data : JSON.stringify(cronograma)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarCronogramaEjecucionFinancieraObra", entidad);
  }

  removerCronograma(cronograma : Cronograma){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularCronogramaEjecucionFinancieraObra", entidad);
  }

}
