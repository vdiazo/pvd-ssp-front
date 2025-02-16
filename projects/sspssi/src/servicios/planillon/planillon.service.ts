import { Settings } from './../../appSettings/settings';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanillonService {

  constructor(private http: HttpClient) { }

  listarProyectoPlanillonGeneral(ipInput): Observable<any> {
    let token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = `${Settings.API_ENDPOINT}api/ListarProyectoGeneralPlanillon?intCodSnip=${ipInput.cod_snip}&intIdPrograma=${ipInput.id_programa}&strNombreProyecto=${ipInput.nombre_proyecto}&intAnioEje=${ipInput.anio_eje}&intIdUsuario=${ipInput.id_usuario}&intIdPerfil=${ipInput.id_perfil}&intLimit=${ipInput.limit}&intOffset=${ipInput.offset}`;

    return this.http.get(url, { headers: headers });
  }

  listarDetalleComponenteProyecto(ipInput): Observable<any>{
    let url = `${Settings.API_ENDPOINT}api/listarDetalleComponenteProyectoPlanillonEjeDir?intCodSnip=${ipInput.cod_snip}&intAnioEje=${ipInput.anio}`;

    return this.http.get(url);
  }

  // programacion financiera - fase Obra
  listarProgramacionFinancieraObra(ipInput): Observable<any> {
    let token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = `${Settings.API_ENDPOINT}api/listarProgramacionFinancieraEjeDir/${ipInput.id_seguimiento_monitoreo_obra}/${ipInput.skip}/${ipInput.take}`;
    return this.http.get(url, { headers: headers })
  }

  insertarProgramacionFinancieraObra(cronograma: any) {
    let entidad = {
      data: JSON.stringify(cronograma)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/insertarProgramacionFinancieraEjeDir`, entidad);
  }

  modificarProgramacionFinancieraObra(cronograma: any) {
    let entidad = {
      data: JSON.stringify(cronograma)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/modificarProgramacionFinancieraEjeDir`, entidad);
  }

  anularProgramacionFinancieraObra(pEnvio: any) {
    let entidad = {
      data: JSON.stringify(pEnvio)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/anularProgramacionFinancieraEjeDir`, entidad);
  }

  // programacion financiera - fase Expediente tecnico
  listarProgracionFinancieraExpTecnico(ipInput: any): Observable<any> {
    let token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = `${Settings.API_ENDPOINT}api/listarProgramacionFinancieraExpedienteEjeDirSet/${ipInput.id_seguimiento_monitoreo}/${ipInput.skip}/${ipInput.take}`;
    return this.http.get(url, { headers: headers })
  }

  listarTipoProgramacionFinancieraExpTecnico(idSeguimientoMonitoreoExpediente: number) {
    return this.http.get(`${Settings.API_ENDPOINT}api/listarTipoPeriodoCronogramaEjeDirSet?IdSeguimientoMonitoreoExpediente=${idSeguimientoMonitoreoExpediente}`);
  }

  insertarProgramacionFinancieraExpTecnico(cronograma: any) {
    let entidad = {
      data: JSON.stringify(cronograma)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/insertarProgramacionFinancieraExpedienteEjeDirSet`, entidad);
  }

  modificarProgramacionFinancieraExpTecnico(cronograma: any) {
    let entidad = {
      data: JSON.stringify(cronograma)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/modificarProgramacionFinancieraExpedienteEjeDirSet`, entidad);
  }

  anularProgramacionFinancieraExpTecnico(pEnvio: any) {
    let entidad = {
      data: JSON.stringify(pEnvio)
    }
    return this.http.post(`${Settings.API_ENDPOINT}api/anularProgramacionFinancieraExpedienteEjeDirSet`, entidad);
  }
}
