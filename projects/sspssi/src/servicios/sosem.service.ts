import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SosemService {

  constructor(private http: HttpClient) { }

  BuscarProyectoSosem(strSNIP, strCodigoProyecto) : Observable<any>{
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get( Settings.API_ENDPOINT + 'api/obtenerInformacionProyecto/' + strSNIP + '/' + strCodigoProyecto, { headers: headers });
  }

}

