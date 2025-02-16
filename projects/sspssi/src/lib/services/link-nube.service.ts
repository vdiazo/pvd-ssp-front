import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class LinkNubeService {

  constructor(private http: HttpClient) { }
 
  VisualizarArchivo(strarchivo: string,strruta:string ):Observable<any> {
    return this.http.get(Settings.API_ENDPOINT + `api/VisualizarArchivo?strarchivo=${strarchivo}&strruta=${strruta}`)
  }
}
