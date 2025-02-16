import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ContratistaService {

    constructor(private http: HttpClient) { }

    listarContratista(data: any, num_filas: number, numero_Pagina: number): Observable<any> {
        return this.http.get(Settings.API_ENDPOINT + 'api/listarResponsableContratistaEjeDir?intId_seguimiento_monitoreo_obra=' + data + '&skip=' + num_filas + '&take=' + numero_Pagina);
    }

    registrarContratista(data: any): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('entidad', JSON.stringify(data));
        return this.http.post(Settings.API_ENDPOINT + "api/procesarResponsableContratistaEjeDir", formData);
    }

    actualizarContratista(data: any): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('entidad', JSON.stringify(data));
        /* if (file != null) {
          formData.append("uploadFile", file.file, file.nombre);
        } */
        return this.http.post(Settings.API_ENDPOINT + "api/procesarResponsableContratistaEjeDir", formData);
    }
}
