import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ContratistaExpedienteService {

  constructor(private http: HttpClient) { }

  listarContratista(id_seguimiento_expediente: number, num_filas: number, numero_Pagina: number): Observable<any> {
    return this.http.get(`${Settings.API_ENDPOINT}api/listarResponsableContratistaEjeDirSet?intId_seguimiento_ejecucion_expediente=${id_seguimiento_expediente}&skip=${num_filas}&take=${numero_Pagina}`);
  }

  registrarContratista(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(`${Settings.API_ENDPOINT}api/procesarResponsableContratistaEjeDirSet/`, formData);
  }

  actualizarContratista(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    return this.http.post(`${Settings.API_ENDPOINT}api/procesarResponsableContratistaEjeDirSet/`, formData);
  }

  eliminarContratista(data: any): Observable<any> {
    const entidad = { data: JSON.stringify(data) };
    return this.http.post(`${Settings.API_ENDPOINT}api/anularResponsableContratistaExpedienteEjeDir/`, entidad);
  }
}
