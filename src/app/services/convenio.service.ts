import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Settings } from '../appSettings/settings';
import { tipoArchivo } from '../appSettings/enumeraciones';
@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient, private httpFile: Http) { }

  ValidarConvenio(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/ValidarConvenio', entidad);
  }

  registrarConvenioSosem(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/procesoConvenio', entidad);

  }

  eliminarConvenioSosem(convenio: any) {
    let entidad = { data: JSON.stringify(convenio) }
    return this.http.post(Settings.API_ENDPOINT + 'api/anularConvenio', entidad);
  }

  BusquedaProyecto(snip, siaf) {

    return this.http.get(Settings.API_ENDPOINT + 'api/ObtenerProyecto?cod_snip=' + snip + '&cod_unificado=' + siaf);
  }

  ListarEjecutora(idmuni) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarEjecutora?strIdMunicipalidad=' + idmuni);
  }

  listarConvenioXidFaseXidMunicipalidad(idFase: number, idMunicipalidad: number, numFilas, numPaginas) {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarConvenio/' + idFase + '/' + idMunicipalidad+ '/' + numFilas+ '/' + numPaginas);
  }

  ListarConvenios(snip: number, siaf: number, nomProyecto, nomTramo, idfase: number,id_transferencia : number, nomSiglas, skip: number, take: number) {
    let entidad = {
      cod_snip: snip,
      cod_unificado: siaf,
      "nombre_proyecto": nomProyecto,
      "nombre_tramo": nomTramo,
      id_fase: idfase,
      id_transferencia:id_transferencia,
      "siglas": nomSiglas,
      skip: skip,
      take: take
    }
    return this.http.post(Settings.API_ENDPOINT + 'api/ObtenerConvenio', { data: JSON.stringify(entidad) });
  }

  registrarArchivo(file: any) {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.convenio;
    return this.httpFile.post(apiUrl1, formData, options);
  }
}

