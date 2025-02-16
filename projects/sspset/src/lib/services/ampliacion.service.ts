import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionService {

  constructor(
    private http: HttpClient
  ) { }

  listarCausalidades():Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarActividadAmpliacionExpedienteControl',{ headers: headers });
  }

  registrarAmpliacion(entidadAmpliacion: any, file:any):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Actividad_Ejecucion_Expediente', JSON.stringify(entidadAmpliacion));
    formData.append("fileUpload0", file.file, file.nombre);

    //return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarAmpliacionSeguimientoEjecucionExpediente", formData,{ headers: headers });
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarActividadAmpliacionExpediente", formData,{ headers: headers });
  }

  listarAmpliacion(data: any, num_filas: number, numero_Pagina: number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    //return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarAmpliacionSeguimientoEjecucionExpediente?intId_seguimiento_ejecucion_expediente=' + data + '&Skip=' + num_filas + '&Take=' + numero_Pagina,{ headers: headers });
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarActividadAmpliacionExpediente?intId_seguimiento_ejecucion_expediente=' + data + '&Skip=' + num_filas + '&Take=' + numero_Pagina,{ headers: headers });
  }

  actualizarAmpliacion(data: any,file:any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let formData: FormData = new FormData();
    formData.append('BE_Td_Sircc_Actividad_Ejecucion_Expediente', JSON.stringify(data));
    if (file != null) {
      formData.append("fileUpload0", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarActividadAmpliacionExpediente/", formData,{ headers: headers })

   /* let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarAmpliacionSeguimientoEjecucionExpediente/", entidad,{ headers: headers })*/
  }

  eliminarAmpliacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularActividadAmpliacionExpediente", entidad,{ headers: headers })
  }

  ListarCausalAmpliacionExpediente():Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/ListarCausalAmpliacionExpediente',{ headers: headers });
  }
  ListarResultadoPedidoAmpliacion():Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/ListarResultadoPedidoAmpliacion',{ headers: headers });
  }
  listarAmpliacionExpediente(data: any, num_filas: number, numero_Pagina: number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    //return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarAmpliacionSeguimientoEjecucionExpediente?intId_seguimiento_ejecucion_expediente=' + data + '&Skip=' + num_filas + '&Take=' + numero_Pagina,{ headers: headers });
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarAmpliacionExpediente?intIdSeguimientoEjecucionExpediente=' + data + '&intSkip=' + num_filas + '&intTake=' + numero_Pagina,{ headers: headers });
  }
  InsertarAmpliacionExpediente(entidadAmpliacion: any, file:any):Observable<any>{
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let body={data:JSON.stringify(entidadAmpliacion)} ;
    return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarAmpliacionExpediente", body,{ headers: headers });
  }
    //http://localhost:52197/api/AnularAmpliacionExpediente
    AnularAmpliacionExpediente(data: any):Observable<any> {
      let token = sessionStorage.getItem("token");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
      let entidad = {
        data: JSON.stringify(data)
      }
      return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularAmpliacionExpediente", entidad,{ headers: headers })
    }

    ModificarAmpliacionExpediente(data: any):Observable<any> {
      let token = sessionStorage.getItem("token");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
  
      // let formData: FormData = new FormData();
      // formData.append('BE_Td_Sircc_Actividad_Ejecucion_Expediente', JSON.stringify(data));
      // if (file != null) {
      //   formData.append("fileUpload0", file.file, file.nombre);
      // }
      let body={data:JSON.stringify(data)} ;
      return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarAmpliacionExpediente/", body,{ headers: headers })
  
     /* let entidad = {
        data: JSON.stringify(data)
      }
      return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarAmpliacionSeguimientoEjecucionExpediente/", entidad,{ headers: headers })*/
    }
}
