import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class DataexternaService {

  constructor(private http: HttpClient) { }

  consultarInformacionReniec(strDni: string) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET +"api/ConsultarInformacionReniec?strDni="+strDni,{ headers: headers });
  }
  


}
