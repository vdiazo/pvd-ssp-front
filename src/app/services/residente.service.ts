import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class ResidenteService {

  constructor(private http: HttpClient) { }

  listarResidente(data: any, num_filas: number, numero_Pagina: number) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarResponsableResidente?intId_seguimiento_monitoreo_obra=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina);
  }

  registrarResidente(data: any, file: any) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    formData.append("uploadFile", file.file, file.nombre);
    return this.http.post(Settings.API_ENDPOINT + "api/insertarResponsableResidente/", formData);
  }

  actualizarResidente(data: any, file: any) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarResponsableResidente/", formData)
  }

  eliminarResidente(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularResponsableResidente", entidad)
  }
}
