import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
//import { IAdelantoDirecto, IAdelantoMaterial, IAdelantoMateriales } from './../interfaces';
import { Observable } from 'rxjs/Observable';
import { IAdelantoDirecto } from '../interfaces/IAdelantoDirecto';
import { IAdelantoMaterial, IAdelantoMateriales } from '../interfaces/IAdelantoMateriales';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoMonitoreoService {

  constructor(private http: HttpClient) { }

  listarSeguimientoMonitoreo(data: any, bEstado: any): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarSeguimientoMonitoreoObraEjeDir?strIdSeguimientoMonitoreoObra=' + data + '&blEstado=' + bEstado);
  }

  registrarSeguimientoMonitoreo(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarSeguimientoMonitoreoObraEjeDir/", entidad);
  }

  registrarSeguimientoFaseMonitoreo(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/procesoSeguimientoMonitoreoObraEjeDir/", entidad);
  }

  actualizarSeguimientoMonitoreo(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/procesoSeguimientoMonitoreoObraEjeDir/", entidad)
  }

  eliminarSeguimientoMonitoreo(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularSeguimientoMonitoreoObraEjeDir", entidad)
  }

  listarAdelantoDirecto(id_seguimiento_monitoreo_obra: number): Observable<IAdelantoDirecto[]> {
    return this.http.get<IAdelantoDirecto[]>(Settings.API_ENDPOINT + "api/listarAdelantoDirectoEjeDir?id_seguimiento_monitoreo_obra=" + id_seguimiento_monitoreo_obra);
  }

  registrarAdelantoDirecto(data: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAdelantoDirectoEjeDir/", formData);
  }

  modificarAdelantoDirecto(data: IAdelantoDirecto): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAdelantoDirectoEjeDir/", formData);
  }

  eliminarAdelantoDirecto(data: IAdelantoDirecto): Observable<any> {
    let entity = {
      data: JSON.stringify({
        id_adelanto_directo: data.id_adelanto_directo,
        usuario_eliminacion: data.usuario_eliminacion
      })
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAdelantoDirectoEjeDir/", entity);
  }

  listarAdelantoMateriales(id_seguimiento_monitoreo_obra: number, num_filas: number, num_pagina: number): Observable<IAdelantoMateriales> {
    let url = Settings.API_ENDPOINT + "api/listarAdelantoMaterialesEjeDir?id_seguimiento_monitoreo_obra=" + id_seguimiento_monitoreo_obra + "&skip=" + num_filas + "&take=" + num_pagina;
    return this.http.get<IAdelantoMateriales>(url);
  }

  registrarAdelantoMaterial(data: IAdelantoMaterial): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAdelantoMaterialesEjeDir/", formData);
  }

  modificarAdelantoMaterial(data: IAdelantoMaterial): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAdelantoMaterialesEjeDir/", formData);
  }

  eliminarAdelantoMaterial(data: IAdelantoMaterial): Observable<any> {
    let entity = {
      data: JSON.stringify({
        id_adelanto_materiales: data.id_adelanto_materiales,
        usuario_eliminacion: data.usuario_eliminacion
      })
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularAdelantoMaterialesEjeDir/", entity);
  }

}
