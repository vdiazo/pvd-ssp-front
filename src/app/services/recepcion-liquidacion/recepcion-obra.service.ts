import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Http } from '../../../../node_modules/@angular/http';
import { Settings } from '../../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class RecepcionObraService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarRecepcionObra(id,pNumPagina,pNumeroFilasMostrar) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarLiquidacionRecepcionObra/' + id + "/" + pNumeroFilasMostrar + "/" + pNumPagina );
  }

  registrarRecepcionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarLiquidacionRepcecionObra/", entidad);
  }

  actualizarRecepcionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarLiquidacionRepcecionObra/", entidad);
  }

  listarEstadoRecepcionObra() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarEstadoRecepcion');
  }

  listarTipoDocumentoRecepcionObra() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTipoDocumentoRecepcion');
  }
  anularRecepcionObra(data: any){
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularLiquidacionRepcecionObra/", entidad);
  }
}
