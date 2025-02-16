import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { ProcesoSeleccionBienesServiciosRequest } from '../models/request/proceso-seleccion-bs-request';
import { Observable } from "rxjs/Observable"; // <- add this import
import { MetodoService } from './metodo.service';
import { encodeBase64 } from '@progress/kendo-file-saver';
import { encode } from 'punycode';
@Injectable({
  providedIn: 'root'
})
export class ProcesoSeleccionService {

  constructor(private http: HttpClient, private metodo: MetodoService) { }

  listarProcesoSeleccion(parametro: ProcesoSeleccionBienesServiciosRequest) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get(Settings.API_ENDPOINT + 'api/listarConosceProcesoSeleccionEjeDir?strParametro={"id_fase":' + parametro.id_fase + ',"codigo_snip":'
      + parametro.snip +
      ',"codigo_unificado":' + parametro.codigo_unificado +
      ',"id_objeto":' + parametro.tipo +
      ',"limit":' + parametro.num_filas +
      ',"offset":' + 0 + '}',
      { headers: headers });
    //return this.http.get(Settings.API_ENDPOINT + 'api/listarConosceProcesoSeleccion?strParametro='+ cadena, { headers: headers });
  }

  listarProcesoSeleccionComentario(idProyecto: number, intIdMunicipalidad: number) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarProcesoSeleccionObraEjeDir?intIdProyecto=" + idProyecto + "&intIdMunicipalidad=" + intIdMunicipalidad, { headers: headers });
  }

  registrarProcesoSeleccionComentario(data: any) {
    let parametros = [{ parametro: "data", valor: JSON.stringify(data) }]
    return this.metodo._POST(Settings.API_ENDPOINT + "api/insertarProcesoSeleccionObraEjeDir/", parametros);
  }
  actualizarProcesoSeleccionComentario(data: any) {

    let parametros = [{ parametro: "data", valor: JSON.stringify(data) }]
    return this.metodo._POST(Settings.API_ENDPOINT + "api/modificarProcesoSeleccionObraEjeDir/", parametros);
  }

  verResultado(parametro: ProcesoSeleccionBienesServiciosRequest) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + 'api/listarDetalleConosceProcesoSeleccion?strParametro={"identificador":' + parametro.identificador + ',"id_objeto":' + parametro.tipo + '}', { headers: headers });
  }

  actualizarContratacionObra(data: any) {
    let parametros = [{ parametro: "data", valor: JSON.stringify(data) }]
    // return this.http.post(settings);
  }

  actualizarGarantia(data: any) {
    let parametros = [{ parametro: "data", valor: JSON.stringify(data) }]
    return this.metodo._POST(Settings.API_ENDPOINT + "api/insertarGarantiaEjeDir/", parametros);
  }

  listarGarantia(idProyecto: number) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarGarantiaEjeDir?intIdProyecto=" + idProyecto, { headers: headers });
  }

  listarFaseIdentificadorExonerar(intIdFase: number, intObjeto: number, intTamanio: number, intInicio: number, strEntidad: string, strDescripcion: string) {
    return this.http.get(`${Settings.API_ENDPOINT}api/listarFaseIdentificadorExonerarEjeDir?intIdFase=${intIdFase}&intObjeto=${intObjeto}&intTamanio=${intTamanio}&intInicio=${intInicio}&strEntidad=${strEntidad}&strDescripcion=${strDescripcion}`);
  }

  listarEntidadesBusquedaConvocatorias() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarConosceConvocatoriasEntidadEjeDir");
  }

  listarConvocatoriasBusquedaDescripcion(pDescripcionItem) {
    let parametros = {
      'descripcion_item': pDescripcionItem
    }
    return this.http.get(`${Settings.API_ENDPOINT}api/listarConosceConvocatoriasDescripcionItem?strParametro=${JSON.stringify(parametros)}`);
  }

  insertarFaseIdentificador(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarFaseIdentificadorEjeDir/", entidad);
  }

  anularFaseIdentificador(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularFaseIdentificadorEjeDir/", entidad);
  }
}
