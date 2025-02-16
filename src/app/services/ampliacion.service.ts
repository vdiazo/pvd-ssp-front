import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionService {

  constructor(private http: HttpClient) { }

  listarAmpliacion(data: any, num_filas: number, numero_Pagina: number) {

    // return this.http.get(Settings.API_ENDPOINT + 'api/ListarAmpliacion?strParametro={"id_seguimiento":' + data + ',"limit":' + num_filas + ',"offset":' + numero_Pagina+"}");

    return this.http.get(Settings.API_ENDPOINT + 'api/listarAmpliacionObra?id_seguimiento_monitoreo_obra=' + data + '&intSkip=' + num_filas + '&intTake=' + numero_Pagina);
  }

  listarCausalidades() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarCausalAmpliacion');
  }

  registrarAmpliacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarAmpliacionObra/", entidad);
  }

  InsertarAmpliacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/InsertarAmpliacion/", entidad);
  }



  validarCausalAmpliacion(pIdSeguimientoMonitoreo, pIdCausalAmpliacion, pPerfil, pIdAmpliacionObra) {

    //http://172.22.9.113/SW_SSPPVD_QA/api/ValidarAmpliacion?strParametro={"id_seguimiento":1}

    // return this.http.get(Settings.API_ENDPOINT + 'api/ValidarAmpliacion?strParametro=' + pIdSeguimientoMonitoreo);
    return this.http.get(Settings.API_ENDPOINT + 'api/ValidarCausalAmpliacion/' + pIdSeguimientoMonitoreo + '/' + pIdCausalAmpliacion + '/' + pPerfil + '/' + pIdAmpliacionObra);
  }
  actualizarAmpliacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarAmpliacionObra/", entidad)
  }

  eliminarAmpliacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularAmpliacionObra", entidad);
    // return this.http.post(Settings.API_ENDPOINT + "api/anularAmpliacion", entidad)
  }

  ListarAmpliacionControl() {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarAmpliacionControl")
  }
}
