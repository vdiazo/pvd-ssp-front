import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class TramoService {

  constructor(private http: HttpClient) { }

  BusquedaProyecto(nombreProyecto){    
    return this.http.get( Settings.API_ENDPOINT + 'api/ObtenerProyecto_Nombre?nombre_proyecto='+nombreProyecto);
  }
  ListarTramoPaginado(busqueda,skip,take){    
    return this.http.get( Settings.API_ENDPOINT + 'api/listarMantenimientoTramo?busqueda='+ busqueda+'&skip='+ skip+'&take='+take);
  }
  registrarTramo(tramo:any){    
    let entidad = { data : JSON.stringify(tramo) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarTramo', entidad);
  }
  editarTramo(tramo:any){    
    let entidad = { data : JSON.stringify(tramo) }
    return this.http.post( Settings.API_ENDPOINT + 'api/modificarTramo', entidad);
  }
  anularTramo(tramo:any){    
    let entidad = { data : JSON.stringify(tramo) }
    
    return this.http.post( Settings.API_ENDPOINT + 'api/anularTramo', entidad);
  }
}
