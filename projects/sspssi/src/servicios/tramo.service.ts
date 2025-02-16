import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})

export class TramoService {

  constructor(private http: HttpClient) { }

  BusquedaProyecto(nombreProyecto): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/ObtenerProyecto_NombreEjeDir?nombre_proyecto=' + nombreProyecto);
  }

  ListarTramoPaginado(busqueda, skip, take): Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarMantenimientoTramoEjeDir?busqueda=' + busqueda + '&skip=' + skip + '&take=' + take);
  }

  registrarTramo(tramo: any): Observable<any> {
    const entidad = { data: JSON.stringify(tramo) };
    return this.http.post(Settings.API_ENDPOINT + 'api/insertarTramoEjeDir', entidad);
  }

  editarTramo(tramo: any): Observable<any> {
    const entidad = { data: JSON.stringify(tramo) };
    return this.http.post(Settings.API_ENDPOINT + 'api/modificarTramoEjeDir', entidad);
  }

  anularTramo(tramo: any): Observable<any> {
    const entidad = { data: JSON.stringify(tramo) };
    return this.http.post(Settings.API_ENDPOINT + 'api/anularTramoEjeDir', entidad);
  }
}
