import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvanceInformePreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarAvanceInformePreinversionCombo(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarAvanceInformeComboPreInversion', ipInput);
  }

  listarAvanceInformePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarAvanceInformePreInversion', ipInput);
  }

  insertarAvanceInformePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarAvanceInformePreInversion', ipInput);
  }

  modificarAvanceInformePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarAvanceInformePreInversion', ipInput);
  }
  anularAvanceInformePreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularAvanceInformePreInversion', ipInput);
  }

}
