import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class InspectorService {

  constructor(private http: HttpClient) { }

  listarInspector(data: any, num_filas: number, numero_Pagina: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarResponsableInspectorEjeDir?intId_seguimiento_monitoreo_obra=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina);
  }

  registrarInspector(data: any, file?: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarResponsableInspectorEjeDir/", formData);
  }

  actualizarInspector(data: any, file?: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('entidad', JSON.stringify(data));
    if (file != null) {
      formData.append("uploadFile", file.file, file.nombre);
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarResponsableInspectorEjeDir/", formData)
  }

  eliminarInspector(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularResponsableInspectorEjeDir", entidad)
  }
}
