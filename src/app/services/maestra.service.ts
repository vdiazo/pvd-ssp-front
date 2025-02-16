import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { tipoArchivo } from '../appSettings/enumeraciones';
import { Settings } from '../appSettings/settings';
import { AuthService } from '../componentes/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { IUnidadEjecutora, IEstadosSituacionales } from '../Interfaces';
import { IMunicipalidad } from '../Interfaces/IMunicipalidad';
import { IDepartamento } from '../Interfaces/IDepartamento';
import { IReporteUnidadEjecutora } from '../Interfaces/IReporteUnidadEjecutora';

@Injectable({
  providedIn: 'root'
})
export class MaestraService {

  constructor(private http: HttpClient,
    private httpFile: Http,
    private authService: AuthService
  ) { }

  AyudaMemoria(intIdTramo) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarAyudaMemoria?intIdTramo=" + intIdTramo);
  }

  GenerarPDF(strHtml) {
    return this.http.post(Settings.API_ENDPOINT + "api/GenerarPdf?strHtml=" + strHtml, { strHtml: strHtml }, { responseType: 'text' });
  }

  listarZona() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarZona");
  }

  listarDepartamentos(): Observable<IDepartamento[]> {
    return this.http.get<IDepartamento[]>(Settings.API_ENDPOINT + "api/listarDepartamento");
  }

  listarArea() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarArea");
  }

  listarPerfiles() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarPerfilCombo");
  }

  listarTipoDocumentoCompromiso() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarDocumentoCompromiso");
  }

  listarTipoFases() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoFase");
  }

  listarDispositivoTransferencia() {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarTransferenciaCombo");
  }

  listarTipoInfraestructura() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoInfraestructura");
  }

  listarUnidadMedidas() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarUnidadMedida");
  }

  listarTipoDocumento() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoDocumento");
  }

  listarTipoColegiatura() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarColegiatura");
  }

  listarTipoVia() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoVia");
  }

  listarDenominacion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarFuenteFinanciamiento");
  }

  listarMunicipalidad(): Observable<IMunicipalidad[]> {
    return this.http.get<IMunicipalidad[]>(Settings.API_ENDPOINT + "api/listarMunicipalidad");
  }


  listarMunicipalidadPorFiltro(pbeProyecto, pNombreMunicipalidad): Observable<IUnidadEjecutora[]> {
    return this.http.get<IUnidadEjecutora[]>(Settings.API_ENDPOINT + "api/listarMunicipalidad?intIdUsuario=" + pbeProyecto.id_usuario + "&intIdPerfil=" + pbeProyecto.id_perfil + "&strNombreMunicipalidad=" + pNombreMunicipalidad);
  }

  listarEstadosSituacional(pid_seguimiento_monitoreo_obra): Observable<IEstadosSituacionales[]> {
    return this.http.get<IEstadosSituacionales[]>(Settings.API_ENDPOINT + "api/listarEstadoSituacional?id_seguimiento_monitoreo_obra=" + pid_seguimiento_monitoreo_obra);
  }

  listarEstadoProyecto() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarProyectoEstado");
  }

  listarTipoParalizacionAccion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarTipoParalizacionAccionObra");
  }

  listarProgramaEjecucionFinanciera() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarProgramaEjecucionFinancieraObra");
  }

  listarDocumentoAprobacion() {
    return this.http.get(Settings.API_ENDPOINT + "api/listarDocumentoAprobacionObra");
  }

  listarResponsables(idSeguimientoMonitoreoObra) {
    return this.http.get(Settings.API_ENDPOINT + "api/listarResponsables?intId_seguimiento_monitoreo_obra=" + idSeguimientoMonitoreoObra);
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
    let accessToken = this.authService.getAccessToken();
    headers.set("Authorization", `Bearer ${accessToken}`);
    let options = new RequestOptions({ headers: headers });
    let apiUrl1 = Settings.API_ENDPOINT + "api/SubirArchivo?tipoArchivo=" + tipo;
    return this.httpFile.post(apiUrl1, formData, options);
  }

  consultDatosAuditoria(pIdFase) {
    return this.http.get(Settings.API_ENDPOINT + "api/ListarAuditoriaMonitor?intIdFase=" + pIdFase);
  }

  listarReporteUnidadEjecutoras(intUnidadEjecutora: number = 0, strRegion: string = "", strNombres: string = "", intSkip: number = 10, intTake: number = 0): Observable<IReporteUnidadEjecutora> {
    return this.http.get<IReporteUnidadEjecutora>(Settings.API_ENDPOINT + `api/reporteUnidadEjecutora?intUnidadEjecutora=${intUnidadEjecutora}&strRegion=${strRegion}&strNombres=${strNombres}&intSkip=${intSkip}&intTake=${intTake}`);
  }

  // listarReporteAltaDireccion(intCodSnip: number = 0, strEstadoProyecto: string = "", intIdMunicipalidad: number = 0, strCodDepa: string = "", intSkip: number = 10, intTake: number = 0) {
  //   return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAltaDireccion?intCodSnip=' + intCodSnip + '&strEstadoProyecto=' + strEstadoProyecto + '&intIdMunicipalidad=' + intIdMunicipalidad + '&strCodDepa=' + strCodDepa + '&intSkip=' + intSkip + '&intTake=' + intTake);
  // }
  listarReporteAltaDireccion(intCodSnip: number = 0, strEstadoProyecto: string = "", intIdMunicipalidad: number = 0, strCodDepa: string = "", intSkip = 10, intTake = 0) {
    return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAltaDireccion?intCodSnip=' + intCodSnip + '&strEstadoProyecto=' +
      strEstadoProyecto + '&intIdMunicipalidad=' + intIdMunicipalidad + '&strCodDepa=' + strCodDepa + '&intSkip=' + intSkip + '&intTake=' + intTake);
  }
  listarReporteAltaDireccion_2(intCodSnip: number = 0, strEstadoProyecto: string = "", intIdMunicipalidad: number = 0, strCodDepa: string = "", intSkip: number = 10, intTake: number = 0) {
    return this.http.get(Settings.API_ENDPOINT + 'api/ListarReporteAltaDireccion_2?intCodSnip=' + intCodSnip + '&strEstadoProyecto=' + strEstadoProyecto +
      '&intIdMunicipalidad=' + intIdMunicipalidad + '&strCodDepa=' + strCodDepa);
  }

  listarLogoPVD() {
    return this.http.get(Settings.API_ENDPOINT + 'api/listarLogoPVD', { responseType: 'text' });
  }
  listarDepartamentoUsuario(idUsuario: any): Observable<IDepartamento[]> {
    return this.http.get<IDepartamento[]>(Settings.API_ENDPOINT + "api/listarDepartamentoUsuario?intIdUsuario=" + idUsuario);
  }
}
