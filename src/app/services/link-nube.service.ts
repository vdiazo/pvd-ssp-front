import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class LinkNubeService {

  constructor(private http: HttpClient) { }
 
  VisualizarArchivo(strarchivo: string,strruta:string ) {
    return this.http.get(Settings.API_ENDPOINT + `api/VisualizarArchivo?strarchivo=${strarchivo}&strruta=${strruta}`)
  }
}
