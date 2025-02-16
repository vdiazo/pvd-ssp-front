import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) { }

  ListarReporteGeneral() {

    // return this.http.get(Settings.API_ENDPOINT + 'api/ListarAmpliacion?strParametro={"id_seguimiento":' + data + ',"limit":' + num_filas + ',"offset":' + numero_Pagina+"}");

    return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteGeneral');
    
  }
  ListarReporteAcceso() {

    // return this.http.get(Settings.API_ENDPOINT + 'api/ListarAmpliacion?strParametro={"id_seguimiento":' + data + ',"limit":' + num_filas + ',"offset":' + numero_Pagina+"}");

    return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAcceso');
    
  }
}
