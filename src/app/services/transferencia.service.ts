import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }

  // listarTransferenciaXidTramoXidMunicipalidad(idTramo: number, idMunicipalidad: number, numFilas, numPaginas) {
  //   return this.http.get(Settings.API_ENDPOINT + 'api/listarTransferencia/' + idTramo + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas);
  // }

  listarTransferenciaXidFaseXidMunicipalidad(idFase: number, idMunicipalidad: number, numFilas, numPaginas) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTransferenciaConvenio/' + idFase + '/' + idMunicipalidad + '/' + numFilas + '/' + numPaginas);
  }

  // registrarArchivoTransferencia(data: any) {
  //   let entidad = {
  //     data: JSON.stringify(data)
  //   }
  //   return this.http.post(Settings.API_ENDPOINT + "api/modificarTransferenciaArchivo", entidad);
  // }

  registrarArchivoTransferencia(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarTransferenciaConvenioArchivo", entidad);
  }
}