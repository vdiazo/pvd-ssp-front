import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class InfoFinancieraService {

  constructor(private http: HttpClient) { }

  listarInformacionFinanciera(codSnip: any, idFase: any): Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarFuenteFinanciera?strCodigoSnip=" + codSnip + "&intIdFase="+ idFase, {headers: headers});
  }
}
