import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { AppUserAuth } from '../componentes/auth/sesion';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private http: HttpClient) { }
  
  obtenerAccesoExistente(codusuario,codperfil) {
  return this.http.get(Settings.API_ENDPOINT + "api/obtenerDetalleUsuario?intUsuario="+ codusuario +"&intPerfil="+codperfil);
  }  

  listarMunicipalidadDepatarmento(usuario,perfil) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarMunicipalidad/"+usuario +"/"+perfil);
  }
  listarUsuarioCombo(usuario,perfil) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarUsuarioCombo?intIdUsuario="+usuario+"&intIdPerfil="+perfil);
  } 
  ListarAccesoPaginado(busqueda,usuario,perfil,skip,take,id_modulo,intIdPerfilHijo){
    return this.http.get(Settings.API_ENDPOINT + 'api/listarDetalleUsuario?strNombreUsuario=' + busqueda + '&intIdUsuario=' + usuario + "&intIdPerfil=" + perfil + '&intSkip=' + skip + '&intTake=' + take+'&intIdModulo='+id_modulo+'&intIdPerfilHijo='+intIdPerfilHijo);
  }
  registrarAcceso(acceso:any){
    let entidad = { data : JSON.stringify(acceso) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarDetalleUsuario', entidad);
  }
  editarAcceso(acceso:any){
    let entidad = { data : JSON.stringify(acceso) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarDetalleUsuario', entidad);
  }
  anularAcceso(acceso:any){
    let entidad = { data : JSON.stringify(acceso) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularDetalleUsuario', entidad);
  }
  getMenu(IdUsuario:number,IdPErfil:number):Observable<AppUserAuth> {
    return this.http.get<AppUserAuth>(Settings.API_ENDPOINT + "api/ListarMenuPerfil?intIdPerfil="+IdPErfil);    
  }
  listarModuloPerfil(intIdPerfil:number){
    let token = sessionStorage.getItem("token");    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })  
    return this.http.get(Settings.API_ENDPOINT + "api/listarModuloPerfil?intIdPerfil="+intIdPerfil,{ headers: headers });
  }
 ListarModuloPerfilUsuario(intIdUsuario:number){
  let token = sessionStorage.getItem("token");    
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })  
  return this.http.get(Settings.API_ENDPOINT + "api/ListarModuloPerfilUsuario?intIdUsuario="+intIdUsuario,{ headers: headers });
  }
}