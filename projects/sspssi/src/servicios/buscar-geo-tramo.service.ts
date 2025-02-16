import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class BuscarGeoTramoService {

  constructor(private http: HttpClient, public httpFile: Http) { }

  ListarGEOPaginado(busqueda, skip, take): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarGeoTramoEjeDir?strFiltro=' + busqueda + '&intSkip=' + skip + '&intTake=' + take);
  }

  ListarZonas() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarZonaGeoTramoEjeDir');
  }

  ListarTramos() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTramo2EjeDir');
  }

  RegistrarEditarGEOTramo(pformData: any): Observable<any> {
    const headers = new Headers();
    const accessToken = sessionStorage.getItem('token');
    headers.set('Authorization', `Bearer ${accessToken}`);
    const options = new RequestOptions({ headers: headers });
    const apiUrl1 = Settings.API_ENDPOINT + 'api/procesarGeoTramoEjeDir';
    return this.httpFile.post(apiUrl1, pformData, options);
  }

  anularGeoTramo(geo: any) {
    const entidad = { data: JSON.stringify(geo) };
    return this.http.post(Settings.API_ENDPOINT + 'api/anularGeoTramoEjeDir', entidad);
  }
}
