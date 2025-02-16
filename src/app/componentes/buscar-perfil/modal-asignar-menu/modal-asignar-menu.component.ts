import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { PerfilesService } from '../../../services/perfiles.service';
import { MenuService } from '../../../services/menu.service';
import { ModalAsignacion, Asignacion } from '../../../models/Perfil';
import { Functions } from '../../../appSettings/functions';
import { of } from 'rxjs/observable/of';
import { TreeviewItem, DownlineTreeviewItem, TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig } from '../../../../../node_modules/ngx-treeview';
import { isNull } from 'util';
import { reverse } from 'dns';
import { ModuloService } from 'src/app/services/modulo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-asignar-menu',
  templateUrl: './modal-asignar-menu.component.html',
  styleUrls: ['./modal-asignar-menu.component.css'],
  providers: [
      { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }
  ]
})
export class ModalAsignarMenuComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : ModalAsignacion;
  idPerfil:number;
  menus:any;
  totalDetalle:number =0;
  arregloDetalle = [];
  paginaActual:number =1;
  response:any;
  arregloMemoria:any = [];
  arregloTreeview: TreeviewItem[] = [];
  config:any;
  values: number[];
  arreglomenusenvio:any =[];
  //arreglomenusenvio
  ocultarregistrar:boolean = true;
  
  ListadoSistemas:any=[];
  id_modulo:number=null;


  constructor(public modalRef: BsModalRef, private svcPerfiles : PerfilesService, private svcMenu : MenuService, private funciones: Functions,
    private svModulo:ModuloService
    ) { }

  ngOnInit() {
    this.entidadModal = new ModalAsignacion();
    this.CargarListadoSistemas();
    //this.ListadoPrincipalDetalle();
    //this.ObtenerMenu();
    this.config = {
      hasAllCheckBox: true,
      hasFilter: false,
      hasCollapseExpand: false,
      decoupleChildFromParent: false,
      maxHeight: 800
   };
  }

  ObtenerMenu(){

   let id_modulo=(this.id_modulo!=null)?this.id_modulo:0;
    this.svcPerfiles.ListarDetalleMenuTreeview(this.idPerfil, id_modulo).subscribe(
      data =>{
        this.response = data;
        this.arregloMemoria = data;
        this.response.forEach(element => {
          if(element.nivel == 0){
            let hijos = this.obtenerHijos(this.response,element.id_menu);
            if(hijos.length != 0){
              this.arregloTreeview.push(new TreeviewItem({text: element.nombre_menu, value: element.id_menu, children: hijos}));
            }else{
              this.arregloTreeview.push(new TreeviewItem({text: element.nombre_menu, value: element.id_menu, checked: element.estado_menu}));
            }
          }
        });
      }
    )
  }
  obtenerHijos(arreglo,idmenu){
    let array = [] ;
    arreglo.forEach(element => {
      if(element.id_menu_padre == idmenu){
        let array_hijo = [];
        array_hijo = this.obtenerHijos(arreglo,element.id_menu);
        array.push({text: element.nombre_menu, value: element.id_menu, checked: element.estado_menu, children: array_hijo});
      }
    });
    return array;
  }

  onSelectedChange(evento: DownlineTreeviewItem[]){
    if(evento.length != 0){
      this.arreglomenusenvio = [];
      evento.forEach(element => {
        let entidad = this.arregloMemoria.find(x => x.id_menu == element.item.value);
        this.arreglomenusenvio.push({id_detalle_perfil_menu : entidad.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.item.value, usuario_creacion: sessionStorage.getItem("Usuario"), estado: true});
        if(element.parent != null){
          let entidadSub = this.arregloMemoria.find(x => x.id_menu == element.parent.item.value);
          let existente = this.arreglomenusenvio.find(x => x.id_menu == element.parent.item.value);
          if(existente == undefined){
            this.arreglomenusenvio.push({id_detalle_perfil_menu : entidadSub.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.parent.item.value, usuario_creacion: sessionStorage.getItem("Usuario"), estado: true});
          }          
        }
      });
    }else{
      this.arreglomenusenvio = [];
    }
    this.arregloMemoria.forEach(element => {
      if(element.id_detalle_perfil_menu != 0){
        let existe = this.arreglomenusenvio.find(x => x.id_detalle_perfil_menu == element.id_detalle_perfil_menu);
        if(existe == undefined){
          this.arreglomenusenvio.push({id_detalle_perfil_menu : element.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.id_menu, usuario_creacion: sessionStorage.getItem("Usuario"), estado: false});
        }
      }      
    });
    if(this.arreglomenusenvio.length == 0){
      this.ocultarregistrar = true;
    }else{
      this.ocultarregistrar = false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  guardarAsignacion(){ 
    this.svcPerfiles.registrarDetalle(this.arreglomenusenvio).subscribe(
      data=>{
        if(data == 0){
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
        else{
          this.entidadModal.id_menu = null;
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("insertar",""));
          this.closeModal();
        }
      }
    )
  }
  CargarListadoSistemas():void{
    this.svModulo.listarModuloCombo().subscribe((data:any)=>{
      this.ListadoSistemas=data;
    });
  }
  CargarTreeView(e:any){
    this.arregloTreeview=[];
    if(e===undefined){
      this.id_modulo=null;
    }
    else{
      this.id_modulo=e.id_modulo;
      this.ObtenerMenu();
    }
  }
  //this.ObtenerMenu()
}
