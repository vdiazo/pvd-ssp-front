import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class SosemService {

  constructor(private http: HttpClient) { }

  BuscarProyectoSosem(strSNIP, strCodigoProyecto){
    return this.http.get( Settings.API_ENDPOINT + 'api/obtenerInformacionProyecto/' + strSNIP + '/' + strCodigoProyecto);
  }

}


