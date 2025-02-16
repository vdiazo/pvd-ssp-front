import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  // listar reponsables elaboracion estudio preinversion
  listarResponsablesUltimoRegistroPreInv(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarResponsableUltimoRegistroPreInversion', ipInput);
  }

  // listar responsables
  listarResponsableComboPreInv(): Observable<any> {
    return this.metodoSvc._GET('api/ListarResponsableComboPreInversion');
  }

  listarResponsablePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.GET_('api/ListarResponsablePreInversion', ipInput);
  }

  insertarResponsablePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarResponsablePreInversion', ipInput);
  }

  modificarResponsablePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarResponsablePreInversion', ipInput);
  }

  anularResponsablePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularResponsablePreInversion', ipInput);
  }

  // contratista

  listarContratistaComboPreinversion(): Observable<any> {
    return this.metodoSvc._GET('');
  }

  listarContratistaPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarContratistaPreInversion', ipInput);
  }

  insertarContratistaPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarContratistaPreInversion', ipInput);
  }

  modificarContratistaPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarContratistaPreInversion', ipInput);
  }

  anularContratistaPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularContratistaPreInversion', ipInput);
  }
}
