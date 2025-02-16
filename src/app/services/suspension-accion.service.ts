import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';

@Injectable({
  providedIn: 'root'
})
export class SuspensionAccionService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarSuspensionAccionObra(id,pNumPagina,pNumeroFilasMostrar) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarSuspensionAccionObra?intIdSuspensionObra=' + id + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina);
  }

  insertarSuspensionAccionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarSuspensionAccionObra", entidad);
  }

  modificarSuspensionAccionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarSuspensionAccionObra/", entidad)
  }

  anularSuspensionAccionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularSuspensionAccionObra", entidad)
  }

  listarSuspensionAccionControl() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarSuspensionAccionControl');
  }


}
