import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IUserInfo } from '../interfaces/IUserInfo';
import { IUser } from '../interfaces/IUser';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private httpusuario: Http) { }

  ListarUsuarioPaginado(busqueda, usuario, perfil, skip, take) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarUsuario?strNombreUsuario=' + busqueda + '&intIdUsuario=' + usuario + "&intIdPerfil=" + perfil + '&intSkip=' + skip + '&intTake=' + take);
  }

  ObtenerUsuario(idUsuario) {
    return this.http.get(Settings.API_ENDPOINT + 'api/obtenerUsuario?strNombreUsuario=' + idUsuario);
  }

  cambiarEstado(usuario: any) {
    let entidad = { data: JSON.stringify(usuario) }
    return this.http.post(Settings.API_ENDPOINT + 'api/activarUsuario', entidad);
  }

  restablecerClave(usuario: any) {
    let entidad = { data: JSON.stringify(usuario) }
    return this.http.post(Settings.API_ENDPOINT + 'api/recuperarContraseniaUsuario', entidad);
  }

  registrarUsuario(usuario: any) {
    let entidad = { data: JSON.stringify(usuario) }
    return this.http.post(Settings.API_ENDPOINT + 'api/insertarUsuario', entidad);
  }
  editarUsuario(usuario: any) {
    let entidad = { data: JSON.stringify(usuario) }
    return this.http.post(Settings.API_ENDPOINT + 'api/modificarUsuario', entidad);
  }
  anularUsuario(usuario: any) {
    let entidad = { data: JSON.stringify(usuario) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularUsuario', entidad);
  }
  cambiarClaveIngreso(usuario, token) {
    let headers = new Headers()
    let accessToken = token;
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let entidad = { data: JSON.stringify(usuario) }
    return this.httpusuario.post(Settings.API_ENDPOINT + 'api/actualizarUsuario', entidad, options);
  }

  validarLogin(user: IUser): Observable<IUserInfo> {
    let credenciales = {
      usuario: user.UserName,
      password: user.Password
    }
    return this.http.post<IUserInfo>(Settings.API_ENDPOINT + 'api/validateLogin', credenciales);
  }

  validarLogon(xy: string) {
    //return this.http.post(Settings.API_ENDPOINT + 'api/LoginIntegrado', xy);  
    return this.http.get(Settings.API_ENDPOINT + 'api/validarLogon?XY=' + xy);
  }
  validarLogout() {
    //return this.http.post(Settings.API_ENDPOINT + 'api/LoginIntegrado', xy);  
    return this.http.get(Settings.API_ENDPOINT + 'api/ValidarLogout');
  }
}