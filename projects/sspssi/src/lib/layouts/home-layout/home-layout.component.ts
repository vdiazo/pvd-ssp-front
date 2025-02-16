import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccesoService } from '../../../servicios/acceso.service';
import { ModalGatewayComponent } from '../../modales/modal-gateway/modal-gateway.component';
import { take } from 'rxjs/internal/operators/take';


@Component({
  selector: 'ssi-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  public txtUsuario: string;
  public esLogin:boolean;
  public perfiles: any;
  menu:any=[];
  public bsModalsistemasRef:BsModalRef;
  public MostarOpcionCambiarPerfil:boolean=false;
  constructor(private modalService:BsModalService, private AccesoService:AccesoService) { }

  ngOnInit() {
    // this.txtUsuario = (sessionStorage.getItem("Municipalidad") == '') ? sessionStorage.getItem("Nombre_Usuario") : sessionStorage.getItem("Municipalidad");
    this.txtUsuario =sessionStorage.getItem("Nombre_Usuario");
    let IdUsuario = sessionStorage.getItem("IdUsuario");
    let Id_Perfil = sessionStorage.getItem("Id_Perfil");

      if(sessionStorage.getItem("Componentes")!=null){
        let info=JSON.parse(sessionStorage.getItem("Componentes"));
        this.menu=this.getJSONmenu(info.menu);
        if(sessionStorage.getItem("Id_Detalle_Usuario")==null){
          sessionStorage.setItem("Id_Detalle_Usuario",info.id_detalle_usuario);
        }
      }

       this.esLogin=(sessionStorage.getItem("Tipo")=="Login")?true:false;


    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#black-panel').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
      $('#black-panel').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
          $('#sidebar').removeClass('active');
        }
        if ($('#black-panel').hasClass('active')) {
          $('#black-panel').removeClass('active');
        }
      });
    });
    this.ValidarOpcionPerfiles();
  }
  getJSONmenu(data: any):any {

    let menu:any;
    let i:number=0;

    let item:any;
    let rpta:any=[];
    for (i=0;i<data.length;i++)
    {
      item = data[i];

      if (item["nivel"]==0)
      {
        item.hijos=this.cargarMenu(item,data,item["id_menu"],(item["nivel"]+1));
        rpta.push({"trama":item});
      }
    }
    return rpta;
  }
  cargarMenu(itempadre,_data,_id_menu,_nivel)
  {
    let i:number=0;
    let item:any;
    let submenu=[];
    //let items=[];

    for (i=0;i<_data.length;i++)
    {
      item = _data[i];
      if (item["id_menu_padre"] == _id_menu && item["nivel"] == _nivel)
      {
        item.hijos=this.cargarMenu(item,_data,item["id_menu"],(item["nivel"]+1));
        submenu.push({"trama":item});
        //submenu.push({"trama":item,"hijos":this.cargarMenu(item,_data,item["id_menu"],(item["nivel"]+1))});
      }
    }

    return submenu;
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
  getPerfil(pmensaje) {
    this.perfiles = pmensaje;
  }
  AccederComo() {
    let ListadoSistemas=[];
     this.AccesoService.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario'))).subscribe((data:any)=>{
      ListadoSistemas=data;

      ListadoSistemas.map((item)=>{
        if(item.codigo_modulo==="ssi"){
          item.bg_color = "#db4437";
          item.color="#ffffff";
        }
        if(item.codigo_modulo==="ssp"){
          item.bg_color="#db4437";
          item.color="#ffffff";
        }
      });

      let AccesoDirecto:boolean=(ListadoSistemas.length===1 && ListadoSistemas[0].perfiles.length===1)?true:false;

      if(AccesoDirecto){
      }
      else{
        let config = {
          ignoreBackdropClick: false,
          class: "modal-sm",
          keyboard: false,
          initialState: {
            ListadoSistemas:ListadoSistemas
          }
        };
        this.bsModalsistemasRef = this.modalService.show(ModalGatewayComponent,config);
      }
     });
  }
  ValidarOpcionPerfiles():void{
    let ListadoSistemas=[];
    this.AccesoService.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario')))
    .pipe( take(1) )
    .subscribe((data:any)=>{
      ListadoSistemas=data;
      if(data.length>1){
        this.MostarOpcionCambiarPerfil=(ListadoSistemas.length==1 && ListadoSistemas[0].perfiles.length==1)?false:true;
      }

    });
  }
}
