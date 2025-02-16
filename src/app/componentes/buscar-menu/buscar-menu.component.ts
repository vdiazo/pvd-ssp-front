import { Component, OnInit } from '@angular/core';
import { BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Functions } from '../../appSettings/functions';
import { ModalMenuComponent } from './modal-menu/modal-menu.component';
import { Menu, MenuModal } from '../../models/Menu';
import { MenuService } from '../../services/menu.service';
import { ModuloService } from 'src/app/services/modulo.service';

@Component({
  selector: 'app-buscar-menu',
  templateUrl: './buscar-menu.component.html',
  styleUrls: ['./buscar-menu.component.css']
})
export class BuscarMenuComponent implements OnInit {
  campoBusqueda:string
  bsModalRef: BsModalRef;
  totalMenu:number =0;
  arregloMenu = [];
  lstParametros;
  response;
  config;
  menus;
  paginaActual:number =1;
  ListadoSistemas:any=[];
  campoBusquedaSistema:number;
  menu_seleccionado:number;
  constructor(private modalService: BsModalService, private svcMenu : MenuService, private funciones : Functions, private svModulo:ModuloService) { }

  ngOnInit() {
    //this.ListadoPrincipal()
    //this.listarMenus();
    this.CargarListadoSistemas();
  }
  // listarMenus() {
  //   this.svcMenu.listadoMenuCombo().subscribe(
  //     data => {
  //       this.menus = data;
  //     }
  //   ) 
  // }
  ListadoPrincipal(){
    let busqueda=0;
    this.svcMenu.ListarMenuSinPaginado(busqueda,0).subscribe(
      data =>{
          this.response = data;
          if(this.response != ""){
            this.arregloMenu = this.response;
            this.totalMenu = this.arregloMenu.length;
            this.construirListadoPrincipal(this.arregloMenu);
          }else{
            this.arregloMenu = [];
            this.totalMenu = 0;
          }
      }
    )
  }
  lstParametrosHijoParametro = [];
  beParametroMenu : MenuModal;
  construirListadoPrincipal(pListadoMenu){
    this.lstParametrosHijoParametro = [];
    if (pListadoMenu != null)
    {
      if (pListadoMenu.length>0)
      {
        pListadoMenu.forEach(d => {
          if(d.nivel == 0){
            this.lstParametrosHijoParametro.push(d);
            this.beParametroMenu = new MenuModal();
            this.beParametroMenu = d;
            this.agregarHijo(this.beParametroMenu, pListadoMenu, this.lstParametrosHijoParametro);
          }
        }); 
      }

    }
  }
  agregarHijo(beParametro: MenuModal, lstParametros, lstParametrosHijoParametro ){
    let beHijo: MenuModal;
    let list =[];

    lstParametros.forEach(x => {
      if(x.id_menu_padre == beParametro.id_menu){
        list.push(x);
      }
    }); 

    let concatena = "";
    if (list.length > 0)
    {
        for (let x = 0; x <= list[0].nivel - 1; x++)
        {
            concatena = concatena + "      ";
        }
    }

    list.forEach(d => {
      beHijo = new MenuModal();
      beHijo = d;
      d.nombre_menu = concatena + d.nombre_menu;
      lstParametrosHijoParametro.push(d);
      this.agregarHijo(beHijo, lstParametros, lstParametrosHijoParametro);
    }); 
    return lstParametrosHijoParametro;
  }
  // cambiarPagina(pagina){
  //   this.paginaActual = pagina.page;
  //   let skip = 10;
  //   let take = (pagina.page * 10) - 10;
  //   let busqueda = this.campoBusqueda == null?0:this.campoBusqueda;
  //   this.svcMenu.ListarMenuPaginado(busqueda,skip,take).subscribe(
  //     data => {
  //       this.response = data;
  //       if(this.response != ""){
  //         if(this.response.cantidad_registro != 0){
  //           this.arregloMenu = this.response.data;
  //           this.totalMenu = this.response.cantidad_registro
  //         }else{
  //           this.arregloMenu = [];
  //           this.totalMenu = 0;
  //         };
  //       }else{
  //         this.arregloMenu = [];
  //         this.totalMenu = 0;
  //       }
  //     }
  //   )
  // }
  busqueda(){
    this.paginaActual = 1;
    let busqueda = this.campoBusqueda == null?0:this.campoBusqueda;
    let id_modulo=this.campoBusquedaSistema == undefined?0:this.campoBusquedaSistema;

    if(busqueda==0){
      this.svcMenu.ListarMenuSinPaginado(0,id_modulo).subscribe(
        data => {
          this.response = data;  
          if(this.response != ""){
            this.arregloMenu = this.response;          
            this.totalMenu = this.arregloMenu.length;
            this.construirListadoPrincipal(this.arregloMenu);
          }else{
            this.arregloMenu = [];
            this.totalMenu = 0;
          }
        }
      )
    }
    else{
      this.menu_seleccionado=Number(busqueda);
      let elemento:HTMLElement = document.getElementById("ancla"+this.menu_seleccionado);
      window.scrollTo(0,elemento.getBoundingClientRect().top)
    }
  }
  modalAgregarMenuPadre(objpadre){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null,
        entidadPadre:objpadre,
        ListadoSistemas:this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalMenuComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.busqueda();
      }
    )
  }

  modalEditarMenu(obj){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj,
        ListadoSistemas:this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalMenuComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.busqueda();
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
    let entidadEliminar = new  Menu();
    entidadEliminar.id_menu = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcMenu.anularMenu(entidadEliminar).subscribe(
      data => {        
        if(data == 1){
            this.funciones.alertaSimple("success","Se deshabilitó el menú!","",true);
            this.busqueda();
        }
        else{
            this.funciones.alertaSimple("error","Ocurrio un error al momento deshabilitar el menú","",true);
        }
      }
    )
  }
  modalAgregarMenu(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null,
        ListadoSistemas:this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalMenuComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.busqueda();
      }
    )
  }
  CargarListadoSistemas():void{
    this.svModulo.listarModuloCombo().subscribe((data:any)=>{
      this.ListadoSistemas=data;
    });
  }
  CargarListadoMenus(item:any):void{

    if(item!=undefined){
      this.busqueda();
      this.menus= this.ListadoSistemas.find(x=>x.id_modulo==item.id_modulo).menus;
    }
    else{
      this.menus=[];
    }
  }
}
