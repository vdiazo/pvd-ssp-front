
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Settings } from '../../appSettings/settings';
import { IResolucionContrato } from '../Interfaces/IResolucionContrato';

@Injectable({
  providedIn: 'root'
})
export class ResolucionContratoService {

  constructor(private http: HttpClient) { }

  listarResolucionContrato(ipInput:any) {
    return this.http.get(Settings.API_ENDPOINT_SET + 'api/ListarResolucionContratoet?ipInput=' +JSON.stringify(ipInput) );
  }

  registrarResolucionContrato(data: any) {
    let formData: FormData = new FormData();
    // formData.append('data', JSON.stringify(data));
    var headers_object = new HttpHeaders();
		//let accessToken = this.authService.getAccessToken();
		headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
		let body: HttpParams = new HttpParams();
		body = body.append('data', JSON.stringify(data));
		const httpOptions = {
			headers: headers_object
		};
		return this.http.post(Settings.API_ENDPOINT_SET + "api/InsertarResolucionContratoet", body);
    // return this.http.post(Settings.API_ENDPOINT_SET + 'api/InsertarResolucionContratoet',JSON.stringify(data));
  }

  modificarResolucionContrato(data: IResolucionContrato):Observable<any> {

    // let formData: FormData = new FormData();
    // formData.append('data', JSON.stringify(data));
    var headers_object = new HttpHeaders();
		//let accessToken = this.authService.getAccessToken();
		headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
		let body: HttpParams = new HttpParams();
		body = body.append('data', JSON.stringify(data));
		const httpOptions = {
			headers: headers_object
		};
    return this.http.post(Settings.API_ENDPOINT_SET + "api/ModificarResolucionContratoet",body)
  }

  eliminarResolucionContrato(data: any):Observable<any> {
    var headers_object = new HttpHeaders();
		//let accessToken = this.authService.getAccessToken();
		headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
		let body: HttpParams = new HttpParams();
		body = body.append('data', JSON.stringify(data));
		const httpOptions = {
			headers: headers_object
		};
    return this.http.post(Settings.API_ENDPOINT_SET + "api/AnularResolucionContratoet?data=", body)
  }
}
