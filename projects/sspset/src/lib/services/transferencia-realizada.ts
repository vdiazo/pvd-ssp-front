import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { TransferenciaRealizadaRequest } from '../../models/request/transferencia-request';
import { TransferenciaConvenioRequest } from '../../models/request/transferencia-convenio-request';


import { Http, RequestOptions, Headers} from '@angular/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaRealizadaService {

  constructor(private http: HttpClient, private httpFile: Http,
    private authService: AuthService) { }

  /*listadoConveniosRegistroTransferencia(pProyecto: TransferenciaConvenioRequest) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarConvenioFaseProyecto?strCodUnificado=' + pProyecto.codproy_snip + '&strNombreProyecto=' + pProyecto.nombre_proyecto);
  }

  listarFuenteFinanciamiento() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarFuenteFinanciamiento");
  } 

  registrarTransferenciaRealizada(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarTransferencia", entidad);
  }
  registrarTransferenciaRealizadaHttpPostFile(pformData: any) {
    let headers = new Headers()
    let accessToken = this.authService.getAccessToken();
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.API_ENDPOINT + "api/insertarTransferencia";
    return this.httpFile.post(apiUrl1, pformData, options);
  }
  



  anularTransferenciaRealizada(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularTransferencia", entidad);
  }

  listadoTransferenciaRealizadaPrincipal(pTransferenciaRealizadaRequest: TransferenciaRealizadaRequest) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTransferenciaPrincipal?strFechaPublicacionDesde=' + pTransferenciaRealizadaRequest.fecha_publicacion_desde + '&strFechaPublicacionHasta=' + pTransferenciaRealizadaRequest.fecha_publicacion_hasta + '&strDispositivo=' + pTransferenciaRealizadaRequest.dispositivo + "&intSkip=" + pTransferenciaRealizadaRequest.num_filas + "&intTake=" + pTransferenciaRealizadaRequest.num_pagina);
  }*/
}