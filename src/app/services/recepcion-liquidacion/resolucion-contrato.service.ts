import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings';
import { IResolucionContrato } from '../../Interfaces/IResolucionContrato';

@Injectable({
  providedIn: 'root'
})
export class ResolucionContratoService {

  constructor(private http: HttpClient) { }

  listarResolucionContrato(id_fase: number, skip: number, take: number) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarResolucionContrato?intId_fase=' + id_fase + '&skip=' + skip + '&take=' + take);
  }

  registrarResolucionContrato(data: IResolucionContrato) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarResolucionContrato/", formData);
  }

  modificarResolucionContrato(data: IResolucionContrato) {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarResolucionContrato/", formData)
  }

  eliminarResolucionContrato(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularResolucionContrato", entidad)
  }
}
