import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/componentes/auth/auth.service';
import { AccesoService } from 'src/app/services/acceso.service';

@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.css']
})
export class SistemasComponent implements OnInit {
  txtUsuario:string="";
  modulos:any;

  ListadoSistemas=[];
  constructor(
    private router: Router,
    private authService: AuthService,
    private svAcceso:AccesoService
  ) { }

  ngOnInit() {

    this.txtUsuario=sessionStorage.getItem("Nombre_Usuario");

    this.svAcceso.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario'))).subscribe((data:any)=>{
      this.ListadoSistemas=data;

      this.ListadoSistemas.map((item)=>{
        if(item.codigo_modulo==="ssi"){
          item.bg_color = "#db4437";
          item.color="#ffffff";
        }
        if(item.codigo_modulo==="ssp"){
          item.bg_color="#db4437";
          item.color="#ffffff";
        }
      });
      let AccesoDirecto:boolean=(this.ListadoSistemas.length===1 && this.ListadoSistemas[0].perfiles.length===1)?true:false;

      if(AccesoDirecto){

        this.authService.getMenu(this.ListadoSistemas[0].perfiles[0].id_perfil).subscribe((data:any) => {
          let menu=JSON.parse(sessionStorage.getItem("Componentes")).menu;
          this.router.navigate([menu[0].url]);

        });
      }
      else{
      }

    });

  }
  PerfilSeleccionado(item:any, sistema:any){
    sessionStorage.setItem("Nombre_Perfil",item.nombre_perfil);
    sessionStorage.setItem("Id_Perfil",item.id_perfil);
    sessionStorage.setItem("Sistema",sistema);
    this.authService.getMenu(item.id_perfil).subscribe((data:any) => {
      //sessionStorage.setItem("Componentes",JSON.stringify(data));
      let menu=data.menu;
      this.router.navigate([menu[0].url]);
    });
  }
  cerrarSesion() {
    let Tipo:string=sessionStorage.getItem("Tipo");
    if(Tipo=="Login"){
      sessionStorage.clear();
      location.reload();
      var cuerpo =document.getElementsByTagName('body')[0];
      cuerpo.classList.remove("page-dashboard");
      cuerpo.classList.add("page-login");
    }
    else{
      sessionStorage.setItem("Logout","Salio");
    }
  }
}
