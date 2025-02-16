import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdelantoDirectoPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarAdelantoDirectoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.GET_('api/ListarAdelantoDirectoPreInversion', ipInput);
  }

  insertarAdelantoDirectoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarAdelantoDirectoPreInversion', ipInput);
  }

  modificarAdelantoDirectoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarAdelantoDirectoPreInversion', ipInput);
  }

  anularAdelantoDirectoPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularAdelantoDirectoPreInversion', ipInput);
  }
}
