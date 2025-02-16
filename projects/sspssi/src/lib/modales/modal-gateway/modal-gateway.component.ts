import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-modal-gateway',
  templateUrl: './modal-gateway.component.html',
  styleUrls: ['./modal-gateway.component.css']
})
export class ModalGatewayComponent implements OnInit {
  ListadoSistemas=[];
  constructor(private router:Router, private authService: AuthService, public modalRef: BsModalRef) { }

  ngOnInit() {
  }

  PerfilSeleccionado(item:any){
    sessionStorage.setItem("Nombre_Perfil",item.nombre_perfil);
    sessionStorage.setItem("Id_Perfil",item.id_perfil);
    this.authService.getMenu(item.id_perfil).subscribe((data:any) => { 
      sessionStorage.setItem("Componentes",JSON.stringify(data));
      let menu=JSON.parse(sessionStorage.getItem("Componentes")).menu;

    //  this.router.routeReuseStrategy.shouldReuseRoute = ()=>{return false };
    //  this.router.navigated = false;
    //  this.router.navigate([menu[0].url]);
    this.router.navigate([menu[0].url], { skipLocationChange: true });
      this.modalRef.hide();
    });
  }
}
