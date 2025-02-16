import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { Functions } from '../../../appSettings/functions';
import { ComponenteModal, Componente } from '../../../models/Componente';
import { ComponenteService } from '../../../services/componente.service';
import { FormControl } from '../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-modal-componentes',
  templateUrl: './modal-componentes.component.html',
  styleUrls: ['./modal-componentes.component.css']
})
export class ModalComponentesComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  buscarPagina: FormControl = new FormControl();
  buscarModulo: FormControl = new FormControl();
  buscarEvento: FormControl = new FormControl();
  buscarSeccion: FormControl = new FormControl();
  entidadModal : ComponenteModal;
  entidadEditar;
  cambiarEditar:boolean = true;
  //---------
  paginas:any = [];
  modulos:any = [];
  eventos:any = [];
  secciones:any = [];
  constructor(public modalRef: BsModalRef, private funciones : Functions, private svcComponente : ComponenteService) { }

  ngOnInit() {
    this.entidadModal = new ComponenteModal();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
    this.ConsultarPaginasAutocomplete();
    this.ConsultarModulosAutocomplete();
    this.ConsultarEventosAutocomplete();
    this.ConsultarSeccionesAutocomplete();
  }

  ConsultarPaginasAutocomplete() {
    this.buscarPagina.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            let busqueda = term;
            this.svcComponente.AutoCompletePagina(busqueda).subscribe(
              data => {
                if(data == ""){
                  this.paginas = null;
                }else{
                  this.paginas = data;
                }
              })
          } else {
            this.paginas = null;
          }
        }
      })
  }

  ConsultarModulosAutocomplete() {
    this.buscarModulo.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            let busqueda = term;
            this.svcComponente.AutoCompleteModulo(busqueda).subscribe(
              data => {
                if(data == ""){
                  this.modulos = null;
                }else{
                  this.modulos = data;
                }
              })
          } else {
            this.modulos = null;
          }
        }
      })
  }

  ConsultarEventosAutocomplete() {
    this.buscarEvento.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            let busqueda = term;
            this.svcComponente.AutoCompleteEvento(busqueda).subscribe(
              data => {
                if(data == ""){
                  this.eventos = null;
                }else{
                  this.eventos = data;
                }
              })
          } else {
            this.eventos = null;
          }
        }
      })
  }

  ConsultarSeccionesAutocomplete() {
    this.buscarSeccion.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            let busqueda = term;
            this.svcComponente.AutoCompleteSecciones(busqueda).subscribe(
              data => {
                if(data == ""){
                  this.secciones = null;
                }else{
                  this.secciones = data;
                }
              })
          } else {
            this.secciones = null;
          }
        }
      })
  }

  limpiarAutocomplete(campo) {
    if(campo == "pagina"){
      this.paginas = undefined;
    }
    else if(campo == "modulo"){
      this.modulos = undefined;
    }
    else if(campo ==  "evento"){
      this.eventos = undefined;
    }
    else{
      this.secciones = undefined;
    }
    //this.proyectos = undefined;
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

  administrarComponente(){
    if(this.entidadEditar==null){
      this.guardarComponente();
    }else{
      this.editarComponente();
    }
  }
  setearCamposEditar(){
    this.entidadModal.id_componente = this.entidadEditar.id_componente;
    this.entidadModal.nombre_componente = this.entidadEditar.nombre_componente;
    this.entidadModal.descripcion = this.entidadEditar.descripcion;
    this.entidadModal.evento = this.entidadEditar.evento;
    this.entidadModal.modulo = this.entidadEditar.modulo;
    this.entidadModal.pagina = this.entidadEditar.pagina;
    this.entidadModal.seccion = this.entidadEditar.seccion;
    this.entidadModal.tipo_componente = this.entidadEditar.tipo_componente;
    this.entidadModal.estado = this.entidadEditar.estado;
}
  editarComponente(){   
    let entidadEditar = new Componente();
    entidadEditar.id_componente = this.entidadEditar.id_componente;
    entidadEditar.nombre_componente = this.entidadModal.nombre_componente;
    entidadEditar.descripcion = this.entidadModal.descripcion;
    entidadEditar.evento = this.entidadModal.evento;
    entidadEditar.modulo = this.entidadModal.modulo;
    entidadEditar.pagina = this.entidadModal.pagina;
    entidadEditar.tipo_componente = this.entidadModal.tipo_componente;
    entidadEditar.seccion = this.entidadModal.seccion;
    entidadEditar.estado = this.entidadModal.estado;
    entidadEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcComponente.editarComponente(entidadEditar).subscribe(
      data=>{
        if(data == 0){
          this.funciones.mensaje("error",this.funciones.mostrarMensaje("error",""));
        }
        else{
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("actualizar",""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }
  guardarComponente(){ 
    let entidadRegistrar = new Componente();
    entidadRegistrar.id_componente = 0;
    entidadRegistrar.nombre_componente = this.entidadModal.nombre_componente;
    entidadRegistrar.descripcion = this.entidadModal.descripcion;
    entidadRegistrar.evento = this.entidadModal.evento;
    entidadRegistrar.modulo = this.entidadModal.modulo;
    entidadRegistrar.pagina = this.entidadModal.pagina;
    entidadRegistrar.tipo_componente = this.entidadModal.tipo_componente;
    entidadRegistrar.seccion = this.entidadModal.seccion;
    entidadRegistrar.estado = true;
    entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    this.svcComponente.registrarComponente(entidadRegistrar).subscribe(
      data=>{
        if(data == 0){
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
