import { Component, OnInit ,ViewEncapsulation, EventEmitter, Output} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TramoModal, _tramo } from '../../models/Convenio';
import { FormControl } from '@angular/forms';
import { TramoService } from '../../services/tramo.service';
import { Functions } from '../../appSettings/functions';

@Component({
  selector: 'app-modal-tramo',
  templateUrl: './modal-tramo.component.html',
  styleUrls: ['./modal-tramo.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [Functions]
})
export class ModalTramoComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal : TramoModal;
  buscarProyecto: FormControl = new FormControl();
  entidadEditar;
  proyectos;
  cambiarEditar:boolean = true;
  constructor(public modalRef: BsModalRef, private svcTramo:TramoService, private funciones : Functions ) { }

  ngOnInit() {    
    this.entidadModal = new TramoModal();
    if(this.entidadEditar != null){
      this.entidadModal.nombreProyecto = this.entidadEditar.nombre_proyecto;
      this.entidadModal.nombreTramo = this.entidadEditar.nombre_tramo;
      this.cambiarEditar=false;
    }else{
      this.ConsultarProyectosAutocomplete();
    }    
  }
  administrarTramo(){
    if(this.entidadEditar != null){
      this.editarTramos();
    }else{
      this.guardarTramos();
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  limpiarAutocomplete() {
    this.proyectos = undefined;
  }
  mostrarProyectoSeleccionado(pProyectoSeleccionado) {
    this.entidadModal.codProyecto = pProyectoSeleccionado.split('|')[0];
    this.entidadModal.nombreProyecto = pProyectoSeleccionado.split('|')[1];
    this.proyectos = null;
  }

  ConsultarProyectosAutocomplete() {
    this.buscarProyecto.valueChanges.subscribe(
      term => {
        if (term != null || term != undefined) {
          if (term.length > 2) {
            let busqueda = term;
            this.svcTramo.BusquedaProyecto(busqueda).subscribe(
              data => {
                 this.proyectos = data;
              })
          } else {
            this.proyectos = null;
          }
        }
      })
  }

  guardarTramos(){
    if(this.entidadModal.nombreProyecto == null || this.entidadModal.nombreProyecto == ""){
        this.funciones.mensaje("warning","Debe de ingresar un proyecto");
        return;
    }
      let envioRegistrar = new _tramo();
      envioRegistrar.id_proyecto = this.entidadModal.codProyecto;
      envioRegistrar.id_tramo = 0;
      envioRegistrar.nombre_tramo = this.entidadModal.nombreTramo;
      envioRegistrar.descripcion_tramo = this.entidadModal.nombreTramo;
      envioRegistrar.activo = true;
      envioRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
      envioRegistrar.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.svcTramo.registrarTramo(envioRegistrar).subscribe(
        response => { 
          if(response == 0){
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
  editarTramos(){
      let envioEditar = new _tramo();
      envioEditar.id_proyecto = this.entidadEditar.id_proyecto;
      envioEditar.id_tramo = this.entidadEditar.id_tramo;
      envioEditar.nombre_tramo = this.entidadModal.nombreTramo;
      envioEditar.descripcion_tramo = this.entidadModal.nombreTramo;
      envioEditar.activo = true;
      envioEditar.usuario_creacion = sessionStorage.getItem("Usuario");
      envioEditar.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.svcTramo.editarTramo(envioEditar).subscribe(
        response => { 
          if(response == 0){
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
