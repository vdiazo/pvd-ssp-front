import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { RequestOptions } from '@angular/http';
import { Proyecto } from '../models/request/proyecto-request';
@Injectable({
  providedIn: 'root'
})
export class MetasService {

  constructor(
    private http:HttpClient
  ) {}


  //http://172.22.9.76/ssppvd-qas/api/ListarProyectoGeneralMeta?intCodSnip=0&strNombreProyecto=&intIdUsuario=271&intIdPerfil=1&intSkip=10&strCodDepartamento=&intTake=1&intIdMunicipalidad=0


  ListarProyectoGeneralMeta(beProyecto: Proyecto) {
    if (beProyecto.cod_snip_texto == "") {
      beProyecto.cod_snip = 0;
    } else {
      beProyecto.cod_snip = parseInt(beProyecto.cod_snip_texto);
    }
    let url = Settings.API_ENDPOINT + "api/ListarProyectoGeneralMeta?intCodSnip=" + beProyecto.cod_snip + "&strNombreProyecto=" + beProyecto.nombre_proyecto + "&intIdUsuario=" + beProyecto.id_usuario + "&intIdPerfil=" + beProyecto.id_perfil + "&intSkip=" + beProyecto.num_filas + "&strCodDepartamento=" + beProyecto.coddepartamento + "&intTake=" + beProyecto.num_pagina + "&intIdMunicipalidad=" + beProyecto.id_municipalidad;
    return this.http.get(url);
  }


  listarMeta(intIdProyecto:number,intSkip:number,desde:number){
    //return this.http.get( Settings.API_ENDPOINT + 'api/listarMeta?intIdProyecto='+intIdProyecto+'&intSkip='+intSkip+'&intTake='+desde);
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get( Settings.API_ENDPOINT + 'api/listarMeta?intIdProyecto='+intIdProyecto+'&intSkip='+intSkip+'&intTake='+desde);
    //return this.http.get("http://172.22.9.76/ssppvd-qas/api/listarMeta?intIdProyecto=790&intSkip=5&intTake=0",{headers : headers});
  }

  listarMetaComponente(){
    //return this.http.get( Settings.API_ENDPOINT + 'api/listarMeta?intIdProyecto='+'790'+'&intSkip='+'5'+'&intTake='+'0')
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarMetaComponente",{headers : headers});
  }
  
  listarTipoIntervencion(intIdMetaComponente:number){
    //return this.http.get( Settings.API_ENDPOINT + 'api/listarMeta?intIdProyecto='+'790'+'&intSkip='+'5'+'&intTake='+'0')
    let token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoIntervencion?intIdMetaComponente="+intIdMetaComponente,{headers : headers});
  }

  insertarMeta(objeto:any){
    // let token=sessionStorage.getItem("token");
    // const headers=new HttpHeaders({
    //   'Authorization':`Bearer ${token}`
    // })
    // let entidad = {
    //   data : JSON.stringify(AvanceEntregable)
    // }
    // return this.http.post(Settings.API_ENDPOINT + "api/insertarMeta", entidad,{headers : headers});

    let entidad = { data : JSON.stringify(objeto) }
    return this.http.post( Settings.API_ENDPOINT + 'api/insertarMeta', entidad);

  }
  anularMeta(objeto:any){
    let entidad = { data : JSON.stringify(objeto) }
    return this.http.post( Settings.API_ENDPOINT + 'api/anularMeta', entidad);
  }
}
