import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { AccionSeguimientoMonitoreo } from '../models/response/seguimiento-monitoreo-accion';
import { Http, RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';
import { IAccionSeguimientoMonitoreo } from '../Interfaces';
import { IPeriodosValorizaciones } from '../Interfaces/IPeriodosValorizaciones';

@Injectable({
  providedIn: 'root'
})
export class ValorizacionesService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarValorizaciones(idSeguimientoMonitoreo: number, skip: number, take: number): Observable<IAccionSeguimientoMonitoreo> {
    return this.http.get<IAccionSeguimientoMonitoreo>(Settings.API_ENDPOINT + 'api/listarAccionSeguimientoMonitoreoObra/' + idSeguimientoMonitoreo + '/' + skip + '/' + take);
  }

  listarPeriodos(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra): Observable<IPeriodosValorizaciones> {
    return this.http.get<IPeriodosValorizaciones>(Settings.API_ENDPOINT + 'api/listarSeguimientoMonitoreoObraRangoFecha?strIdSeguimientoMonitoreoObra=' + idSeguimientoMonitoreoObra + "&strIdAccionSeguimientoMonitoreoObra=" + idAccionSeguimientoMonitoreoObra);
  }

  validarValorizacionesMonto(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra, tipoAvance, idEstadoSituacional, monto) {
    let url = Settings.API_ENDPOINT + 'api/ValidarSeguimientoMonitoreoObraMonto?strIdSeguimientoMonitoreoObra=' + idSeguimientoMonitoreoObra + "&strIdAccionSeguimientoMonitoreoObra=" + idAccionSeguimientoMonitoreoObra + "&strTipoAvance=" + tipoAvance + "&strIdEstadoSituacional=" + idEstadoSituacional + "&strMonto=" + monto;
    return this.http.get(url);
  }

  eliminarValorizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAccionSeguimientoMonitoreoObra", entidad)
  }

  registrarValorizacion(data: AccionSeguimientoMonitoreo) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionSeguimientoMonitoreoObra", entidad);
  }

  registrarValorizacionConArchivos(data: any, arrArchivosEnvio = []) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    
    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + i.toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionSeguimientoMonitoreoObra", formData);
  }

  ModificarValorizacion(data: AccionSeguimientoMonitoreo) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionSeguimientoMonitoreoObra", entidad);
  }

  ModificarValorizacionConArchivos(data: any, arrArchivosEnvio = [], archivosEliminado = []) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    formData.append('archivosEliminados', JSON.stringify(archivosEliminado))

    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + i.toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionSeguimientoMonitoreoObra", formData);
  }

  actualizarIncluirEnAyudaMemoria(id_accion_seguimiento_monitoreo_obra_archivo: number, selecciona_foto: boolean, usuarioModificacion: string){
    let entidad = {
      data: JSON.stringify({
        "id_accion_seguimiento_monitoreo_obra_archivo": id_accion_seguimiento_monitoreo_obra_archivo,
        "selecciona_foto": selecciona_foto,
        "usuario_modificacion": usuarioModificacion
      })
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarArchivosAccionSeguimientoMonitoreoObra", entidad);
  }

  registrarArchivo(file: any) {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.valorizaciones;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  listarInfObras(strSnip: number):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarInfObras?strSnip=' + strSnip);
  }
}
