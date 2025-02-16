import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';

@Injectable({
  providedIn: 'root'
})
export class SuspensionService {

  constructor(private http:HttpClient, private httoFile:Http) { }

  listarSuspensionObra(id, perfil: string, pNumPagina,pNumeroFilasMostrar) {
    let url = Settings.API_ENDPOINT + 'api/listarSuspensionObra?idSeguimientoMonitoreoObra=' + id + "&strPerfil=" + perfil + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina;
    return this.http.get(url);
  }

  insertarSuspensionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarSuspensionObra/", entidad);
  }

  modificarSuspensionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarSuspensionObra/", entidad);
  }

  anularSuspensionObra(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularSuspensionObra", entidad)
  }

  validarSuspensionObra(idSeguimientoMonitoreoObra,strPerfil:string,pFechaInicioSuspension,pSuspensionInicial,pIdSuspensionObra) {
    let parametro = {
      "id_seguimiento_monitoreo_obra": idSeguimientoMonitoreoObra,
      "perfil": strPerfil,
      "fecha_creacion": pFechaInicioSuspension,
      "es_suspension_inicial": pSuspensionInicial,
      "id_suspension_obra":pIdSuspensionObra
    }
    //let url = Settings.API_ENDPOINT + 'api/validarSuspensionObra?idSeguimientoMonitoreoObra=' + idSeguimientoMonitoreoObra + "&strPerfil=" + strPerfil;
    let url = Settings.API_ENDPOINT + 'api/validarSuspensionObra?data=' + JSON.stringify(parametro);
    return this.http.get(url);
  }

  validarSuspensionObraEliminar(idSeguimientoMonitoreoObra,strPerfil:string,pSuspensionInicial,pIdSuspensionObra) {
    let parametro = {
      "id_seguimiento_monitoreo_obra": idSeguimientoMonitoreoObra,
      "perfil": strPerfil,
      "es_suspension_inicial": pSuspensionInicial,
      "id_suspension_obra":pIdSuspensionObra
    }
    let url = Settings.API_ENDPOINT + 'api/validarSuspensionObraEliminar?data=' + JSON.stringify(parametro);
    return this.http.get(url);
  }





}
