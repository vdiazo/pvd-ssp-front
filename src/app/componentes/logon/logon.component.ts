import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { AppUserAuth } from '../auth/sesion';
import { Settings } from '../../appSettings/settings';
import { tap } from '../../../../node_modules/rxjs/operators';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
  strlogon : string;
  strDatosLogon;
  userData;
  xy:string;
  securityObject: AppUserAuth = new AppUserAuth();
  constructor(
    private route: ActivatedRoute,
    private servicio: UsuarioService,
    private router: Router,
    private http: HttpClient,
    private as: AuthService
  ) {
  }

  ngOnInit() {
    //this.xy = this.route.snapshot.params.xy;
    this.xy=this.getParameterByName("xy");
    //this.router.navigate(['/monitoreo']);
    this.login(this.xy);
  }

  login(xy:string){

      this.servicio.validarLogon(xy).subscribe(

        data =>{
       
          this.strDatosLogon = data as  any;
          sessionStorage.setItem("token", this.strDatosLogon.token);
          this.userData = JSON.parse(this.strDatosLogon.userInfo);
         
          if (this.userData.perfil == null) {
           sessionStorage.setItem("Municipalidad", "");
         } else {
           if (this.userData.perfil.length == 1) {
             if (this.userData.perfil[0].nombre_perfil == "RESPONSABLE") {
               sessionStorage.setItem("Municipalidad", this.userData.perfil[0].nombre_municipalidad);
               sessionStorage.setItem("IdMunicipalidad", this.userData.perfil[0].id_municipalidad);
             } else {
               sessionStorage.setItem("Municipalidad", "");
               sessionStorage.setItem("IdMunicipalidad", "0");
             }
   
             sessionStorage.setItem("Id_Perfil",this.userData.perfil[0].id_perfil);
             sessionStorage.setItem("Nombre_Perfil", this.userData.perfil[0].nombre_perfil);
             sessionStorage.setItem("Id_Detalle_Usuario",this.userData.perfil[0].id_detalle_usuario);
           }
         }
         if (this.userData.nombre_usuario == null) {
           sessionStorage.setItem("Nombre_Usuario", "");
         } else {
           sessionStorage.setItem("Nombre_Usuario", this.userData.nombre_usuario);
         }
         sessionStorage.setItem("Usuario", this.userData.usuario);
         sessionStorage.setItem("IdUsuario", this.userData.id_usuario);
   
         sessionStorage.setItem("Coddepa", this.userData.coddepa);
         sessionStorage.setItem("IdZona", this.userData.id_zona);
         sessionStorage.setItem("Tipo", "Logon");
         sessionStorage.setItem("Logout", "Logout");
         this.as.getMenu(Number(sessionStorage.getItem("Id_Perfil"))).subscribe(
          data =>{
            this.router.navigate(['/monitoreo']);
          }
        )

        }
      );
  }

  getParameterByName(name) {name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),results = regex.exec(location.search);return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));}
}