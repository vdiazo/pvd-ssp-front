import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Settings } from '../appSettings/settings';

@Injectable({
   providedIn: 'root'
})
export class InformacionFinancieraSigatService {

   constructor(private http: HttpClient) { }

   obtenerInformacionFinanciera(wc_contrato: string): Observable<any> {
      return this.http.get(Settings.API_ENDPOINT + 'api/listarInformacionSsiSigat?strContrato=' + wc_contrato);
   }
}