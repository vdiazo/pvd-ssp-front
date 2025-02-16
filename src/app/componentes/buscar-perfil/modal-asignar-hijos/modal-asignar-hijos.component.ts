import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from 'src/app/appSettings/functions';
import { PerfilesService } from 'src/app/services/perfiles.service';
import { FacadeService } from 'src/app/patterns/facade.service';


@Component({
  selector: 'app-modal-asignar-hijos',
  templateUrl: './modal-asignar-hijos.component.html',
  styleUrls: ['./modal-asignar-hijos.component.css']
})
export class ModalAsignarHijosComponent implements OnInit {
  idPerfilPadre:number;
  PerfilPadre:string="";
  @Output() retornoValores=new EventEmitter();
  ListadoPerfiles=[];
  idPerfilHijo:number=null;
  btnGuardarDisabled:boolean=true;
  constructor(public modalRef: BsModalRef, private funcion:Functions, private fs:FacadeService
    ,private sPerfil:PerfilesService
    ) { }

  ngOnInit() {
    this.CargarPerfiles();
    if(this.idPerfilHijo==null){
      this.btnGuardarDisabled=true;
    }
    else{
      this.btnGuardarDisabled=false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  Guardar(){
    let param={
    "id_perfil_responsable":this.idPerfilPadre,
    "id_perfil_asignado":this.idPerfilHijo,
    "usuario_creacion":sessionStorage.getItem("Usuario")
    }


    this.sPerfil.insertarPerfilConfiguracion(param).subscribe((data:any)=>{
      if(data==0){
      this.funcion.alertaSimple("error","Error","No fue posible registrar.",true);
        this.closeModal();
      }
      else{
        this.funcion.alertaSimple("success","Mensaje","EL perfil fue asignado.",true);
        this.closeModal();     
      }
    });

  }
  CargarPerfiles(){
    this.fs.maestraService.listarPerfiles().subscribe((data:any)=>{
      this.ListadoPerfiles=data;
    });
  }
  SeleccionarItem(e:any){
    this.btnGuardarDisabled=(e!=undefined)?false:true;
  }
}
