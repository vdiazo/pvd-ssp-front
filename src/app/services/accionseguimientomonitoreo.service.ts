import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from 'src/app/appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class AccionSeguimientoMonitoreoService {

  constructor(private http: HttpClient) { }

  listar(id_fase: number, perfil: string, id_seg_monitoreo: number, num_filas: number, numero_Pagina: number) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarAccionMonitoreoObra/" + id_fase + "/" + perfil + "/" + id_seg_monitoreo + "/" + num_filas + "/" + numero_Pagina);
  }

  listarAccionesSeguimiento() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarAccionesSeguimiento");
  }

  registar(data: string) {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/insertarAccionMonitoreoObra", entity)
  }

  actualizar(data: string) {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/modificarAccionMonitoreoObra", entity)
  }

  eliminar(data: string) {
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularAccionMonitoreoObra", entity)
  }

  descargarFormatoActaVisitaPDF(idProyecto: number, idTramo: number){
    let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });

    return this.http.get(Settings.API_ENDPOINT + "api/reporteActaVisitaMonitoreo?id_proyecto=" + idProyecto + "&id_tramo=" + idTramo,
    { 
      headers: headers, responseType: 'blob' as 'json', observe: 'response' as 'body'
    });
  }

}
