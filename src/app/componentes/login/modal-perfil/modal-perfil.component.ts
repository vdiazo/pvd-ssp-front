import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.css']
})
export class ModalPerfilComponent implements OnInit {

  perfiles:any;


  constructor(public modalRef: BsModalRef,private router: Router) { }

  ngOnInit() {
    //this.perfiles=JSON.parse(this.perfiles.userInfo).perfil;
  }
  setPerfil(Perfil:any){
    sessionStorage.setItem("Id_Perfil",Perfil.id_perfil);
    sessionStorage.setItem("Nombre_Perfil", Perfil.nombre_perfil);
    sessionStorage.setItem("Id_Detalle_Usuario",Perfil.id_detalle_usuario);


    this.router.navigate(['/monitoreo']);
    this.modalRef.hide();
  }

}
