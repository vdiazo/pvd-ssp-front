import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class InspectorService {

  constructor(private http: HttpClient) { }

  listarInspector(data: any, num_filas: number, numero_Pagina: number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarInspectorExpediente?intId_seguimiento_monitoreo_expediente=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina,{ headers: headers });
  }

  registrarInspector(data: any, file: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Inspector_Seguimiento_Expediente', JSON.stringify(data));
    formData.append("uploadFile", file.file, file.nombre);
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarInspectorExpediente/", formData,{ headers: headers });
  }

  actualizarInspector(data: any, file: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Inspector_Seguimiento_Expediente', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarInspectorExpediente/", formData, {headers : headers});
  }

  eliminarInspector(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularInspectorExpediente", entidad,{ headers: headers })
  }
}
