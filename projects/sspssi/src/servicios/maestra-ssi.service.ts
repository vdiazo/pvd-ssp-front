import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';



//import { AuthService } from '../auth/auth.service';
import { IUnidadEjecutora } from '../interfaces/IUnidadEjecutora';
import { IEstadosSituacionales } from '../interfaces/IEstadosSituacionales';
import { IMunicipalidad } from '../interfaces/IMunicipalidad';
import { IDepartamento } from '../interfaces/IDepartamento';
import { IReporteUnidadEjecutora } from '../interfaces/IReporteUnidadEjecutora';
import { MetodoService } from './metodo.service';
@Injectable({
  providedIn: 'root'
})
export class MaestraSsiService {

  constructor(private http: HttpClient,
    private httpFile: Http, private metodo: MetodoService
    //,private authService: AuthService
  ) { }

  AyudaMemoria(intIdTramo) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarAyudaMemoriaEjeDir?intIdTramo=" + intIdTramo, { headers: headers });
  }

  AyudaMemoriaExpediente(intIdTramo: number) {
    let token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(`${Settings.API_ENDPOINT}api/listarAyudaMemoriaExpedienteEjeDir?intIdTramo=${intIdTramo}`, { headers: headers });
  }

  GenerarPDF(strHtml) {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    })
    return this.http.post(Settings.API_ENDPOINT + "api/GenerarPdf?strHtml=" + strHtml, { strHtml: strHtml }, { responseType: 'text' });
  }

  listarZona() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarZona");
  }

  listarDepartamentos(): Observable<IDepartamento[]> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IDepartamento[]>(Settings.API_ENDPOINT + "api/listarDepartamento", { headers: headers });
  }

  listarArea() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarArea");
  }

  listarPerfiles() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarPerfilCombo");
  }

  listarTipoDocumentoCompromiso() {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarDocumentoCompromisoEjeDir", { headers: headers });
  }

  listarTipoFases(): Observable<any> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoFaseEjeDir", { headers: headers });
  }

  listarTipoInfraestructura() {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoInfraestructuraEjeDir", { headers: headers });
  }

  listarUnidadMedidas() {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarUnidadMedidaEjeDir", { headers: headers });
  }

  listarTipoDocumento() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoDocumentoEjeDir");
  }

  listarTipoColegiatura() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarColegiaturaEjeDir");
  }

  listarTipoVia() {
    /*     let token = sessionStorage.getItem("token");
        //let accessToken = this.authService.getAccessToken();
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }) */
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoViaEjeDir");
  }

  listarEstadoTipoVia() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarEstadoTipoViaEjeDir");
  }

  listarDenominacion() {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(Settings.API_ENDPOINT + "api/listarFuenteFinanciamientoEjeDir", { headers: headers });
  }

  listarMunicipalidad(): Observable<IMunicipalidad[]> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IMunicipalidad[]>(Settings.API_ENDPOINT + "api/listarMunicipalidad", { headers: headers });
  }


  listarMunicipalidadPorFiltro(pbeProyecto, pNombreMunicipalidad): Observable<IUnidadEjecutora[]> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IUnidadEjecutora[]>(Settings.API_ENDPOINT + "api/listarMunicipalidad?intIdUsuario=" + pbeProyecto.id_usuario + "&intIdPerfil=" + pbeProyecto.id_perfil + "&strNombreMunicipalidad=" + pNombreMunicipalidad, { headers: headers });
  }

  listarEstadosSituacional(): Observable<IEstadosSituacionales[]> {
    let token = sessionStorage.getItem("token");
    //let accessToken = this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IEstadosSituacionales[]>(Settings.API_ENDPOINT + "api/listarEstadoSituacionalEjeDir", { headers: headers });
  }

  listarEstadoProyecto() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarProyectoEstadoEjeDir");
  }

  listarTipoParalizacionAccion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoParalizacionAccionObraEjeDir");
  }

  listarProgramaEjecucionFinanciera() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarProgramaEjecucionFinancieraObraEjeDir");
  }

  listarDocumentoAprobacion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarDocumentoAprobacionObraEjeDir");
  }

  listarResponsables(idSeguimientoMonitoreoObra) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarResponsablesEjeDir?intId_seguimiento_monitoreo_obra=" + idSeguimientoMonitoreoObra);
  }

  registrarArchivo(file: any) {

    let formData: FormData = new FormData();

    formData.append('uploadFile', file, file.name);
    let headers = new Headers()

    let options = new RequestOptions({ headers: headers });

    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipoArchivo.ampliacion;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  registrarArchivoData(file: any, tipo: any) {
    let formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    let headers = new Headers()
    //let accessToken = this.authService.getAccessToken();
    let accessToken = sessionStorage.getItem("token");
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivoEjeDir?tipoArchivo=" + tipo;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  consultDatosAuditoria(pIdFase) {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarAuditoriaMonitorEjeDir?intIdFase=" + pIdFase);
  }

  consultDatosAuditoriaExpediente(pIdFase) {
    return this.http.get(Settings.API_ENDPOINT + 'api/ListarAuditoriaExpedienteEjeDirSet?intIdFase=' + pIdFase);
  }

  listarReporteUnidadEjecutoras(intUnidadEjecutora: number = 0, strRegion: string = "", strNombres: string = "", intSkip: number = 10, intTake: number = 0): Observable<IReporteUnidadEjecutora> {
    return this.http.get<IReporteUnidadEjecutora>(Settings.API_ENDPOINT + `api/reporteUnidadEjecutora?intUnidadEjecutora=${intUnidadEjecutora}&strRegion=${strRegion}&strNombres=${strNombres}&intSkip=${intSkip}&intTake=${intTake}`);
  }

  // listarReporteAltaDireccion(intCodSnip: number = 0, strEstadoProyecto: string = "", intIdMunicipalidad: number = 0, strCodDepa: string = "", intSkip: number = 10, intTake: number = 0) {
  //   return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAltaDireccion?intCodSnip=' + intCodSnip + '&strEstadoProyecto=' + strEstadoProyecto + '&intIdMunicipalidad=' + intIdMunicipalidad + '&strCodDepa=' + strCodDepa + '&intSkip=' + intSkip + '&intTake=' + intTake);
  // }

  listarReporteAltaDireccionEjeDir(intCodSnip: number = 0, strEstadoProyecto: string = "", intIdMunicipalidad: number = 0, strCodDepa: string = "", intSkip = 10, intTake = 0) {
    return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAltaDireccionEjeDir?intCodSnip=' + intCodSnip + '&strEstadoProyecto=' + strEstadoProyecto + '&intIdMunicipalidad=' 
    + intIdMunicipalidad + '&strCodDepa=' + strCodDepa  + '&intSkip=' + intSkip + '&intTake=' + intTake);
  }
}
