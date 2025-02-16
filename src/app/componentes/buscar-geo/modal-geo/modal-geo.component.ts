import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { Functions } from '../../../appSettings';
import { ModalGeo, GeoTramo } from '../../../models/GEO';
import { GeoTramoService } from '../../../services/geo-tramo.service';

@Component({
  selector: 'app-modal-geo',
  templateUrl: './modal-geo.component.html',
  styleUrls: ['./modal-geo.component.css']
})
export class ModalGeoComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : ModalGeo;
  entidadEditar;
  cambiarEditar:boolean = true;
  codigosZonas:any = [];
  tramos:any = [];
  UnidadMedidas:any = [];
  FileGeo : any;  
  formData: FormData = new FormData();
  response : any;
  constructor(public modalRef: BsModalRef, public funciones : Functions, private svcGeotramo : GeoTramoService) { }

  ngOnInit() {
    this.entidadModal = new ModalGeo();
    this.listarCodigosZonas();
    this.listarTramos();
    this.listarUnidadesMedidas();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
  }
  fileChangeEvent(evento: any) {
    this.FileGeo = evento.target.files[0];
    // if (evento.uploaded != null) {
    // }
  }
  listarTramos() {
    this.svcGeotramo.ListarTramos().subscribe(
      data => {
        this.tramos = data;
      }
    ) 
  }
  listarCodigosZonas() {
    this.svcGeotramo.ListarZonas().subscribe(
      data => {
        this.codigosZonas = data;
      }
    ) 
  }
  listarUnidadesMedidas() {
    this.svcGeotramo.ListarMedidas().subscribe(
      data => {
        this.UnidadMedidas = data;
      }
    ) 
  }
  setearCamposEditar(){
    this.entidadModal.id_geo_tramo = this.entidadEditar.id_geo_tramo;
    this.entidadModal.id_tramo = this.entidadEditar.id_tramo;
    this.entidadModal.longitud = this.entidadEditar.longitud;
    this.entidadModal.id_unidad_medida = this.entidadEditar.id_unidad_medida;
    this.entidadModal.codigo_clasificador_ruta = this.entidadEditar.codigo_clasificador_ruta;
    this.entidadModal.nombre_camino = this.entidadEditar.nombre_camino;
    this.entidadModal.codigo_provisional_ruta = this.entidadEditar.codigo_provisional_ruta;
    this.entidadModal.descripcion_provisional = this.entidadEditar.descripcion_provisional;
    this.entidadModal.codigo_zona = this.entidadEditar.codigo_zona;
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  administrarGEO(){
    if(this.entidadEditar==null){
      this.guardarGEO();
    }else{
      this.editarGEO();
    }
  }
  editarGEO(){   
    this.formData = new FormData();
    if(this.validar()){
      let entidadEditar = new GeoTramo();
      entidadEditar.id_geo_tramo = this.entidadModal.id_geo_tramo;
      entidadEditar.id_tramo = this.entidadModal.id_tramo;
      entidadEditar.longitud = Number.parseFloat(this.entidadModal.longitud.toString().replace(/,/g,""));
      entidadEditar.id_unidad_medida = this.entidadModal.id_unidad_medida;
      entidadEditar.codigo_clasificador_ruta = this.entidadModal.codigo_clasificador_ruta == null ? "" : this.entidadModal.codigo_clasificador_ruta;
      entidadEditar.nombre_camino = this.entidadModal.nombre_camino == null ? "" : this.entidadModal.nombre_camino;
      entidadEditar.codigo_provisional_ruta = this.entidadModal.codigo_provisional_ruta == null ? "" : this.entidadModal.codigo_provisional_ruta;
      entidadEditar.descripcion_provisional = this.entidadModal.descripcion_provisional == null ? "" : this.entidadModal.descripcion_provisional;
      entidadEditar.codigo_zona = this.entidadModal.codigo_zona;
      entidadEditar.usuario_creacion = sessionStorage.getItem("Usuario");
      this.formData.append("data", this.devolverParametroJson(entidadEditar));
      if(this.FileGeo != null || this.FileGeo != undefined){
        this.formData.append("archivo", this.FileGeo);
      }else{
        this.formData.append("archivo", "");
      }
      this.svcGeotramo.RegistrarEditarGEOTramo(this.formData).subscribe(
        data=>{
          this.response = data;
          if(this.response._body == "0"){
            this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
          }
          else{
            this.funciones.mensaje("success",this.funciones.mostrarMensaje("insertar",""));
            this.retornoValores.emit(0);
            this.modalRef.hide();
          }
        }
      ) 
    }
  }

  guardarGEO(){    
    this.formData = new FormData();
    if(this.validar()){
      let entidadRegistrar = new GeoTramo();
      entidadRegistrar.id_geo_tramo = 0;
      entidadRegistrar.id_tramo = this.entidadModal.id_tramo;
      entidadRegistrar.longitud = Number.parseFloat(this.entidadModal.longitud.toString().replace(/,/g,""));
      entidadRegistrar.id_unidad_medida = this.entidadModal.id_unidad_medida;
      entidadRegistrar.codigo_clasificador_ruta = this.entidadModal.codigo_clasificador_ruta == null ? "" : this.entidadModal.codigo_clasificador_ruta;
      entidadRegistrar.nombre_camino = this.entidadModal.nombre_camino == null ? "" : this.entidadModal.nombre_camino;
      entidadRegistrar.codigo_provisional_ruta = this.entidadModal.codigo_provisional_ruta == null ? "" : this.entidadModal.codigo_provisional_ruta;
      entidadRegistrar.descripcion_provisional = this.entidadModal.descripcion_provisional == null ? "" : this.entidadModal.descripcion_provisional;
      entidadRegistrar.codigo_zona = this.entidadModal.codigo_zona;
      entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
      this.formData.append("data", this.devolverParametroJson(entidadRegistrar));
      if(this.FileGeo != null || this.FileGeo != undefined){
        this.formData.append("archivo", this.FileGeo);
      }else{
        this.funciones.alertaSimple("warning","Debe adjuntar un archivo zip del dato geográfico","",true);
        return false;
      }
      this.svcGeotramo.RegistrarEditarGEOTramo(this.formData).subscribe(
        data=>{
          this.response = data;
          if(this.response._body == "0"){
            this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
          }
          else{
            this.funciones.mensaje("success",this.funciones.mostrarMensaje("insertar",""));
            this.retornoValores.emit(0);
            this.modalRef.hide();
          }
        }
      ) 
    }
       
  }
  devolverParametroJson(pList) {
    let entidad = {
      data: JSON.stringify(pList)
    }
    return entidad.data;
  }

  validar(){
    if(this.entidadModal.id_tramo == null){
      this.funciones.alertaSimple("warning","Debe seleccionar un tramo","",true);
      return false;
    }
    if(this.entidadModal.longitud == null || this.entidadModal.longitud.toString() == ""){
      this.funciones.alertaSimple("warning","Debe ingresar una longitud","",true);
      return false;
    }
    if(this.entidadModal.id_unidad_medida == null){
      this.funciones.alertaSimple("warning","Debe seleccionar una unidad de medida","",true);
      return false;
    }
    if((this.entidadModal.codigo_clasificador_ruta == null || this.entidadModal.codigo_clasificador_ruta == "") && (this.entidadModal.codigo_provisional_ruta == null || this.entidadModal.codigo_provisional_ruta == "")){
      this.funciones.alertaSimple("warning","Debe ingresar un código clasificador de ruta o un código provisional de ruta","",true);
      return false;
    }
    if(this.entidadModal.codigo_clasificador_ruta != null && this.entidadModal.codigo_clasificador_ruta != ""){
      if(this.entidadModal.nombre_camino == null || this.entidadModal.nombre_camino == ""){
        this.funciones.alertaSimple("warning","Debe ingresar un nombre de camino","",true);
        return false;
      }
    }
    if(this.entidadModal.codigo_provisional_ruta != null && this.entidadModal.codigo_provisional_ruta != ""){
      if(this.entidadModal.descripcion_provisional  == null || this.entidadModal.descripcion_provisional == ""){
        this.funciones.alertaSimple("warning","Debe ingresar una descripcion provisional","",true);
        return false;
      }
    }
    if(this.entidadEditar == null){
      if(this.entidadModal.codigo_zona == null){
        this.funciones.alertaSimple("warning","Debe seleccionar un código de zona","",true);
        return false;
      }
    }    
    return true;
  }

}
