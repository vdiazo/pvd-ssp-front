import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DatosContratoService {

  constructor(private http: HttpClient) { }

  obtenerDatosContrato(codSnip: number): Observable<any> {
    const href = `${Settings.API_ENDPOINT}api/ListarDatosContratoEjeDirSet`;
    return this.http.get(`${href}?intIdCodSnip=${codSnip}`);
  }

  listarDatosContrato(codSnip: number, idFase: number) {
    const href = `${Settings.API_ENDPOINT}api/ListarDatosContratoContratistaEjeDirSet`;
    return this.http.get(`${href}?intIdCodSnip=${codSnip}&intIdFase=${idFase}`);
  }
}
