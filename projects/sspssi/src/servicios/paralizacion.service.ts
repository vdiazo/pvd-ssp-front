import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarParalizacion(id, perfil: string, pNumPagina,pNumeroFilasMostrar): Observable<any> {
    let url = Settings.API_ENDPOINT + 'api/listarParalizacionObraEjeDir?idSeguimientoMonitoreoObra=' + id + "&strPerfil=" + perfil + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina;
    return this.http.get(url);
  }

  eliminarParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularParalizacionObraEjeDir", entidad)
  }

  registrarParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarParalizacionObraEjeDir/", entidad);
  }

  actualizarParalizacion(data: any): Observable<any> {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarParalizacionObraEjeDir/", entidad);
  }

  registrarArchivo(file: any): Observable<any> {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.paralizacion;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
