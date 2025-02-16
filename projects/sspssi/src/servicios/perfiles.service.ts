import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(private http: HttpClient) { }

  ListarPerfilesPaginado(busqueda,skip,take): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarPerfil?strNombrePerfil=' + busqueda + '&intSkip='+ skip +'&intTake=' + take);
  }
  listadoPerfilCombo(): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarPerfilCombo');
  }
  registrarPerfil(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarPerfil', entidad);
  }
  editarPerfil(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarPerfil', entidad);
  }
  anularPerfil(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularPerfil', entidad);
  }
  ListarDetallePaginado(perfil,skip,take): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenu?intIdPerfil=' + perfil + '&intSkip='+ skip +'&intTake=' + take);
  }
  registrarDetalle(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarDetallePerfilMenu ', entidad);
  }
  anularDetalle(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularDetallePerfilMenu', entidad);
  }
  ListarDetalleMenuCombo(perfil): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenuCombo?intIdPerfil=' + perfil);
  }
  ListarDetalleComponentePaginado(detallemenu,pagina,seccion,modulo,componente,skip,take): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenuComponente?intIdDetallePerfilMenu=' + detallemenu + '&strPagina=' + pagina +'&strSeccion=' + seccion + '&strModulo=' + modulo + '&strNombreComponente=' + componente + '&intSkip='+ skip +'&intTake=' + take);
  }
  modificarDetalleComponente(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarDetallePerfilMenuComponente', entidad);
  }
  anularDetalleComponente(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularDetallePerfilMenuComponente', entidad);
  }
  ListarComponentePendientes(detalleMenu): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponentesPendientes?intIdDetallePerfilMenu=' + detalleMenu);
  }
  registrarDetalleMenuComponente(menu:any): Observable<any>{
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarDetallePerfilMenuComponente ', entidad);
  }
  ListarDetalleMenuTreeview(perfil:any): Observable<any>{
    return this.http.get( Settings.API_ENDPOINT + 'api/ListarDetalleMenu?intIdPerfil=' + perfil);
  }

  listarRegionesSegunPerfilUsuario(idPerfil: number, idUsuario: number): Observable<any>{
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarPerfilUsuario?intIdPerfil=" + idPerfil + "&intIdUsuario=" + idUsuario,{headers: headers});
  }
}
