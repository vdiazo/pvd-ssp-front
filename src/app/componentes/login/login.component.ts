import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalPerfilComponent } from './modal-perfil/modal-perfil.component';
import { IUser, IUserInfo } from '../../Interfaces';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { ModalGatewayComponent } from 'src/app/modales/modal-gateway/modal-gateway.component';
import { Alert } from 'selenium-webdriver';
import { AccesoService } from 'src/app/services/acceso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup
  bsModalRef: BsModalRef;
  htmlStr: string = '';
  logearse: boolean = false;
  bsModalsistemasRef:BsModalRef;


  @ViewChild(TemplateRef) templateSeleccionarSistema : TemplateRef<any>;

  constructor(private authService: AuthService,
    private modal: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private svAcceso:AccesoService
  ) {

    var cuerpo = document.getElementsByTagName('body')[0];
    cuerpo.classList.add("page-login");

    this.crearForm();
  }

  crearForm(): void {
    this.formGroup = this.fb.group(
      {
        UserName: "",
        Password: ""
      }
    )
  }

  ngOnInit() {
    document.getElementById("txtUsuario").focus();
    sessionStorage.clear();
    this.closeAllModals();

    let video:HTMLVideoElement=document.getElementById("myVideo") as HTMLVideoElement;
    video.autoplay=true;
    video.loop=true;
    video.muted=true;


    // var browser = document.getElementById("navegador");
    
    // let agente = window.navigator.userAgent;
    // let navegadores = ["Chrome", "Firefox", "Safari", "Opera", "Maxthon", "Edge"];
    // for(var i in navegadores){
    //     if(agente.indexOf( navegadores[i]) != -1 ){
    //     }
    // }

    

    
  }
  
  validarIngresoDatosLogin(): IUser {
    let user: IUser = Object.assign({}, this.formGroup.value);

    if (user.UserName === "" || user.Password === "") {

      let control: string = (user.UserName === "" ? "txtUsuario" : "txtPassword");
      this.htmlStr = (user.UserName === "" ? "Para iniciar sesión ingrese su Usuario" : "Para iniciar sesión ingrese su Contraseña");

      document.getElementById(control).focus();
      document.getElementById('botonLogin').style.display = 'block;'
      return null;
    }

    return user;
  }

  ngOnLogin() {
    let user: IUser = this.validarIngresoDatosLogin();

    if (user) {
      document.getElementById('botonLogin').style.display = 'none;'
      this.htmlStr = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw c-red"></i>';

      this.authService.accederAlSistema(user).subscribe(
        (userInfo: IUserInfo) => {
          if (userInfo.token == "Usuario y/o Password Invalido") {
            this.htmlStr = "El usuario y/o contraseña no coinciden";
          }
          else {
            new Observable(this.authService.SessionStorageUserInfo(userInfo)).subscribe(
              esPrimerIngreso => {
                this.htmlStr = "";
                if (!esPrimerIngreso) {
                  // if (userInfo.perfil.length > 1) {
                  //   this.seleccionarPerfilDeAccesoForm(userInfo);
                  // } else {
                    this.irPantallaPrincipal(userInfo);
                  //}
                }
              });
          }
        });
    }
  }

  private irPantallaPrincipal(userInfo: IUserInfo) {
    let ListadoSistemas=[];
    this.svAcceso.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario'))).subscribe((data:any)=>{
      ListadoSistemas=data;
      let AccesoDirecto:boolean=(ListadoSistemas.length===1 && ListadoSistemas[0].perfiles.length===1)?true:false;

      if(AccesoDirecto){
        sessionStorage.setItem("Sistema",data[0].codigo_modulo);
        this.authService.getMenu(ListadoSistemas[0].perfiles[0].id_perfil).subscribe((data:any) => { 
          let menu=JSON.parse(sessionStorage.getItem("Componentes")).menu;
          this.router.navigate([menu[0].url]);

        });
      }
      else{
        this.router.navigate(["/sistemas"]);
        // let config = {
        //   ignoreBackdropClick: false,
        //   class: "modal-sm",
        //   keyboard: false,
        //   initialState: { 
        //     ListadoSistemas:ListadoSistemas
        //   } 
        // };
        // this.bsModalsistemasRef = this.modalService.show(ModalGatewayComponent,config);
      }
  
    });
  //   this.authService.getMenu(userInfo.perfil[0].id_perfil).subscribe((data:any) => { 
  //   this.router.navigate([this.LinkBienvenida()]);
  // })
    // this.ListadoSistemas=[];
    // this.authService.getMenu(userInfo.perfil[0].id_perfil).subscribe((data:any) => { 
    //   if(data.modulo.length>1){
    //     //Abrir modal para seleccioanr modulo
    //     this.ListadoSistemas=JSON.parse(sessionStorage.getItem("Componentes")).modulo;
    //     let config = {
    //       ignoreBackdropClick: true,
    //       class: "modal-sm",
    //       keyboard: false,
    //       initialState: { 
            
    //       } 
    //     };
    //     this.bsModalsistemasRef = this.modalService.show(this.templateSeleccionarSistema,config);
    //   }
    //   else{
    //     //ir defrente
    //     this.router.navigate([this.LinkBienvenida()]);
    //   }
    //   //this.router.navigate([this.LinkBienvenida()]);
    // });

    //CONSULTAR LSIADO DE SISTEMAS Y PERFILES A LOS CUALES TIEN ACCESO
    //SI TIENE MAS DE UN SISTEMA MOSTARLE POP UP CON LÑOS SISTEMAS Y PEFILES
    // SIS TIENE MAS DE UN PERIFL MOSTRARLE EL SISTEMA Y SUS PERFILES
    // SI SOLO TINE UN SISTEMA Y UN SOLO PERFIL , DEBE REDIRECCIONAR AUTOMATICAMENTE


    // let ListadoSistemas=[
    //   {id_modulo:1,codigo_modulo:"",nombre_modulo:"Sistema de Seguimiento de Proyectos",
    //   perfiles:[{id_perfil:1,nombre_perfil:"Administrador"}]
    //   }
    // ];

    // let ListadoSistemas=[
    //   {id_modulo:1,codigo_modulo:"",nombre_modulo:"Sistema de Seguimiento de Proyectos",
    //   perfiles:[{id_perfil:1,nombre_perfil:"Administrador"},{id_perfil:2,nombre_perfil:"Coordinador"}]
    //   }
    // ];

    // let ListadoSistemas=[
    //   {id_modulo:1,codigo_modulo:"SSP",nombre_modulo:"Sistema de Seguimiento de Proyectos",
    //   perfiles:[{id_perfil:1,nombre_perfil:"Administrador"},{id_perfil:2,nombre_perfil:"Coordinador"}]
    //   },
    //   {id_modulo:2,codigo_modulo:"SSI",nombre_modulo:"Sistema de Ejecución Directa",
    //   perfiles:[{id_perfil:1,nombre_perfil:"Administrador"},{id_perfil:2,nombre_perfil:"Coordinador"}]
    //   }
    // ];



  }
  private LinkBienvenida():string{
    let menu=JSON.parse(sessionStorage.getItem("Componentes")).menu;
    return menu[0].url;
  }

  private seleccionarPerfilDeAccesoForm(userInfo: IUserInfo) {
    const config = {
      class: 'modal-sm',
      initialState: {
        perfiles: userInfo.perfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalPerfilComponent, config);
  }

  closeAllModals() {
    for (let i = 1; i <= this.modal.getModalsCount(); i++) {
      this.modal.hide(i);
    }
  }
}