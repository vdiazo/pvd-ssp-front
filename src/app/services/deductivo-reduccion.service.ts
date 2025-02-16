import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class DeductivoReduccionService {

  constructor(private http: HttpClient) { }

  listarDeductivoReduccion(id_seguimiento_monitoreo_obra: number, num_filas: number, numero_Pagina: number) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarDeductivoReduccionObra/" + id_seguimiento_monitoreo_obra + "/" + num_filas + "/" + numero_Pagina);
  }

  registrarDeductivoReduccion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarDeductivoReduccionObra/", entidad);
  }

  actualizarDeductivoReduccion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarDeductivoReduccionObra/", entidad)
  }

  eliminarDeductivoReduccion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularDeductivoReduccionObra", entidad)
  }
}
