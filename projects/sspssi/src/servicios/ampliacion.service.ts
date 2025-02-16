import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionService {

  constructor(private http: HttpClient) { }

  listarAmpliacion(data: any, num_filas: number, numero_Pagina: number): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarAmpliacionObraEjeDir?id_seguimiento_monitoreo_obra=' + data + '&intSkip=' + num_filas + '&intTake=' + numero_Pagina);
  }

  listarCausalidades(): Observable<any>{
    return this.http.get(Settings.API_ENDPOINT + 'api/listarCausalAmpliacionEjeDir');
  }

  registrarAmpliacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAmpliacionObraEjeDir/", entidad);
  }

  actualizarAmpliacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAmpliacionObraEjeDir/", entidad)
  }

  eliminarAmpliacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularAmpliacionObraEjeDir", entidad)
  }
}
