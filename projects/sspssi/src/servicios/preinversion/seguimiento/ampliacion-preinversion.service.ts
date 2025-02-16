import { Injectable } from '@angular/core';
import { MetodoService } from '../../metodo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AmpliacionPreinversionService {

  constructor(private metodoSvc: MetodoService) { }

  listarAmpliacionCombo() {
    return this.metodoSvc._GET('api/ListarAmpliacionComboPreInversion');
  }

  listarAmpliacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc._GET('api/ListarAmpliacionPreInversion', ipInput);
  }

  insertarAmpliacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/InsertarAmpliacionPreInversion', ipInput);
  }

  modificarAmpliacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/ModificarAmpliacionPreInversion', ipInput);
  }

  anularAmpliacionPreinversion(ipInput: any): Observable<any> {
    return this.metodoSvc.POST_('api/AnularAmpliacionPreInversion', ipInput);
  }
}
