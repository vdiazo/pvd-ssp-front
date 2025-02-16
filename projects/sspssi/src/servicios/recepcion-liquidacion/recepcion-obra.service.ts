import { Injectable } from '@angular/core';
import { HttpClient } from 'node_modules/@angular/common/http';
import { Http } from 'node_modules/@angular/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class RecepcionObraService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarRecepcionObra(id,pNumPagina,pNumeroFilasMostrar):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarLiquidacionRecepcionObraEjeDir/' + id + "/" + pNumeroFilasMostrar + "/" + pNumPagina );
  }

  registrarRecepcionObra(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarLiquidacionRecepcionObraEjeDir/", entidad);
  }

  actualizarRecepcionObra(data: any):Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarLiquidacionRecepcionObraEjeDir/", entidad);
  }

  listarEstadoRecepcionObra():Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarEstadoRecepcionEjeDir');
  }

  listarTipoDocumentoRecepcionObra():Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTipoDocumentoRecepcionEjeDir');
  }
  
  anularRecepcionObra(data: any):Observable<any>{
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularLiquidacionRecepcionObraEjeDir/", entidad);
  }
}
