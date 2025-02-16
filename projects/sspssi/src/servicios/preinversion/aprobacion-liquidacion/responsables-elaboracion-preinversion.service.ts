import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesElaboracionPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarResponsableElaboracionEstudioComboPreinversion(): Observable<any> {
    return this.metodoSvc._GET('api/ListarResponsableElaboracionComboPreInversion');
  }

  listarResponsableElaboracionEstudioPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarResponsableElaboracionPreInversion', ipInput);
  }

  insertarResponsableElaboracionEstudioPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarResponsableElaboracionPreInversion', ipInput);
  }

  anularResponsableElaboracionEstudioPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularResponsableElaboracionPreInversion', ipInput);
  }

}
