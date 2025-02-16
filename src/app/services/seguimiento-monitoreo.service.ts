import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { IAdelantoDirecto, IAdelantoMaterial, IAdelantoMateriales } from '../Interfaces';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoMonitoreoService {

  constructor(private http: HttpClient) { }

  listarSeguimientoMonitoreo(data: any, bEstado: any) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarSeguimientoMonitoreoObra?strIdSeguimientoMonitoreoObra=' + data + '&blEstado=' + bEstado);
  }

  ObtenerSeguimiento(data:any){
    return this.http.get(Settings.API_ENDPOINT + 'api/ObtenerSeguimiento?strParametro={"id_seguimiento":' + data + '}');
  }



  registrarSeguimientoMonitoreo(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarSeguimientoMonitoreoObra/", entidad);
  }

  InsertarSeguimiento(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/InsertarSeguimiento/", entidad);
  }

  registrarSeguimientoFaseMonitoreo(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/procesoSeguimientoMonitoreoObra/", entidad);
  }

  actualizarSeguimientoMonitoreo(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarSeguimientoMonitoreoObra/", entidad);
    // return this.http.post(Settings.API_ENDPOINT + "api/ModificarSeguimiento/", entidad);
    
  }

  eliminarSeguimientoMonitoreo(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularSeguimientoMonitoreoObra", entidad)
  }

  listarAdelantoDirecto(id_seguimiento_monitoreo_obra: number): Observable<IAdelantoDirecto[]> {
    return this.http.get<IAdelantoDirecto[]>(Settings.API_ENDPOINT + "api/listarAdelantoDirecto?id_seguimiento_monitoreo_obra=" + id_seguimiento_monitoreo_obra);
  }

  registrarAdelantoDirecto(data: IAdelantoDirecto) {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAdelantoDirecto/", formData);
  }

  modificarAdelantoDirecto(data: IAdelantoDirecto) {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAdelantoDirecto/", formData);
  }

  eliminarAdelantoDirecto(data: IAdelantoDirecto) {
    let entity = {
      data: JSON.stringify({
        id_adelanto_directo: data.id_adelanto_directo,
        usuario_eliminacion: data.usuario_eliminacion
      })
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAdelantoDirecto/", entity);
  }

  listarAdelantoMateriales(id_seguimiento_monitoreo_obra: number, num_filas: number, num_pagina: number): Observable<IAdelantoMateriales> {
    let url = Settings.API_ENDPOINT + "api/listarAdelantoMateriales?id_seguimiento_monitoreo_obra=" + id_seguimiento_monitoreo_obra + "&skip=" + num_filas + "&take=" + num_pagina;
    return this.http.get<IAdelantoMateriales>(url);
  }

  registrarAdelantoMaterial(data: IAdelantoMaterial) {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAdelantoMateriales/", formData);
  }

  modificarAdelantoMaterial(data: IAdelantoMaterial) {
    let formData: FormData = new FormData();
    formData.append("entidad", JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAdelantoMateriales/", formData);
  }

  eliminarAdelantoMaterial(data: IAdelantoMaterial) {
    let entity = {
      data: JSON.stringify({
        id_adelanto_materiales: data.id_adelanto_materiales,
        usuario_eliminacion: data.usuario_eliminacion
      })
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularAdelantoMateriales/", entity);
  }

}