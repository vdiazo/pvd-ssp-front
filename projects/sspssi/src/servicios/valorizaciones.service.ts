import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { AccionSeguimientoMonitoreo } from '../models/response/seguimiento-monitoreo-accion';
import { Http, RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';
import { IAccionSeguimientoMonitoreo } from '../interfaces/IAccionSeguimientoMonitoreo';
import { IPeriodosValorizaciones } from '../interfaces/IPeriodosValorizaciones';

@Injectable({
  providedIn: 'root'
})
export class ValorizacionesService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarValorizaciones(idSeguimientoMonitoreo: number, skip: number, take: number): Observable<IAccionSeguimientoMonitoreo> {
    return this.http.get<IAccionSeguimientoMonitoreo>(Settings.API_ENDPOINT + 'api/listarAccionSeguimientoMonitoreoObraEjeDir/' + idSeguimientoMonitoreo + '/' + skip + '/' + take);
  }

  listarValorizacionesGrafico(idSeguimientoMonitoreo: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarAccionSeguimientoMonitoreoObraCurvaEjeDir/' + idSeguimientoMonitoreo);
  }

  listarValorizacionesGraficoSnip(Snip: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarAccionSeguimientoMonitoreoObraCurvaSnipEjeDir/' + Snip);
  }

  listarPeriodos(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra): Observable<IPeriodosValorizaciones> {
    return this.http.get<IPeriodosValorizaciones>(Settings.API_ENDPOINT + 'api/listarSeguimientoMonitoreoObraRangoFechaEjeDir?strIdSeguimientoMonitoreoObra=' + idSeguimientoMonitoreoObra + "&strIdAccionSeguimientoMonitoreoObra=" + idAccionSeguimientoMonitoreoObra);
  }

  validarValorizacionesMonto(idSeguimientoMonitoreoObra, idAccionSeguimientoMonitoreoObra, tipoAvance, idEstadoSituacional, monto): Observable<any> {
    let url = Settings.API_ENDPOINT + 'api/ValidarSeguimientoMonitoreoObraMontoEjeDir?strIdSeguimientoMonitoreoObra=' + idSeguimientoMonitoreoObra + "&strIdAccionSeguimientoMonitoreoObra=" + idAccionSeguimientoMonitoreoObra + "&strTipoAvance=" + tipoAvance + "&strIdEstadoSituacional=" + idEstadoSituacional + "&strMonto=" + monto;
    return this.http.get(url);
  }

  eliminarValorizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAccionSeguimientoMonitoreoObraEjeDir", entidad)
  }

  registrarValorizacion(data: AccionSeguimientoMonitoreo): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionSeguimientoMonitoreoObraEjeDir", entidad);
  }

  registrarValorizacionConArchivos(data: any, arrArchivosEnvio = []): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));

    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + i.toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionSeguimientoMonitoreoObraEjeDir", formData);
  }

  ModificarValorizacion(data: AccionSeguimientoMonitoreo): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionSeguimientoMonitoreoObraEjeDir", entidad);
  }

  ModificarValorizacionConArchivos(data: any, arrArchivosEnvio = [], archivosEliminado = []): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    formData.append('archivosEliminados', JSON.stringify(archivosEliminado))

    if (arrArchivosEnvio != null) {
      for (let i = 0; i < arrArchivosEnvio.length; i++) {
        formData.append("uploadFile" + i.toString(), arrArchivosEnvio[i].archivo, arrArchivosEnvio[i].nombre_archivo);
      }
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionSeguimientoMonitoreoObraEjeDir", formData);
  }

  actualizarIncluirEnAyudaMemoria(id_accion_seguimiento_monitoreo_obra_archivo: number, selecciona_foto: boolean, usuarioModificacion: string): Observable<any> {
    let token = sessionStorage.getItem("token");
    let entidad = {
      data: JSON.stringify({
        "id_accion_seguimiento_monitoreo_obra_archivo": id_accion_seguimiento_monitoreo_obra_archivo,
        "selecciona_foto": selecciona_foto,
        "usuario_modificacion": usuarioModificacion
      })
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.post(Settings.API_ENDPOINT + "api/modificarArchivosAccionSeguimientoMonitoreoObraEjeDir", entidad, { headers: headers });
  }

  registrarArchivo(file: any): Observable<any> {

    let token = sessionStorage.getItem("token");
    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.valorizaciones;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  listarInfObras(strSnip: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarInfObras?strSnip=' + strSnip);
  }
}
