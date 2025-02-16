import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
//import { AuthService } from '../guards/auth.service';
@Injectable({
  providedIn: 'root'
})
export class MetodoService {


  constructor(private http: HttpClient) { }

	_POST(url:string,parametros:any,contentType:string='application/x-www-form-urlencoded'):any {
		let accessToken =  sessionStorage.getItem("token");
		
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

		return this.http.post(url,body, httpOptions);
  }
    
    //_GET()
  
}
