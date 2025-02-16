import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarAprobacionLiquidacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarLiquidacionPreInversion', ipInput);
  }

  insertarAprobacionLiquidacionPreinversion(input: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarLiquidacionPreInversion', input);
  }

  modificarAprobacionLiquidacionPreinversion(input: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarLiquidacionPreInversion', input);
  }

  anularAprobacionLiquidacionPreinversion(input: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularLiquidacionPreInversion', input);
  }

}
