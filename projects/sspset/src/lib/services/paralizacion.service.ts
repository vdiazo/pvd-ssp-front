import { Injectable } from '@angular/core';
import { Settings } from '../../appSettings/settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionService {

  constructor(private http: HttpClient,private httpFile: Http) { }

  listarParalizacion(id, perfil: string, pNumPagina,pNumeroFilasMostrar):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let url = Settings.API_ENDPOINT_SET + 'api/listarParalizacionObra?idSeguimientoMonitoreoObra=' + id + "&strPerfil=" + perfil + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina;
    return this.http.get(url, {headers: headers});
  }

  eliminarParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularParalizacionObra", entidad, {headers : headers})
  }
  
  registrarParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarParalizacionObra/", entidad, {headers: headers});
  }

  actualizarParalizacion(data: any):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarParalizacionObra/", entidad, {headers : headers});
  }

  registrarArchivo(file: any):Observable<any> {
    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT_SET + "api/SubirArchivo?tipoArchivo=" + tipoArchivo.paralizacion;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}
