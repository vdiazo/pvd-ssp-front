import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdministradorContratoService {

  constructor(private http: HttpClient) { }

  listarAdministradorExpediente(id_seguimiento_expediente: number, num_filas: number, numero_Pagina: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/listarAdministradorContratoEjeDirSet`;
    let token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${href}?intId_seguimiento_monitoreo_expediente=${id_seguimiento_expediente}&skip=${num_filas}&take=${numero_Pagina}`, { headers: headers });
  }

  registrarAdministradorExpediente(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(data));
    return this.http.post(`${Settings.API_ENDPOINT}api/insertarAdministradorContratoEjeDirSet/`, formData);
  }

  actualizarAdministradorExpediente(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(data));
    return this.http.post(`${Settings.API_ENDPOINT}api/ModificarAdministradorContratoEjeDirSet/`, formData);
  }

  anularAdministradorExpediente(data: any): Observable<any> {
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(`${Settings.API_ENDPOINT}api/AnularAdministradorContratoEjeDirSet/`, entidad);
  }
}
