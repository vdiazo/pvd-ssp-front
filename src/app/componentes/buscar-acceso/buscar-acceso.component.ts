import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { ModalAccesoComponent } from './modal-acceso/modal-acceso.component';
import { AccesoService } from '../../services/acceso.service';
import { Acceso } from '../../models/Usuario';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-buscar-acceso',
  templateUrl: './buscar-acceso.component.html',
  styleUrls: ['./buscar-acceso.component.css']
})
export class BuscarAccesoComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalAcceso:number =0;
  arregloAcceso = [];
  response;
  config;
  paginaActual:number =1;
  ListadoSistemas:any=[];
  ListadoPerfiles:any=[];
  id_modulo:number=null;
  id_perfil:number=null;
  @ViewChild('buscarCombosistema') buscarCombosistema :NgSelectComponent;
  @ViewChild('buscarComboPerfiles') buscarComboPerfiles :NgSelectComponent;
  
  constructor(private modalService: BsModalService, private funciones : Functions, private svcAcceso : AccesoService) { 

    }

  ngOnInit() {
    this.ListadoPrincipal();
    this.CargarsListadoSistemas();
    
  }

  modalAgregarAcceso(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null,
        ListadoSistemas:this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalAccesoComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

  ListadoPrincipal(){
    let busqueda="";
    let skip = 10;
    let take = 0;
    let usuario = sessionStorage.getItem("IdUsuario");
    //let perfil =(this.id_perfil!=null)?this.id_perfil:0;
    let perfil=Number(sessionStorage.getItem("Id_Perfil"));
    this.svcAcceso.ListarAccesoPaginado(busqueda,usuario,perfil,skip,take,0,0).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            if(this.response.cantidad_registro != 0){
              let  depa ="";
              let nom ="";
              let cont =1;
              this.arregloAcceso = this.response.data;
              this.arregloAcceso.forEach(element => {
                if(element.departamento!=null){
                  if(element.departamento.length > 0){
                    element.departamento.forEach(
                      codigo=>{
                        if(cont == 1){
                          depa = depa + codigo.coddepa;
                          nom = nom + codigo.departamento;
                        }else{
                          depa =depa + "," + codigo.coddepa;
                          nom = nom + ", " + codigo.departamento;
                        }
                        cont++;
                      }
                    )
                  }
                }

                 element.coddepa = depa;
                 element.nombredepa = nom;   
                 depa ="";
               nom = "";
               cont =1;  
              });
              this.totalAcceso = this.response.cantidad_registro
            }else{
              this.arregloAcceso = [];
              this.totalAcceso = 0;
            };
          }else{
            this.arregloAcceso = [];
            this.totalAcceso = 0;
          }
      }
    );
  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfilHijo =(this.id_perfil!=null)?this.id_perfil:0;
    let perfil=Number(sessionStorage.getItem("Id_Perfil"));
    let id_modulo=(this.id_modulo!=null)?this.id_modulo:0;
    this.svcAcceso.ListarAccesoPaginado(busqueda,usuario,perfil,skip,take,id_modulo,perfilHijo).subscribe(
      data => {
        this.response = data;
        if(this.response != ""){
          if(this.response.cantidad_registro != 0){
            let  depa ="";
              let nom ="";
              let cont =1;
            this.arregloAcceso = this.response.data;
            this.arregloAcceso.forEach(element => {
              if(element.departamento != null){
                if(element.departamento.length > 0){
                  element.departamento.forEach(
                    codigo=>{
                      if(cont == 1){
                        depa = depa + codigo.coddepa;
                        nom = nom + codigo.departamento;
                      }else{
                        depa =depa + "," + codigo.coddepa;
                        nom = nom + ", " + codigo.departamento;
                      }
                      cont++;
                    }
                  )
                }
              }

               element.coddepa = depa;
               element.nombredepa = nom;
               depa ="";
               nom = "";
               cont =1;     
            });
            this.totalAcceso = this.response.cantidad_registro
          }else{
            this.arregloAcceso = [];
            this.totalAcceso = 0;
          };
        }else{
          this.arregloAcceso = [];
          this.totalAcceso = 0;
        }
      }
    )
  }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?"":this.campoBusqueda;
    let skip = 10;
    let take = 0;
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfilHijo =(this.id_perfil!=null)?this.id_perfil:0;
    let perfil=Number(sessionStorage.getItem("Id_Perfil"));
    let id_modulo=(this.id_modulo!=null)?this.id_modulo:0;
    this.svcAcceso.ListarAccesoPaginado(busqueda,usuario,perfil,skip,take,id_modulo,perfilHijo).subscribe(
      data => {
        this.response = data;     
        if(this.response != ""){
          if(this.response.cantidad_registro != 0){
            let  depa ="";
              let nom ="";
              let cont =1;
            this.arregloAcceso = this.response.data;
            this.arregloAcceso.forEach(element => {
              if(element.departamento !=null){
                if(element.departamento.length > 0){
                  element.departamento.forEach(
                    codigo=>{
                      if(cont == 1){
                        depa = depa + codigo.coddepa;
                        nom = nom + codigo.departamento;
                      }else{
                        depa =depa + "," + codigo.coddepa;
                        nom = nom + ", " + codigo.departamento;
                      }
                      cont++;
                    }
                  )
                }                
              }

               element.coddepa = depa;
               element.nombredepa = nom;
               depa ="";
               nom = "";
               cont =1;
            });
            this.totalAcceso = this.response.cantidad_registro;
          }else{
            this.arregloAcceso = [];
            this.totalAcceso = 0;
          }
        }else{
          this.arregloAcceso = [];
          this.totalAcceso = 0;
        }
      }
    )
  }

  modalEditarAcceso(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj,
        ListadoSistemas:this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalAccesoComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

  mostrarAlerta(codigo){
    this.funciones.alertaRetorno("question","Deseas eliminar el siguiente registro?","",true,(respuesta) =>{
      if(respuesta.value){
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo){
    let entidadEliminar = new Acceso();
    entidadEliminar.id_detalle_usuario = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcAcceso.anularAcceso(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se deshabilitó la usuario!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento deshabilitar al usuario","",true);
        }
      }
    )
  }
  CargarsListadoSistemas():void{
    let parametro=Number(sessionStorage.getItem("Id_Perfil"));
    this.svcAcceso.listarModuloPerfil(parametro).subscribe((data:any)=>{
      this.ListadoSistemas=data;

  

      // if(this.ListadoSistemas.length==1){
      //   this.id_modulo=this.ListadoSistemas[0].id_modulo;
      //   this.buscarCombosistema.disabled=true;
      //   this.CargarPerfiles(this.ListadoSistemas[0]);
      // }else{
      //   this.ListadoSistemas=data;
      // }    
    });

  }

  CargarPerfiles(item:any):void{
    this.buscarCombosistema.disabled=false;

    if(item!=undefined){
      this.id_perfil=null;
      //this.busqueda();
      this.ListadoPerfiles= this.ListadoSistemas.find(x=>x.id_modulo==item.id_modulo).perfiles;
      if(this.ListadoPerfiles==null){
        this.id_perfil=null;
      }
      if(this.ListadoPerfiles.length==1){
        this.id_perfil=this.ListadoPerfiles[0].id_perfil;
      }
      // if(this.ListadoPerfiles.length==1){
      //   this.id_perfil=this.ListadoPerfiles[0].id_perfil;
      //   this.buscarComboPerfiles.disabled=true;
      // }else{
      //   this.ListadoPerfiles=[];
      // }  

      
    }
    else{
      this.id_perfil=null;
      this.id_modulo=null;
      this.ListadoPerfiles=[];
    }
  }
}
