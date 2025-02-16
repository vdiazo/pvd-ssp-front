import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionAccionService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarAccionParalizacion(id,pNumPagina,pNumeroFilasMostrar) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarParalizacionAccionObra?idParalizacionObra=' + id + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina);
  }

  registrarAccionParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarParalizacionAccionObra", entidad);
  }

  actualizarAccionParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarParalizacionAccionObra/", entidad)
  }

  eliminarAccionParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularParalizacionAccionObra", entidad)
  }
  registrarArchivo(file: any) {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.paralizacionAccion;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
