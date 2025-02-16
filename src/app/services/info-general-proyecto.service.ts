import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class InfoGeneralProyectoService {

  constructor(private http: HttpClient) { }

  ListarInfoProyecto(snip){    
    return this.http.get( Settings.API_ENDPOINT + 'api/listarInfoProyecto?strCodigoUnico=' + snip);
  }
}
