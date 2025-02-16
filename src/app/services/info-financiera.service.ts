import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class InfoFinancieraService {

  constructor(private http: HttpClient) { }

  listarInformacionFinanciera(codSnip: any, idFase: any) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarFuenteFinanciera?strCodigoSnip=" + codSnip + "&intIdFase="+ idFase);
  }
}
