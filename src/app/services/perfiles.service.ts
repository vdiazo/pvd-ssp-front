import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(private http: HttpClient) { }

  ListarPerfilesPaginado(busqueda,skip,take){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarPerfil?strNombrePerfil=' + busqueda + '&intSkip='+ skip +'&intTake=' + take);
  }
  listadoPerfilCombo(){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarPerfilCombo');
  }
  registrarPerfil(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarPerfil', entidad);
  }
  editarPerfil(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarPerfil', entidad);
  }
  anularPerfil(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularPerfil', entidad);
  }
  ListarDetallePaginado(perfil,skip,take){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenu?intIdPerfil=' + perfil + '&intSkip='+ skip +'&intTake=' + take);
  }
  registrarDetalle(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarDetallePerfilMenu ', entidad);
  }
  anularDetalle(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularDetallePerfilMenu', entidad);
  }
  ListarDetalleMenuCombo(perfil){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenuCombo?intIdPerfil=' + perfil);
  }
  ListarDetalleComponentePaginado(detallemenu,pagina,seccion,modulo,componente,skip,take){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarDetallePerfilMenuComponente?intIdDetallePerfilMenu=' + detallemenu + '&strPagina=' + pagina +'&strSeccion=' + seccion + '&strModulo=' + modulo + '&strNombreComponente=' + componente + '&intSkip='+ skip +'&intTake=' + take);
  }
  modificarDetalleComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarDetallePerfilMenuComponente', entidad);
  }
  anularDetalleComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularDetallePerfilMenuComponente', entidad);
  }
  ListarComponentePendientes(detalleMenu){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponentesPendientes?intIdDetallePerfilMenu=' + detalleMenu);
  }
  registrarDetalleMenuComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarDetallePerfilMenuComponente ', entidad);
  }
  ListarDetalleMenuTreeview(perfil:any,intIdModulo:number){
    return this.http.get( Settings.API_ENDPOINT + 'api/ListarDetalleMenu?intIdPerfil=' + perfil+'&intIdModulo='+intIdModulo);
  }

  listarRegionesSegunPerfilUsuario(idPerfil: number, idUsuario: number){
    return this.http.get(Settings.API_ENDPOINT + "api/listarPerfilUsuario?intIdPerfil=" + idPerfil + "&intIdUsuario=" + idUsuario);
  }


  insertarPerfilConfiguracion(param:any){
    let entidad = { data : JSON.stringify(param) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarPerfilConfiguracion ', entidad);
  }
  anularPerfilConfiguracion(param:any){
    let entidad = { data : JSON.stringify(param) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularPerfilConfiguracion ', entidad);
  }
  listarPerfilConfiguracion(intIdPerfil: number){
    return this.http.get(Settings.API_ENDPOINT + "api/listarPerfilConfiguracion?intIdPerfil=" + intIdPerfil);
  }


}
