import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalAsignarHijosComponent } from '../modal-asignar-hijos/modal-asignar-hijos.component';
import { PerfilesService } from 'src/app/services/perfiles.service';
import { Functions } from 'src/app/appSettings/functions';

@Component({
  selector: 'app-modal-perfil-hijos',
  templateUrl: './modal-perfil-hijos.component.html',
  styleUrls: ['./modal-perfil-hijos.component.css']
})
export class ModalPerfilHijosComponent implements OnInit {
idPerfilPadre:number;
PerfilPadre:string="";
PerfilABuscar:string="";
BsModalRef_ModalAgregar:BsModalRef;
ListadoPerfilesHijos=[];
ListadoPerfilesHijosFiltro=[];

  constructor(public modalRef: BsModalRef, private BsmodalService:BsModalService
    ,private sPerfil:PerfilesService, private fn:Functions
    ) { }

  ngOnInit() {
    this.CargarListadoPerfilesHijos();
  }
  closeModal():void {
    this.modalRef.hide();
  }
  BuscarPerfilHijos():void{
    let objBuscar={
      nombre:this.PerfilABuscar
    }
    if(objBuscar.nombre!=""){
      //if(this.ListadoPerfilesHijos.length>0){
        this.ListadoPerfilesHijosFiltro=this.ListadoPerfilesHijos.filter(x=>((x.nombre_perfil).toLowerCase()).indexOf(objBuscar.nombre)!= -1);
      // }
      // else{
      //   this.ListadoPerfilesHijosFiltro=this.ListadoPerfilesHijos;
      // }
    }
    else{
      this.ListadoPerfilesHijosFiltro=this.ListadoPerfilesHijos;
    }
  }
  AbrirModalAsignarHijos():void{
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idPerfilPadre:this.idPerfilPadre,
        PerfilPadre:this.PerfilPadre
      }
    };
    this.BsModalRef_ModalAgregar = this.BsmodalService.show(ModalAsignarHijosComponent, config);
    this.BsModalRef_ModalAgregar.content.retornoValores.subscribe(
      (data:any) => {
        this.CargarListadoPerfilesHijos();
      }
    )
  }
  CargarListadoPerfilesHijos():void{

    this.sPerfil.listarPerfilConfiguracion(this.idPerfilPadre).subscribe((data:any)=>{
      this.ListadoPerfilesHijos=data;
      this.BuscarPerfilHijos();
    });
    // this.ListadoPerfilesHijos=[
    //   {nombre:"uno"},
    //   {nombre:"dos"},
    //   {nombre:"tres"},
    //   {nombre:"cuatro"},
    //   {nombre:"cinco"}
    // ];

  }
  ConfirmarEliminacion(id_perfil_configuracion:number){


    this.fn.alertaRetorno("question", "¿Está seguro de eliminar este registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        let param={
          "id_perfil_configuracion":id_perfil_configuracion,
          "usuario_anulacion":sessionStorage.getItem("Usuario")
        }
        this.sPerfil.anularPerfilConfiguracion(param).subscribe((data:any)=>{
          if(data==0){
            this.fn.alertaSimple("error","Error","No fue posible eliminar este registro.",true);
              this.closeModal();
            }
            else{
              this.fn.alertaSimple("success","Mensaje","El registro fue eliminado.",true);
              this.CargarListadoPerfilesHijos();
            }
        });
      } 
      else {
      }
    });

  }
}