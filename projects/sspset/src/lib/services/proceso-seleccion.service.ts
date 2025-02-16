import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { ProcesoSeleccionBienesServiciosRequest } from '../../models/request/proceso-seleccion-bs-request';
import { Observable } from 'rxjs/Observable';
import {Proyecto } from '../../models/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProcesoSeleccionService {

  constructor(private http: HttpClient) { }

  listarProcesoSeleccion(parametro: ProcesoSeleccionBienesServiciosRequest):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    let parametros = {
      "codigo_snip": parametro.snip,
      "codigo_unificado": parametro.codigo_unificado,
      "id_objeto": parametro.tipo,
      "limit": parametro.num_filas,
      "offset": parametro.numero_Pagina,
      "id_fase":parametro.id_fase
    }

      return this.http.get(Settings.API_ENDPOINT_SET + "api/listarConosceProcesoSeleccionSSP?strParametro=" + JSON.stringify(parametros),{ headers: headers });
    //return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProcesoSeleccion?intCodigoSnip=" + parametro.snip + "&intCodigoUnificado=" + parametro.codigo_unificado + "&intObjeto=" + parametro.tipo + "&intInicio="+ parametro.numero_Pagina + "&intTamanio=" + parametro.num_filas,{ headers: headers });
  }

  listarProcesoSeleccionComentario(idProyecto : number,intIdMunicipalidad : number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProcesoSeleccionObra?intIdProyecto=" + idProyecto + "&intIdMunicipalidad="+ intIdMunicipalidad,{ headers: headers });
  }

  /*agregado*/
  listarProcesoSeleccionObra(idProyecto : number,intIdMunicipalidad : number,intIdFase : number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    //return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProcesoSeleccionObra?intIdProyecto=" + idProyecto + "&intIdMunicipalidad="+ intIdMunicipalidad+"&intIdTipoFase="+intIdFase,{ headers: headers });
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarProcesoSeleccionExpediente?intIdProyecto=" + idProyecto + "&intIdMunicipalidad="+ intIdMunicipalidad+"&intIdTipoFase="+intIdFase,{ headers: headers });
  } 

  registrarProcesoSeleccionComentario(data: any):Observable<any>  {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarProcesoSeleccionExpediente/", entidad,{ headers: headers });
  }
  actualizarProcesoSeleccionComentario(data: any):Observable<any>  {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/modificarProcesoSeleccionExpediente/", entidad,{ headers: headers });
  }

  verResultado(parametro: ProcesoSeleccionBienesServiciosRequest):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/listarDetalleConosceProcesoSeleccion?strParametro={"identificador":' + parametro.identificador + ',"id_objeto":' + parametro.tipo + '}',{ headers: headers });
    //return this.http.get(Settings.API_ENDPOINT_SET + "api/obtenerProcesoSeleccion?intCodigoSnip=" + parametro.snip + "&intCodigoUnificado=" + parametro.codigo_unificado + "&intIdentificador="+ parametro.identificador + "&intObjeto=" + parametro.tipo,{ headers: headers });
  }

  actualizarContratacionObra(data: any){
    let entidad = {
      data: JSON.stringify(data)
    }
    // return this.http.post(settings);
  }

  actualizarGarantia(data: any):Observable<any>  {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarGarantia/", entidad, {headers : headers});
  }

  listarGarantia(idProyecto : number):Observable<any> {
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarGarantia?intIdProyecto=" + idProyecto, {headers : headers });
  }
  //



  listarFaseIdentificador(intIdFase : number,intObjeto : number,intTamanio : number,intInicio : number){
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarFaseIdentificador?intIdFase="+intIdFase+"&intObjeto="+intObjeto+"&intTamanio="+intTamanio+"&intInicio="+intInicio);
  }
  listarFaseIdentificadorExonerar(intIdFase : number,intObjeto : number,intTamanio : number,intInicio : number,strEntidad: string, strDescripcion: string){
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarFaseIdentificadorExonerar?intIdFase="+intIdFase+"&intObjeto=0&intTamanio="+intTamanio+"&intInicio="+intInicio+"&strEntidad="+strEntidad+"&strDescripcion="+strDescripcion);
  }
  listarEntidadesBusquedaConvocatorias(){
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarConosceConvocatoriasEntidad");
  }
  listarConvocatoriasBusquedaDescripcion(pDescripcionItem){
    let parametros = {
      "descripcion_item": pDescripcionItem
    }
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarConosceConvocatoriasDescripcionItem?strParametro=" + JSON.stringify(parametros));
  }
  insertarFaseIdentificador(data:any){
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/insertarFaseIdentificador/", entidad);
  }
  anularFaseIdentificador(data:any){
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT_SET + "api/anularFaseIdentificador/", entidad);
  }
  listarVersionCronograma(codigoconvocatoria:number){
    let parametros = {
      "codigoconvocatoria": codigoconvocatoria
    }
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarVersionCronograma?ipInput=" + JSON.stringify(parametros));
  }
  listarCronograma(codigoconvocatoria:number,version_cronograma:number){
    let parametros = {
      "codigoconvocatoria": codigoconvocatoria,
      "version_cronograma": version_cronograma
    }
    return this.http.get(Settings.API_ENDPOINT_SET + "api/listarCronograma?ipInput=" + JSON.stringify(parametros));
  }
}
