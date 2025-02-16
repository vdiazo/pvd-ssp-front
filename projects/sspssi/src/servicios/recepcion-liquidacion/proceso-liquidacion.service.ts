import { Injectable } from '@angular/core';
import { HttpClient } from 'node_modules/@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProcesoLiquidacionService {

  constructor(private http: HttpClient) { }
  listarEstadoLiquidacion():Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarEstadoLiquidacionEjeDir");
  }
  listarTipoDocumentoLiquidacion():Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoDocumentoLiquidacionEjeDir");
  }
  ListarLiquidacionPaginado(idobra,skip,take):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + "api/listarLiquidacionSeguimientoEjeDir/"+idobra+"/"+skip+"/"+take);
  }
  registrarLiquidacion(liquidacion: any):Observable<any> {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/insertarLiquidacionSeguimientoEjeDir', entidad);
  }
  editarLiquidacion(liquidacion: any):Observable<any> {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/modificarLiquidacionSeguimientoEjeDir', entidad);
  }
  anularLiquidacion(liquidacion: any):Observable<any> {
    let entidad = { data: JSON.stringify(liquidacion) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularLiquidacionSeguimientoEjeDir', entidad);
  }
}
