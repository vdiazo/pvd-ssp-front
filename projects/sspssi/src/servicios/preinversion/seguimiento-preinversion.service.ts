import { Injectable } from '@angular/core';
import { MetodoService } from '../metodo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarSeguimientoPreinversionInicial(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarSeguimientoInicialPreInversion', ipInput);
  }

  listarSeguimientoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarSiguimientoPreInversion', ipInput);
  }

  modificarSeguimientoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertSeguimientoPreInversion', ipInput);
  }

  definirSeguimientoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/DefinirSeguimientoPreInversion', ipInput);
  }

  // listar componentes del estudio
  listarTipoComponentesPreinversionCombo(): Observable<any> {
    return this.metodoSvc._GET('api/ListarTipoComponentePreInversion');
  }

  listarComponentesPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarComponenteProyectoPreInversion', ipInput);
  }

  insertarDetalleComponentesPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarComponenteProyectoPreInversion', ipInput);
  }

  modificarDetalleComponentesPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarComponenteProyectoPreInversion', ipInput);
  }

  vincularSigatPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ValidarContratoPreInversion', ipInput);
  }

  listarVinculacionSigatPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarValidarContratoPreInversion', ipInput);
  }

  // listar auditoria
  listarAuditoriaPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarAuditoriaPreInversion', ipInput);
  }
}
