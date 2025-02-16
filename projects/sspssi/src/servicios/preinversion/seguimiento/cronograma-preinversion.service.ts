import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CronogramaPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarProgramacionComboPreInv(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarProgramacionComboPreInversion', ipInput);
  }

  listarProgramacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarProgramacionPreInversion', ipInput);
  }

  insertarProgramacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarProgramacionPreInversion', ipInput);
  }

  modificarProgramacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarProgramacionPreInversion', ipInput);
  }

  anularProgramacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularProgramacionPreInversion', ipInput);
  }
}
