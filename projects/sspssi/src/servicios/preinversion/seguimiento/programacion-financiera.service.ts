import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionFinancieraService {

  constructor(private metodoSvc: MetodoService) { }

  listarProgramacionFinancieraPreinversionCombo(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarTipoPeriodoCronogramaPreInversion', ipInput);
  }

  listarProgramacionFinancieraPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarProgramacionFinancieraPreInversion', ipInput);
  }


  insertarProgramacionFinancieraPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarProgramacionFinancieraPreInversion', ipInput);
  }

  modificarProgramacionFinancieraPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarProgramacionFinancieraPreInversion', ipInput);
  }

  anularProgramacionFinancieraPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularProgramacionFinancieraPreInversion', ipInput);
  }
}
