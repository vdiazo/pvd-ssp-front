import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Settings } from '../appSettings/settings';
import { AuthService } from '../componentes/auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class GeoTramoService {

  constructor(private http: HttpClient, private httpFile: Http,private authService: AuthService) { }

  ListarGEOPaginado(busqueda,skip,take) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarGeoTramo?strFiltro=' + busqueda + '&intSkip=' + skip + '&intTake=' + take);
  }
  ListarZonas() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarZonaGeoTramo');
  }
  ListarTramos() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarTramo');
  }
  ListarMedidas() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarUnidadMedida');
  }
  RegistrarEditarGEOTramo(pformData: any) {
    let headers = new Headers();
    let accessToken = this.authService.getAccessToken();
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers});
    let apiUrl1 = Settings.API_ENDPOINT + "api/procesarGeoTramo";
    return this.httpFile.post(apiUrl1, pformData, options);
  }
  anularGeoTramo(geo:any){
    let entidad = { data : JSON.stringify(geo) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularGeoTramo', entidad);
  }
}
