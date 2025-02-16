import { Injectable } from '@angular/core';
import { Settings } from '../appSettings/settings';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TramoGeograficoService {

  constructor(private http: HttpClient) { }

  TramoGeofrafico(idProyecto){    
    return this.http.get( Settings.API_ENDPOINT + 'api/listarTramoGeografico?intIdProyecto='+idProyecto);
  }
  TramoGeofraficoGEOJSON(idTramo){    
    return this.http.get( Settings.API_ENDPOINT + 'api/listarGeoJsonTramoGeografico?intIdTramo='+idTramo);
  }
}
