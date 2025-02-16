import { Injectable } from '@angular/core';
import { Settings } from '../../appSettings/settings';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AccionSeguimientoMonitoreo } from '../../models/response/seguimiento-monitoreo-accion';

import { Http, RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';

import { IAccionSeguimientoMonitoreo } from '../Interfaces/IAccionSeguimientoMonitoreo';
import { IPeriodosValorizaciones } from '../Interfaces/IPeriodosValorizaciones';

@Injectable({
  providedIn: 'root'
})
export class ValorizacionesService {

  constructor(private http:HttpClient, private httpFile:Http) { }

  // listarValorizaciones(idSeguimientoMonitoreo: number, skip: number, take: number): Observable<IAccionSeguimientoMonitoreo> {
  //   let token = sessionStorage.getItem("token");
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   })
  //   return this.http.get<IAccionSeguimientoMonitoreo>(Settings.API_ENDPOINT_SET + 'api/listarValorizacionExpediente?intIdSegExpediente=' + idSeguimientoMonitoreo + '&intSkip=' + skip + '&intTake=' + take, {headers: headers });
  // }

  listarPeriodos(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra): Observable<IPeriodosValorizaciones> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IPeriodosValorizaciones>(Settings.API_ENDPOINT_SET + 'api/listarValorizacionExpedientePeriodo?intIdSegExpediente=' + idSeguimientoMonitoreoObra + "&intIdSegValorizacion=" + idAccionSeguimientoMonitoreoObra,{ headers: headers });
  }

  validarValorizacionesMonto(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra, tipoAvance, idEstadoSituacional, monto) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let url = Settings.API_ENDPOINT_SET + 'api/validarMontoValorizacion?intIdSegExpediente=' + idSeguimientoMonitoreoObra + "&intSegValorizacion=" + idAccionSeguimientoMonitoreoObra + "&intEstSitValorizacion=" + idEstadoSituacional +  "&intTipoAvance=" + tipoAvance +"&decMonto=" + monto;
    return this.http.get(url, {headers : headers});
  }

  eliminarValorizacion(data: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularValorizacionExpediente", entidad, {headers : headers})
  }

  registrarValorizacion(data: AccionSeguimientoMonitoreo) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarAccionSeguimientoMonitoreoObra", entidad);
  }

  registrarValorizacionConArchivos(data: any, arrArchivosEnvio = [], file:any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Ssppvd_Valorizacion_Ejecucion_Expediente', JSON.stringify(data));

    //if (file != null || file !=undefined) {
      formData.append("uploadFile0", file.file, file.nombre);
    //}
    
    
    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + (i+1).toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarValorizacionExpediente", formData, {headers : headers});
  }

  ModificarValorizacion(data: AccionSeguimientoMonitoreo) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarAccionSeguimientoMonitoreoObra", entidad);
  }

  ModificarValorizacionConArchivos(data: any, arrArchivosEnvio = [], archivosEliminado = [],file:any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Ssppvd_Valorizacion_Ejecucion_Expediente', JSON.stringify(data));
    //if(archivosEliminado?)
    //if(archivosEliminado.length!= 0){
      formData.append('archivosEliminados',JSON.stringify(archivosEliminado));
    //}
    
    if (file != null || file !=undefined) {
      formData.append("uploadFile0", file.file, file.nombre);
    }

    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + (i+1).toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarValorizacionExpediente", formData, {headers : headers});
  }

  actualizarIncluirEnAyudaMemoria(id_accion_seguimiento_monitoreo_obra_archivo: number, selecciona_foto: boolean, usuarioModificacion: string){
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = {
      data: JSON.stringify({
        "id_valorizacion_ejecucion_expediente_archivo": id_accion_seguimiento_monitoreo_obra_archivo,
        "selecciona_foto": selecciona_foto,
        "usuario_modificacion": usuarioModificacion
      })
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarArchivosValorizacionExpediente", entidad, {headers : headers});
  }

  registrarArchivo(file: any):Observable<any> {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipoArchivo.valorizaciones;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}