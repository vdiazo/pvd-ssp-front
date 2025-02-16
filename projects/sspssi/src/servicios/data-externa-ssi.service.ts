import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataExternaSsiService {

  constructor(private http: HttpClient) { }

  consultarInformacionReniec(strDni: string): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ConsultarInformacionReniec?strDni=${strDni}`;

    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.get(href, { headers: headers });
  }
}
