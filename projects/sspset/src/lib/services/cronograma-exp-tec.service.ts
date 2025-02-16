import { Injectable } from '@angular/core';
import { Settings } from '../../appSettings/settings';
import { Cronograma } from '../../models/response/cronograma';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CronogramaExpTecService {

  constructor(private http:HttpClient) { }

  // listarCronogramasPorSeguimientoMonitoreoObra(id_seguimiento_monitoreo_obra : number, nroPagina: number, nroFilas: number){
  //   let token = sessionStorage.getItem("token");
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   })
  //   const url = Settings.API_ENDPOINT_SET + "api/listarActividadCronogramaExpediente?intIdSegEjecExpediente=" + id_seguimiento_monitoreo_obra + "&intSkip=" + nroFilas + "&intTake=" + nroPagina;
  //   return this.http.get(url, {headers: headers});
  // }

  listarTipoDefinicionCronogramaObra(idSeguimientoMonitoreoObra: number){
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    //const url = Settings.API_ENDPOINT + "api/listarTipoDefinicionCronogramaObra?idSeguimientoMonitoreoObra=" + idSeguimientoMonitoreoObra;
    const url = Settings.API_ENDPOINT_SET + "api/listarTipoDefinicionCronogramaExpediente?intIdSegEjecExpediente=" + idSeguimientoMonitoreoObra;
    return this.http.get(url, {headers : headers});
  }

  registrarCronogramaOld(cronograma : Cronograma){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarCronogramaEjecucionFinancieraObra", entidad);
  }

  registrarCronograma(cronograma : string,file: any){
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Actividad_Ejecucion_Expediente', JSON.stringify(cronograma));
    formData.append("fileUpload0", file.file, file.nombre);

    /*let entidad = {
      data : JSON.stringify(cronograma)
    }*/

    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarActividadCronogramaExpediente", formData, {headers : headers});
  }

  actualizarCronogramaOld(cronograma : Cronograma){
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarCronogramaEjecucionFinancieraObra", entidad);
  }

  actualizarCronograma(cronograma : string,file: any){
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Actividad_Ejecucion_Expediente', JSON.stringify(cronograma));
    if (file != null || file !=undefined) {
      formData.append("fileUpload0", file.file, file.nombre);
    }

    /*let entidad = {
      data : JSON.stringify(cronograma)
    }*/

    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarActividadCronogramaExpediente", formData, {headers : headers});
  }

  removerCronograma(cronograma){
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data : JSON.stringify(cronograma)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularActividadCronogramaExpediente", entidad, {headers : headers});
  }
}