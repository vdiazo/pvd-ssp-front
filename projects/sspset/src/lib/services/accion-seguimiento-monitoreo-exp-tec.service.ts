import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccionSeguimientoMonitoreoExpTecService {

  constructor(private http: HttpClient) { }

  listar(id_fase: number, perfil: string, id_seg_monitoreo: number, num_filas: number, numero_Pagina: number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/ListarAccionSeguimientoEjecucionExpediente?intIdFase=" +id_fase+"&strPerfil="+perfil+"&intSkip="+num_filas+"&intTake="+numero_Pagina ,{headers:headers});
  }

  listarAccionesSeguimiento():Observable<any> { 
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/ListarAccionSeguimientoEjecucionExpedienteControl",{headers : headers});
  }

  registar(data: string,file: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Accion_Seguimiento_Ejecucion_Expediente', JSON.stringify(data));
    formData.append("data", file.file, file.nombre);

    /*let entity = {
      data: JSON.stringify(data)
    }*/

    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarAccionSeguimientoEjecucionExpediente", formData, {headers : headers})
  }

  actualizar(data: string,file: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Accion_Seguimiento_Ejecucion_Expediente', JSON.stringify(data));
    if (file != null || file !=undefined) {
      formData.append("data", file.file, file.nombre);
    }
    /*let entity = {
      data: JSON.stringify(data)
    }*/
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarAccionSeguimientoEjecucionExpediente", formData, {headers : headers})
  }

  eliminar(data: string):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entity = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularAccionSeguimientoEjecucionExpediente", entity, {headers: headers })
  }

  /*descargarFormatoActaVisitaPDF(idProyecto: number, idTramo: number):Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });

    return this.http.get(Settings.API_ENDPOINT + "api/reporteActaVisitaMonitoreo?id_proyecto=" + idProyecto + "&id_tramo=" + idTramo,
    { 
      headers: headers, responseType: 'blob' as 'json', observe: 'response' as 'body'
    });
  }*/
}
