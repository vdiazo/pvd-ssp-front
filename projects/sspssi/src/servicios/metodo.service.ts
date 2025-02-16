import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings';
import { Observable } from 'rxjs';
//import { AuthService } from '../guards/auth.service';
@Injectable({
	providedIn: 'root'
})
export class MetodoService {


	constructor(private http: HttpClient) { }

	_POST(url: string, parametros: any, contentType: string = 'application/x-www-form-urlencoded'): Observable<any> {
		let accessToken = sessionStorage.getItem("token");

		let body: HttpParams = new HttpParams();
		parametros.forEach(element => {
			body = body.append(element.parametro, element.valor);
		});

		const headers = new HttpHeaders({
			'Content-Type': contentType,
			'Authorization': `Bearer ${accessToken}`
		})

		const httpOptions = {
			headers: headers
		};

		return this.http.post(url, body, httpOptions);
	}

	_GET(path: string, ipInput: any = null): Observable<any> {

		const headersObject = new HttpHeaders();
		headersObject.append('Content-Type', 'application/json');
		headersObject.append('withCredentials', 'true');
		const httpOptions = { withCredentials: true };

		if (ipInput == null) {
			return this.http.get(`${Settings.API_ENDPOINT}${path}`);
		} else {
			// return this.http.get(`${Settings.API_ENDPOINT}${path}?ipInput=${JSON.stringify(ipInput)}`);
			return this.http.get(`${Settings.API_ENDPOINT}${path}?strParametro=${JSON.stringify(ipInput, this.replacer)}`);
		}
	}

	GET_(path: string, ipInput: any = null): Observable<any> {

		const headersObject = new HttpHeaders();
		headersObject.append('Content-Type', 'application/json');
		headersObject.append('withCredentials', 'true');
		const httpOptions = { withCredentials: true };

		if (ipInput == null) {
			return this.http.get(`${Settings.API_ENDPOINT}${path}`);
		} else {
			return this.http.get(`${Settings.API_ENDPOINT}${path}?strParametro=${JSON.stringify(ipInput)}`);
		}
	}

	POST_(path: string, ipInput: any, contentType: string = 'application/x-www-form-urlencoded'): Observable<any> {
		const headersObject = new HttpHeaders();
		headersObject.append('Content-Type', contentType);
		let body: HttpParams = new HttpParams();
		body = body.append('data', JSON.stringify(ipInput, this.replacer));
		const httpOptions = {
			headers: headersObject
		};
		return this.http.post(`${Settings.API_ENDPOINT}${path}`, body, httpOptions);
	}

	replacer(key, value) {
		// Filtrando propiedades

		if (typeof value === 'string') {
			const operador = /\+/gi;
			const apostrofe = /\'/gi;
			return value.replace(apostrofe, "''")
				.replace(operador, '%2B');
		}
		return value;
	}

}
