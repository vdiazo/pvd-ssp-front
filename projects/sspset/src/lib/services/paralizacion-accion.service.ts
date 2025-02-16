import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionAccionService {

  constructor( private http: HttpClient, private httpFile: Http) { }

  listarAccionParalizacion(id,pNumPagina,pNumeroFilasMostrar):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarParalizacionAccionObra?idParalizacionObra=' + id + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina, {headers : headers} );
  }

  registrarAccionParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarParalizacionAccionObra", entidad, {headers : headers});
  }

  actualizarAccionParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarParalizacionAccionObra/", entidad, {headers : headers})
  }

  eliminarAccionParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularParalizacionAccionObra", entidad, {headers : headers})
  }
  registrarArchivo(file: any):Observable<any> {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipoArchivo.paralizacionAccion;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
