import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoCapacitacionService {

  constructor(private http:HttpClient) { }

  insertarCapacitacion(capacitacion:any){
    let entidad = { data : JSON.stringify(capacitacion) }
    return this.http.post( Settings.API_ENDPOINT + 'api/InsertarCapacitacion', entidad);
  }

  modificarCapacitacion(capacitacion:any){
    let entidad = { data : JSON.stringify(capacitacion) }
    return this.http.post( Settings.API_ENDPOINT + 'api/ModificarCapacitacion', entidad);
  }

  anularCapacitacion(capacitacion:any){
    let entidad = { data : JSON.stringify(capacitacion) }
    return this.http.post( Settings.API_ENDPOINT + 'api/AnularCapacitacion', entidad);
  }

  listarCapacitacion(idTipoCapacitacion:number,intSkipe:number,intTake:number){
    let url=Settings.API_ENDPOINT+'api/ListarCapacitacion?intIdTipoCapacitacion='+idTipoCapacitacion+'&intSkipe='+intSkipe+'&intTake='+intTake;
    return this.http.get(url);
  }

  listarCapacitacionControl(){
    let url=Settings.API_ENDPOINT+'api/ListarCapacitacionControl';
    return this.http.get(url);
  }

}
