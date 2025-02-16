import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionAccionService {

  constructor(private http: HttpClient, private httpFile: Http){ }

  listarAccionParalizacion(id,pNumPagina,pNumeroFilasMostrar) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarParalizacionAccionObraEjeDir?idParalizacionObra=' + id + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina);
  }

  registrarAccionParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarParalizacionAccionObraEjeDir", entidad);
  }

  actualizarAccionParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarParalizacionAccionObraEjeDir/", entidad)
  }

  eliminarAccionParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularParalizacionAccionObraEjeDir", entidad)
  }
  registrarArchivo(file: any): Observable<any> {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.paralizacionAccion;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
