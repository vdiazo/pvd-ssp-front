import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from 'src/app/appSettings/settings';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  constructor(private http: HttpClient) { }
  
  listar(IdSeguimientoMonitoreoObra: number, intSkip: number, intTake: number) {
    let url = Settings.API_ENDPOINT + "api/listarPresupuestoAdicionalObra/" + IdSeguimientoMonitoreoObra + "/" + intSkip + "/" + intTake;
    return this.http.get(url);
  }

  grabar(data){
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarPresupuestoAdicionalObra", entity);
  }

  actualizar(data){
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarPresupuestoAdicionalObra", entity);
  }

  eliminar(data){
    let entity = { data: JSON.stringify(data) }
    return this.http.post(Settings.API_ENDPOINT + "api/anularPresupuestoAdicionalObra", entity);
  }

}
