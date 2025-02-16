import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Settings } from '../../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class ProcesoLiquidacionService {

  constructor(private http: HttpClient) { }
  listarEstadoLiquidacion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarEstadoLiquidacion");
  }
  listarTipoDocumentoLiquidacion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoDocumentoLiquidacion");
  }
  ListarLiquidacionPaginado(idobra,skip,take) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarLiquidacionSeguimiento/"+idobra+"/"+skip+"/"+take);
  }
  registrarLiquidacion(liquidacion: any) {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/insertarLiquidacionSeguimiento', entidad);
  }
  editarLiquidacion(liquidacion: any) {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/modificarLiquidacionSeguimiento', entidad);
  }
  anularLiquidacion(liquidacion: any) {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularLiquidacionSeguimiento', entidad);
  }
}
