import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { ProcesoSeleccionBienesServiciosRequest } from '../models/request/proceso-seleccion-bs-request';

@Injectable({
  providedIn: 'root'
})
export class ProcesoSeleccionService {

  constructor(private http: HttpClient) { }

  listarProcesoSeleccion(parametro: ProcesoSeleccionBienesServiciosRequest) {
    //return this.http.get(Settings.API_ENDPOINT + "api/listarProcesoSeleccion?intCodigoSnip=" + parametro.snip + "&intCodigoUnificado=" + parametro.codigo_unificado + "&intObjeto=" + parametro.tipo + "&intInicio="+ parametro.numero_Pagina + "&intTamanio=" + parametro.num_filas);
    let parametros = {
      "codigo_snip": parametro.snip,
      "codigo_unificado": parametro.codigo_unificado,
      "id_objeto": parametro.tipo,
      "limit": parametro.num_filas,
      "offset": parametro.numero_Pagina,
      "id_fase":parametro.id_fase

    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarConosceProcesoSeleccionSSP?strParametro=" + JSON.stringify(parametros));
    //api/listarConosceProcesoSeleccionSSP
  }

  listarProcesoSeleccionComentario(idProyecto : number,intIdMunicipalidad : number, intIdFase: number) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarProcesoSeleccionObra?intIdProyecto=" + idProyecto + "&intIdMunicipalidad="+ intIdMunicipalidad+"&intIdTipoFase="+intIdFase);
    //return this.http.get(Settings.API_ENDPOINT + "api/listarProcesoSeleccionObra?intIdProyecto=" + idProyecto + "&intIdMunicipalidad="+ intIdMunicipalidad);
  }

  registrarProcesoSeleccionComentario(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarProcesoSeleccionObra/", entidad);
  }
  actualizarProcesoSeleccionComentario(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/modificarProcesoSeleccionObra/", entidad);
  }

  verResultado(parametro: ProcesoSeleccionBienesServiciosRequest){
    return this.http.get(Settings.API_ENDPOINT + 'api/listarDetalleConosceProcesoSeleccion?strParametro={"identificador":' + parametro.identificador + ',"id_objeto":' + parametro.tipo + '}');
    //return this.http.get(Settings.API_ENDPOINT + "api/obtenerProcesoSeleccion?intCodigoSnip=" + parametro.snip + "&intCodigoUnificado=" + parametro.codigo_unificado + "&intIdentificador="+ parametro.identificador + "&intObjeto=" + parametro.tipo);
  }

  actualizarContratacionObra(data: any){
    let entidad = {
      data: JSON.stringify(data)
    }
    // return this.http.post(settings);
  }

  actualizarGarantia(data: any) {
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarGarantia/", entidad);
  }

  listarGarantia(idProyecto : number){
    return this.http.get(Settings.API_ENDPOINT + "api/listarGarantia?intIdProyecto=" + idProyecto);
  }

  listarFaseIdentificador(intIdFase : number,intObjeto : number,intTamanio : number,intInicio : number){
    return this.http.get(Settings.API_ENDPOINT + "api/listarFaseIdentificador?intIdFase="+intIdFase+"&intObjeto="+intObjeto+"&intTamanio="+intTamanio+"&intInicio="+intInicio);
  }
  listarFaseIdentificadorExonerar(intIdFase : number,intObjeto : number,intTamanio : number,intInicio : number,strEntidad: string, strDescripcion: string){
    return this.http.get(Settings.API_ENDPOINT + "api/listarFaseIdentificadorExonerar?intIdFase="+intIdFase+"&intObjeto=0&intTamanio="+intTamanio+"&intInicio="+intInicio+"&strEntidad="+strEntidad+"&strDescripcion="+strDescripcion);
  }

  listarEntidadesBusquedaConvocatorias(){
    return this.http.get(Settings.API_ENDPOINT + "api/listarConosceConvocatoriasEntidad");
  }
  listarConvocatoriasBusquedaDescripcion(pDescripcionItem){
    let parametros = {
      "descripcion_item": pDescripcionItem
    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarConosceConvocatoriasDescripcionItem?strParametro=" + JSON.stringify(parametros));
  }
  insertarFaseIdentificador(data:any){
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/insertarFaseIdentificador/", entidad);
  }
  anularFaseIdentificador(data:any){
    let entidad = {
      data: JSON.stringify(data)
    }
    return this.http.post(Settings.API_ENDPOINT + "api/anularFaseIdentificador/", entidad);
  }
  
  listarVersionCronograma(codigoconvocatoria:number){
    let parametros = {
      "codigoconvocatoria": codigoconvocatoria
    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarVersionCronograma?ipInput=" + JSON.stringify(parametros));
  }
  listarCronograma(codigoconvocatoria:number,version_cronograma:number){
    let parametros = {
      "codigoconvocatoria": codigoconvocatoria,
      "version_cronograma": version_cronograma
    }
    return this.http.get(Settings.API_ENDPOINT + "api/listarCronograma?ipInput=" + JSON.stringify(parametros));
  }

}
