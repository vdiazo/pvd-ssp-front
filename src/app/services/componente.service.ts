import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {

  constructor(private http: HttpClient) { }

  ListarComponentePaginado(busqueda,skip,take){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponente?strNombreComponente=' + busqueda + '&intSkip='+ skip +'&intTake=' + take);
  }
  registrarComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarComponente', entidad);
  }
  editarComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarComponente', entidad);
  }
  anularComponente(menu:any){
    let entidad = { data : JSON.stringify(menu) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularComponente', entidad);
  }
  ////////////autocomplete
  AutoCompletePagina(busqueda){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponentePagina?strPagina=' + busqueda);
  }
  AutoCompleteModulo(busqueda){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponenteModulo?strModulo=' + busqueda);
  }
  AutoCompleteEvento(busqueda){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponenteEvento?strEvento=' + busqueda);
  }
  AutoCompleteSecciones(busqueda){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarComponenteSeccion?strSeccion=' + busqueda);
  }
}
