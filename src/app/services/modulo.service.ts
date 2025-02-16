import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  constructor(private http: HttpClient) { }

  ListarModulos(){
    return this.http.get( Settings.API_ENDPOINT + 'api/listarModulo');
  }
  listarModuloCombo(){
    let token = sessionStorage.getItem("token");    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })    
    return this.http.get( Settings.API_ENDPOINT+ 'api/listarModuloCombo',{ headers: headers });
  }
}