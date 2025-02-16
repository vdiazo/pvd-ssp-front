import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { RequestOptions, Http, Headers } from '@angular/http';


//import { Settings, AplicarTipoControl } from 'src/app/appSettings';

import { AppUserAuth, AppUserClaim } from './sesion';
import { AplicarTipoControl } from '../../appSettings/enumeraciones';
import { Settings } from '../../appSettings/settings';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  config;
  bsModalRef: BsModalRef;
  strlogon: string;
  strDatosLogon;
  userData;

  constructor(
    private router: Router,
    //private servicio: UsuarioService,
    //private modalService: BsModalService,
    private http: HttpClient,
    private httpusuario: Http
  ) { }

  // get isLoggedIn() {
  //   if (sessionStorage.getItem("Logout") == "Salio") {
  //     sessionStorage.clear();
  //     this.servicio.validarLogout().subscribe(
  //       data => {
  //         let ruta = data as string;
  //         window.location.href = ruta;
  //       }
  //     );
  //   }
  //   else {
  //     if (this.loadSessionData() != null) {
  //       this.loggedIn = new BehaviorSubject<boolean>(true);
  //       return this.loggedIn.asObservable();
  //     } else {
  //       sessionStorage.clear();
  //       return this.loggedIn.asObservable();
  //     }
  //   }
  // }


  islogon(): string {
    return this.strlogon = this.getParameterByName("xy");
  }

  getParameterByName(name: string) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  // accederAlSistema(user: IUser): Observable<IUserInfo> {
  //   return this.servicio.validarLogin(user);
  // }

  /**
  * authService.SessionStorageUserInfo: Almacena la información del usuario al SessionStorage y
  * devuelve un valor Boolean indicando si el usuario esta accediendo por primera vez al Sistema.
  */
  // SessionStorageUserInfo(userInfo: IUserInfo) {
  //   if (!userInfo) {
  //     throw "userInfo is null";
  //   }

  //   const CONST_RESPONSABLE: string = "RESPONSABLE"

  //   if (userInfo.valido) {
  //     let responsable: string = "";

  //     let tienePerfil: boolean = userInfo.perfil && userInfo.perfil.length > 0;
  //     let perfil: IPerfil = null

  //     if (tienePerfil) {
  //       perfil = userInfo.perfil[0];
  //       responsable = perfil.nombre_perfil;
  //     }

  //     let primeraCondicion: Boolean = (responsable === CONST_RESPONSABLE && userInfo.fecha_modificacion != null)
  //     let segundaCondicion: Boolean = (responsable !== CONST_RESPONSABLE && (userInfo.fecha_modificacion == null || userInfo.fecha_modificacion != null))

  //     let hacerCambioClave = !(primeraCondicion || segundaCondicion);

  //     if (hacerCambioClave) {

  //       this.modalResetearClave(userInfo, userInfo.token);

  //       return (subscriber) => {
  //         subscriber.next(true);
  //       }

  //     }

  //     if (userInfo.token) {
  //       sessionStorage.setItem(sessionStorageItems.SS_TOKEN, userInfo.token);
  //     }

  //     if (userInfo.usuario) {
  //       sessionStorage.setItem(sessionStorageItems.SS_USUARIO, userInfo.usuario);
  //     }

  //     sessionStorage.setItem(sessionStorageItems.SS_MUNICIPALIDAD, "");
  //     sessionStorage.setItem(sessionStorageItems.SS_ID_MUNICIPALIDAD, "0");
  //     sessionStorage.setItem(sessionStorageItems.SS_NOMBRE_PERFIL, "");
  //     sessionStorage.setItem(sessionStorageItems.SS_ID_PERFIL, "0");

  //     if (tienePerfil) {
  //       if (responsable === CONST_RESPONSABLE  || (responsable == "COLABORADOR" )) {
  //         sessionStorage.setItem(sessionStorageItems.SS_MUNICIPALIDAD, perfil.nombre_municipalidad);
  //         sessionStorage.setItem(sessionStorageItems.SS_ID_MUNICIPALIDAD, perfil.id_municipalidad.toString());
  //       }
  //       sessionStorage.setItem(sessionStorageItems.SS_NOMBRE_PERFIL, perfil.nombre_perfil);
  //       sessionStorage.setItem(sessionStorageItems.SS_ID_PERFIL, perfil.id_perfil.toString());
  //     }

  //     sessionStorage.setItem(sessionStorageItems.SS_NOMBRE_USUARIO, "");
  //     if (userInfo.nombre_usuario) {
  //       sessionStorage.setItem(sessionStorageItems.SS_NOMBRE_USUARIO, userInfo.nombre_usuario);
  //     }

  //     sessionStorage.setItem(sessionStorageItems.SS_ID_USUARIO, "");
  //     if (userInfo.id_usuario) {
  //       sessionStorage.setItem(sessionStorageItems.SS_ID_USUARIO, userInfo.id_usuario);
  //     }

  //     sessionStorage.setItem(sessionStorageItems.SS_TIPO, "Login");

  //     sessionStorage.setItem("Modulos",JSON.stringify(userInfo.modulo));

  //     this.loggedIn.next(true);

  //     return (subscriber) => {
  //       subscriber.next(false);
  //     }
  //   }
  // }

  getAccessToken() {
    let token = sessionStorage.getItem("token");

    if (token != null) {
      return token;
    }

    return "";
  }

  loadSessionData() {
    var sessionStr = sessionStorage.getItem("token");
    return (sessionStr) ? sessionStr : null;
  }

  // modalResetearClave(obj, token) {
  //   this.config = {
  //     ignoreBackdropClick: true,
  //     keyboard: false,
  //     initialState: {
  //       entidadClave: obj,
  //       stringToken: token
  //     },
  //     class: 'modal-resetearClave'
  //   };
  //   this.bsModalRef = this.modalService.show(ModalCambiarClaveComponent, this.config);
  //   this.bsModalRef.content.retornoValores.subscribe(
  //     data => {
  //       this.loggedIn.next(false);
  //     }
  //   )
  // }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any): AplicarTipoControl {
    return this.isClaimValid(claimType, claimValue);
  }

  securityObject: AppUserAuth = new AppUserAuth();

  private isClaimValid(claimType: string, claimValue?: string): AplicarTipoControl {
    let ret: AplicarTipoControl;
    let auth: AppUserAuth = null;
    auth = JSON.parse(sessionStorage.getItem("Componentes"));
    if (auth != null) {
      let infoClaim = auth.componente.find(c => c.nombre_componente.toLowerCase().trim() == claimType.toLowerCase().trim());
      if (infoClaim != undefined) {
        if (infoClaim.visible) {
          ret = AplicarTipoControl.Visible
        }
        else {
          ret = AplicarTipoControl.Ocultar;
        }
      }
      else {
        ret = AplicarTipoControl.Ocultar;
      }
    }
    return ret;
  }

  getComponentes(IdPerfil: number): Observable<AppUserClaim[]> {
    return this.http.get<AppUserClaim[]>(Settings.API_ENDPOINT + "api/listarComponentePerfil?intIdPerfil=" + IdPerfil);
  }

  getMenu(IdPErfil: number): Observable<AppUserAuth> {

    let token = sessionStorage.getItem("token");    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })  

    return this.http.get<AppUserAuth>(Settings.API_ENDPOINT + "api/ListarMenuPerfil?intIdPerfil=" + IdPErfil, { headers: headers }).pipe(
      tap(respuesta => {
        sessionStorage.setItem("Componentes", JSON.stringify(respuesta));
        Object.assign(this.securityObject, respuesta);
      })
    )
  }

  getMenuLogon(IdUsuario: number, IdPErfil: number, token: string):any {
    let headers = new Headers()
    let accessToken = token;
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.httpusuario.get(Settings.API_ENDPOINT + "api/ListarMenuPerfil?intIdPerfil=" + IdPErfil + "&intIdUsuario=" + IdUsuario, options).pipe(
      tap(respuesta => {
        Object.assign(this.securityObject, respuesta);
      })
    );
  }

}