import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccionSeguimientoPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarAccionMonitoreoComboPreInv(): Observable<any> {
    return this.metodoSvc._GET('api/ListarAccionMonitoreoComboPreInversion');
  }

  listarAccionMonitoreoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarAccionMonitoreoPreInversion', ipInput);
  }

  insertarAccionMonitoreoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarAccionMonitoreoPreInversion', ipInput);
  }

  modificarAccionMonitoreoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarAccionMonitoreoPreInversion', ipInput);
  }

  anularAccionMonitoreoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularAccionMonitoreoPreInversion', ipInput);
  }
}
