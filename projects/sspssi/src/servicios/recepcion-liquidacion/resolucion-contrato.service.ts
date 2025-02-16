import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings';
import { IResolucionContrato } from '../../interfaces/IResolucionContrato';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ResolucionContratoService {

  constructor(private http: HttpClient) { }

  listarResolucionContrato(id_fase: number, skip: number, take: number):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarResolucionContratoEjeDir?intId_fase=' + id_fase + '&skip=' + skip + '&take=' + take);
  }

  registrarResolucionContrato(data: IResolucionContrato):Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/insertarResolucionContratoEjeDir/", formData);
  }

  modificarResolucionContrato(data: IResolucionContrato):Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(Settings.API_ENDPOINT + "api/modificarResolucionContratoEjeDir/", formData)
  }

  eliminarResolucionContrato(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularResolucionContratoEjeDir", entidad)
  }
}
