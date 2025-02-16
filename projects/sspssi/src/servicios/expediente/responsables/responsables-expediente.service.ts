import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesExpedienteService {

  constructor(private http: HttpClient) { }

  listarResponsablesExpediente(id_seguimiento_expediente: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarResponsableExpedienteEjeDirSet`;
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${href}?intId_seguimiento_monitoreo_expediente=${id_seguimiento_expediente}`, { headers: headers });
  }
}
