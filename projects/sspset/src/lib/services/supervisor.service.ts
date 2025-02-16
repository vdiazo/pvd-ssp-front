import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(
    private http: HttpClient,
    private httpFile: Http
  ) { }

  registrarSupervisor(data: any, file: any):Observable<any> { 
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })


    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Supervisor_Seguimiento_Expediente', JSON.stringify(data));
    formData.append("uploadFile", file.file, file.nombre);
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarSupervisorExpediente/", formData,{ headers: headers });
  }

  listarSupervisorExpTecnico(data: any, num_filas: number, numero_Pagina: number): Observable<any> {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarSupervisorExpediente?intId_seguimiento_monitoreo_expediente=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina,{ headers: headers });
  }



  actualizarSupervisor(data: any, file: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })


    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Supervisor_Seguimiento_Expediente', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarSupervisorExpediente/", formData,{ headers: headers })
  }

  eliminarSupervisor(data: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularSupervisorExpediente", entidad,{ headers: headers })
  }



  //supervisor estudio
  insertarSupervisorEstudio(data: any, file: any):Observable<any> { 
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Supervisor_Estudio', JSON.stringify(data));
    formData.append("StrFileName", file.file, file.nombre);
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarSupervisorEstudio/", formData,{ headers: headers });
  }

  listarSupervisorEstudio(data: any, num_filas: number, numero_Pagina: number): Observable<any> {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarSupervisorEstudio?intId_seguimiento_monitoreo_expediente=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina,{ headers: headers });
  }

  modificarSupervisorEstudio(data: any, file: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Supervisor_Estudio', JSON.stringify(data));
    if (file != null) {
      formData.append("Files", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarSupervisorEstudio/", formData,{ headers: headers })
  }

  anularSupervisorEstudio(data: any) {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularSupervisorEstudio", entidad,{ headers: headers })
  }
}
