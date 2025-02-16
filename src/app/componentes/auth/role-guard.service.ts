import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Functions } from '../../appSettings/functions';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, private funciones:Functions) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    sessionStorage.removeItem("idSeguimiento");
    // this will be passed from the route config
    // on the data property
    //const expectedRole = route.data.expectedRole;
    //const token = localStorage.getItem('token');
    // decode the token to get its payload
    //const tokenPayload = decode(token);
    let menus = JSON.parse(sessionStorage.getItem("Componentes"));
    let url = menus.menu.find(x => x.url == "/"+route.url[0].path);
    if (url == null) {
        this.funciones.alertaRetorno("warning","Acceso Denegado","No puede acceder a esta página.",false,data=>{
          this.router.navigate(['login']);
        });
        return false;
    }
    return true;
  }
}
