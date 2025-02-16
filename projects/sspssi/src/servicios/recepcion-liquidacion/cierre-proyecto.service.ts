import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class CierreProyectoService {

    constructor(private http: HttpClient) { }

    listarCierreTransFisica(id): Observable<any> {
        return this.http.get(Settings.API_ENDPOINT + 'api/listarCierreTransferenciaFisicaEjeDir/' + id);
    }

    registrarCierreTransfFisica(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        };
        return this.http.post(Settings.API_ENDPOINT + 'api/insertarCierreTransferenciaFisicaEjeDir', entidad);
    }

    actualizarCierreTransfFisica(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        };
        return this.http.post(Settings.API_ENDPOINT + 'api/modificarCierreTransferenciaFisicaEjeDir', entidad);
    }

    anularCierreTransfFisica(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        };
        return this.http.post(Settings.API_ENDPOINT + 'api/anularCierreTransferenciaFisicaEjeDir', entidad);
    }

    listarEstadoCierre(): Observable<any> {
        return this.http.get(Settings.API_ENDPOINT + 'api/listarEstadoCierreEjeDir');
    }

    listarTipoDocumentoCierre(): Observable<any> {
        return this.http.get(Settings.API_ENDPOINT + 'api/listarTipoDocumentoCierreEjeDir/');
    }

    listarCierreTransContable(id): Observable<any> {
        return this.http.get(Settings.API_ENDPOINT + 'api/listarCierreTransferenciaContableEjeDir/' + id);
    }

    registrarCierreTransfContable(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        };
        return this.http.post(Settings.API_ENDPOINT + 'api/insertarCierreTransferenciaContableEjeDir', entidad);
    }

    actualizarCierreTransfContable(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        }
        return this.http.post(Settings.API_ENDPOINT + 'api/modificarCierreTransferenciaContableEjeDir', entidad);
    }

    anularCierreTransfContable(data: any): Observable<any> {
        let entidad = {
            data: JSON.stringify(data)
        }
        return this.http.post(Settings.API_ENDPOINT + 'api/anularCierreTransferenciaContableEjeDir', entidad);
    }
}