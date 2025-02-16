import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }

  // listarTransferenciaXidTramoXidMunicipalidad(idTramo: number, idMunicipalidad: number, numFilas, numPaginas) {
  //   return this.http.get(Settings.API_ENDPOINT + 'api/listarTransferencia/' + idTramo + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas);
  // }

  listarTransferenciaXidTramoXidMunicipalidad(idFase: number, idMunicipalidad: number, numFilas, numPaginas):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarTransferenciaConvenio/' + idFase + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas,{headers:headers});
  }

  // registrarArchivoTransferencia(data: any) {
  //   let entidad = {
  //     data: JSON.stringify(data)
  //   }
  //   return this.http.post(Settings.API_ENDPOINT + "api/modificarTransferenciaArchivo", entidad);
  // }

  registrarArchivoTransferencia(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarTransferenciaConvenioArchivo", entidad,{headers : headers});
  }
}