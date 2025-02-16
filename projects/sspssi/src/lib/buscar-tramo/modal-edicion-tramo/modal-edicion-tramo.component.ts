import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TramoModal, _tramo } from 'projects/sspssi/src/models/Convenio';
import { TramoService } from 'projects/sspssi/src/servicios/tramo.service';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-edicion-tramo',
  templateUrl: './modal-edicion-tramo.component.html',
  styleUrls: ['./modal-edicion-tramo.component.css']
})
export class ModalEdicionTramoComponent implements OnInit {

  proyectos;

  entidadModal: TramoModal;
  entidadEditar;
  cambiarEditar = true;
  @Output() retornoValores = new EventEmitter();

  formEdicionTramo: FormGroup;
  buscarProyecto: FormControl = new FormControl();

  constructor(public modalRef: BsModalRef, private fb: FormBuilder, private tramoService: TramoService, private funciones: Functions) { }

  ngOnInit() {
    this.entidadModal = new TramoModal();
    this.formEdicionTramo = this.fb.group({
      buscarProyecto: this.buscarProyecto,
      nombreTramo: new FormControl(),
      codigoRuta: new FormControl()
    });

    if (this.entidadEditar != null) {
      this.entidadModal.nombreProyecto = this.entidadEditar.nombre_proyecto;
      this.entidadModal.nombreTramo = this.entidadEditar.nombre_tramo;
      this.cambiarEditar = false;

      this.formEdicionTramo.patchValue({
        buscarProyecto: this.entidadModal.nombreProyecto,
        nombreTramo: this.entidadModal.nombreTramo,
        codigoRuta: this.entidadEditar.codigo_ruta,
      });
    } else {
      this.ConsultarProyectosAutocomplete();
    }
  }

  administrarTramo() {
    if (this.entidadEditar != null) {
      this.editarTramo();
    } else {
      this.guardarTramo();
    }
  }

  guardarTramo() {
    const entidadRegistro = new _tramo();
    entidadRegistro.id_tramo = 0;
    entidadRegistro.id_proyecto = parseInt(this.entidadModal.codProyecto.toString(), 10);
    entidadRegistro.nombre_tramo = this.formEdicionTramo.get('nombreTramo').value;
    entidadRegistro.descripcion_tramo = this.formEdicionTramo.get('nombreTramo').value;
    entidadRegistro.codigo_ruta = this.formEdicionTramo.get('codigoRuta').value;
    entidadRegistro.activo = true;
    entidadRegistro.usuario_creacion = sessionStorage.getItem('Usuario');

    this.tramoService.registrarTramo(entidadRegistro).subscribe(
      respuesta => {
        if (respuesta == 0) {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        } else {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }

  editarTramo() {
    const entidadEdicion = new _tramo();
    entidadEdicion.id_tramo = this.entidadEditar.id_tramo;
    entidadEdicion.id_proyecto = this.entidadEditar.id_proyecto;
    entidadEdicion.nombre_tramo = this.formEdicionTramo.get('nombreTramo').value;
    entidadEdicion.descripcion_tramo = this.formEdicionTramo.get('nombreTramo').value;
    entidadEdicion.codigo_ruta = this.formEdicionTramo.get('codigoRuta').value;
    entidadEdicion.activo = true;
    entidadEdicion.usuario_modificacion = sessionStorage.getItem('Usuario');

    this.tramoService.editarTramo(entidadEdicion).subscribe(
      respuesta => {
        if (respuesta == 0) {
          this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
        } else {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
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
            const busqueda = term;
            this.tramoService.BusquedaProyecto(busqueda).subscribe(
              data => {
                this.proyectos = data;
              });
          } else {
            this.proyectos = null;
          }
        }
      });
  }

  limpiarAutocomplete() {
    this.proyectos = undefined;
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
}
