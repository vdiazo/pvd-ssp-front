import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  ListarMenuSinPaginado(busqueda,id_modulo){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarMenu?intIdMenuPadre=' + busqueda+'&intIdModulo='+id_modulo);
  }
  ListarMenuPaginado(busqueda,skip,take){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarMenu?intIdMenuPadre=' + busqueda + '&intSkip='+ skip +'&intTake=' + take);
  }
  listadoMenuCombo(){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarMenuCombo');
  }
  registrarMenu(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarMenu', entidad);
  }
  editarMenu(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarMenu', entidad);
  }
  anularMenu(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularMenu', entidad);
  }
}
