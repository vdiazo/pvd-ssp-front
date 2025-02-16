import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';

import { Settings, Functions } from "../../appSettings";
import { UsuarioService } from "../../services/usuario.service";
import { AuthService } from "src/app/componentes/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router, private funciones: Functions,private servicio: UsuarioService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith(Settings.API_ENDPOINT)) {   
            
            let accessToken = this.authService.getAccessToken();
            const headers = req.headers.set("Authorization", `Bearer ${accessToken}`);
            const authReq = req.clone({ headers });
            return next.handle(authReq).do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }                    
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    //this.eliminarTag();
                    if (err.status === 401 && err.statusText == "El Token ha expirado") {                                  
                        this.funciones.alertaRetorno("error","La sesión ha caducado","Será redireccionado al login",false,(data)=>{
                            if(data.value){
                                if(sessionStorage.getItem("Tipo")=="Login"){
                                    sessionStorage.clear();
                                    this.router.navigate(['/login']);
                                }
                                else{
                                        sessionStorage.clear();
                                
                                        this.servicio.validarLogout().subscribe(
                                          data=>{
                                            let ruta=data as string;
                                            window.location.href=ruta;
                                          }
                                        );
                                }
                            }
                        });
                    }
                    else if(err.status === 401 && err.statusText == "Invalid token"){                                              
                        this.funciones.alertaRetorno("error","Manipulación de datos","Será redireccionado al login",false,(data)=>{
                            if(data.value){
                                if(sessionStorage.getItem("Tipo")=="Login"){
                                    sessionStorage.clear();
                                    this.router.navigate(['/login']);
                                }
                                else{
                                    sessionStorage.clear();
                                
                                    this.servicio.validarLogout().subscribe(
                                      data=>{
                                        let ruta=data as string;
                                        window.location.href=ruta;
                                      }
                                    );
                                }
                            }
                        });
                    }
                    else if(err.status === 0 && err.statusText == "Unknown Error"){                                              
                        this.funciones.alertaSimple("error","El servidor no responde","Vuelve a intertarlo más tarde",true);
                    }
                    else if(err.status === 500 && err.statusText == "Internal Server Error"){     
                        this.funciones.alertaSimple("error","El servidor no responde","Vuelve a intertarlo más tarde",true);
                    }
                }                    
            });

        } else {
            return next.handle(req);
        }
    }
} 