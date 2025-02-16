import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccionSeguimientoMonitoreoService {

  constructor(private http: HttpClient) { }

  listar(id_fase: number, perfil: string, id_seg_monitoreo: number, num_filas: number, numero_Pagina: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarAccionMonitoreoObraEjeDir/" + id_fase + "/" + perfil + "/" + id_seg_monitoreo + "/" + num_filas + "/" + numero_Pagina);
  }

  listarAccionesSeguimiento(): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarAccionesSeguimientoEjeDir");
  }

  registar(data: string): Observable<any> {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionMonitoreoObraEjeDir", entity)
  }

  actualizar(data: string): Observable<any> {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionMonitoreoObraEjeDir", entity)
  }

  eliminar(data: string): Observable<any> {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAccionMonitoreoObraEjeDir", entity)
  }

  descargarFormatoActaVisitaPDF(idProyecto: number, idTramo: number, idSeguimiento: number): Observable<any> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': `Bearer ${token}`
    })
    //let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });

    return this.http.get(Settings.API_ENDPOINT + "api/reporteActaVisitaMonitoreoEjeDir?id_proyecto=" + idProyecto + "&id_tramo=" + idTramo + "&id_seguimiento_monitoreo_obra=" + idSeguimiento,
      {
        headers: headers, responseType: 'blob' as 'json', observe: 'response' as 'body'
      });
  }
}
