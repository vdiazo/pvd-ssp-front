import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(private http: HttpClient) { }

  listarSupervisor(data: any, num_filas: number, numero_Pagina: number) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarResponsableSupervisor?intId_seguimiento_monitoreo_obra=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina);
  }

  registrarSupervisor(data: any, file: any) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    formData.append("uploadFile", file.file, file.nombre);
    return this.http.post(Settings.API_ENDPOINT + "api/insertarResponsableSupervisor/", formData);
  }

  actualizarSupervisor(data: any, file: any) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarResponsableSupervisor/", formData)
  }

  eliminarSupervisor(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularResponsableSupervisor", entidad)
  }
}
