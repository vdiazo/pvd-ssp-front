import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Http,RequestOptions, Headers } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';

@Injectable({
  providedIn: 'root'
})
export class ParalizacionService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  listarParalizacion(id, perfil: string, pNumPagina,pNumeroFilasMostrar) {
    let url = Settings.API_ENDPOINT + 'api/listarParalizacionObra?idSeguimientoMonitoreoObra=' + id + "&strPerfil=" + perfil + "&intSkip=" + pNumeroFilasMostrar + "&intTake=" + pNumPagina;
    return this.http.get(url);
  }

  eliminarParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }

    return this.http.post(Settings.API_ENDPOINT + "api/anularParalizacionObra", entidad)
  }
  
  registrarParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarParalizacionObra/", entidad);
  }

  actualizarParalizacion(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarParalizacionObra/", entidad);
  }

  registrarArchivo(file: any) {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.paralizacion;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  validarCausalParalizacion(pIdSeguimientoMonitoreo,pPerfil,pFechaInicioParalizacion,pIdParalizacion){
    let parametro = {
      "id_seguimiento_monitoreo_obra": pIdSeguimientoMonitoreo,
      "perfil": pPerfil,
      "fecha_creacion": pFechaInicioParalizacion,
      "id_paralizacion_obra":pIdParalizacion
    }
    //return this.http.get(Settings.API_ENDPOINT + 'api/validarParalizacionObra?idSeguimientoMonitoreoObra=' + pIdSeguimientoMonitoreo + '&strPerfil=' + pPerfil);
    return this.http.get(Settings.API_ENDPOINT + 'api/validarParalizacionObra?data=' + JSON.stringify(parametro));
  }

  validarCausalParalizacionEliminar(pIdSeguimientoMonitoreo,pPerfil,pIdParalizacion){
    let parametro = {
      "id_seguimiento_monitoreo_obra": pIdSeguimientoMonitoreo,
      "perfil": pPerfil,
      "id_paralizacion_obra":pIdParalizacion
    }
    return this.http.get(Settings.API_ENDPOINT + 'api/validarParalizacionObraEliminar?data=' + JSON.stringify(parametro));
  }
}
