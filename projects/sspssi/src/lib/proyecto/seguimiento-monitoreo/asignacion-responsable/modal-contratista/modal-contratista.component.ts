import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contratista } from '../../../../../models/response/contratista';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from '../../../../../patterns/facade.service';
import { Functions } from '../../../../../appSettings';
import { ProcesoSeleccionService } from '../../../../../servicios/proceso-seleccion.service';
import { ProcesoSeleccionBienesServiciosRequest } from '../../../../../models/request/proceso-seleccion-bs-request';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ssi-modal-contratista',
  templateUrl: './modal-contratista.component.html',
  styleUrls: ['./modal-contratista.component.css']
})
export class ModalContratistaComponent implements OnInit {

  model: Contratista;
  listaContratista: any = [];
  listaConsorcio: any = [];
  cambiarEditar = false;
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  respContratista;
  id_seguimientoMonitoreoObra: number;
  bMostrar = false;
  esConsorcio = false;
  consorciadosDetalleList: FormArray;
  listConsorciadoEliminados: FormArray;
  mostrarConsorcio = false;
  formGroupContratista: FormGroup;
  @Output() emitResponsable = new EventEmitter();

  bEstado: boolean;


  constructor(private modalRef: BsModalRef, private fs: FacadeService, public funciones: Functions, private fb: FormBuilder) {
    this.formGroupContratista = this.fb.group({
      id_contratista_seguimiento_obra: [0],
      id_seguimiento_monitoreo_obra: [0],
      ruc: ['', Validators.required],
      razon_social: ['', Validators.required],
      dni_representante_legal: ['', Validators.required],
      apellido_representante_legal: ['', Validators.required],
      nombre_representante_legal: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipo_contratista: [false],
      ListDetalleContratista: this.fb.array([]),
    });

  }

  ngOnInit() {
    this.formGroupContratista.patchValue({
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
    });
    this.consorciadosDetalleList = this.formGroupContratista.get('ListDetalleContratista') as FormArray;
    this.listConsorciadoEliminados = new FormArray([]);
    this.listarContratista(this.id_seguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  }

  listarContratista(id_seguimientoMonitoreoObra, filas, paginas) {
    this.fs.contratistaService.listarContratista(id_seguimientoMonitoreoObra, filas, paginas).subscribe(
      respuesta => {
        this.respContratista = respuesta as any;
        this.totalRegistros = this.respContratista[0].cantidad;

        if (this.totalRegistros > 0) {
          this.listaContratista = this.respContratista[0].contratistas != null ? this.respContratista[0].contratistas : [];
        } else {
          this.listaContratista = [];
        }
      }
    );
  }

  registrarContratista() {
    const contratistaEnvio = Object.assign({}, this.formGroupContratista.value);
    const consorciadosEnvio = Object.assign([], this.listConsorciadoEliminados.value);

    if (this.cambiarEditar) {
      // modificar
      contratistaEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      consorciadosEnvio.forEach(element => {
        contratistaEnvio.ListDetalleContratista.push(element);
      });
      this.fs.contratistaService.actualizarContratista(contratistaEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarContratista(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupContratista.reset();
            this.setControles();
            this.reiniciarConsorciados();
            this.cambiarEditar = false;
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      // insertar
      contratistaEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.fs.contratistaService.registrarContratista(contratistaEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarContratista(this.id_seguimientoMonitoreoObra, this.num_filas, this.paginaActiva);
            this.formGroupContratista.reset();
            this.setControles();
            this.reiniciarConsorciados();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  editarContratista(contratista) {
    this.cambiarEditar = true;
    this.mostrarConsorcio = false;
    this.formGroupContratista.patchValue({
      id_contratista_seguimiento_obra: contratista.id_contratista_seguimiento_obra,
      id_seguimiento_monitoreo_obra: contratista.id_seguimiento_monitoreo_obra,
      ruc: contratista.ruc,
      razon_social: contratista.razon_social,
      dni_representante_legal: contratista.dni_representante_legal,
      apellido_representante_legal: contratista.apellido_representante_legal,
      nombre_representante_legal: contratista.nombre_representante_legal,
      telefono: contratista.telefono,
      email: contratista.email,
      tipo_contratista: contratista.tipo_contratista,
    });
    if (contratista.tipo_contratista) {
      this.esConsorcio = true;
      this.cargarConsorciadosEdicion(contratista.listacontratistas);
    }
  }

  desactivarContratista(index: number) {
    const temp = this.consorciadosDetalleList.at(index);
    temp.patchValue({
      tipo_contratista: false,
      activo: false,
    });
    this.listConsorciadoEliminados.push(temp);
  }

  removerContratistaDetalle(index: number) {
    this.desactivarContratista(index);
    this.consorciadosDetalleList.removeAt(index);
  }

  agregarContratistaDetalle() {
    this.consorciadosDetalleList.push(this.createConsorciadoDetalle());
  }

  createConsorciadoDetalle(): FormGroup {
    return this.fb.group({
      id_detalle_contratista_seguimiento_obra: [0],
      id_contratista_seguimiento_obra: [parseInt(this.formGroupContratista.get('id_seguimiento_monitoreo_obra').value, 10)],
      ruc_detalle: [null, Validators.required],
      razon_social_detalle: [null, Validators.required],
      nombre_porcentaje_participacion: [null, Validators.required],
      tipo_contratista: [true],
      activo: [true],
      usuario_modificacion: sessionStorage.getItem('Usuario'),
    });
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.formGroupContratista.patchValue({
      id_contratista_seguimiento_obra: 0,
      id_seguimiento_monitoreo_obra: this.id_seguimientoMonitoreoObra,
      tipo_contratista: false,
    });
    this.esConsorcio = false;
    this.reiniciarConsorciados();
    this.listConsorciadoEliminados = new FormArray([]);
  }

  activarCargaConsorcio(evento: any) {
    this.esConsorcio = evento;
    if (this.esConsorcio) {
      this.agregarContratistaDetalle();
    } else {
      this.reiniciarConsorciados();
    }
  }

  reiniciarConsorciados() {
    while (this.consorciadosDetalleList.length != 0) {
      if (this.consorciadosDetalleList.at(0).get('id_detalle_contratista_seguimiento_obra').value != 0) {
        this.desactivarContratista(0);
      }
      this.consorciadosDetalleList.removeAt(0);
    }
  }

  mostrarConsorciados(consorciados: any) {
    if (!this.mostrarConsorcio) {
      this.mostrarConsorcio = true;
      this.listaConsorcio = consorciados;
    } else {
      this.mostrarConsorcio = false;
      this.listaConsorcio = [];
    }
  }

  cargarConsorciadosEdicion(listaConsorcio: any) {
    const consorciadosEdicion: FormArray = <FormArray>this.formGroupContratista.get('ListDetalleContratista');
    if (listaConsorcio.length > 0) {
      for (let i = 0; i < listaConsorcio.length; i++) {
        consorciadosEdicion.push(this.fb.group({
          id_detalle_contratista_seguimiento_obra: listaConsorcio[i].id_detalle_contratista_seguimiento_obra,
          id_contratista_seguimiento_obra: listaConsorcio[i].id_contratista_seguimiento_obra,
          ruc_detalle: listaConsorcio[i].ruc_detalle,
          razon_social_detalle: listaConsorcio[i].razon_social_detalle,
          nombre_porcentaje_participacion: listaConsorcio[i].nombre_porcentaje_participacion,
          activo: listaConsorcio[i].activo,
          tipo_contratista: listaConsorcio[i].tipo_contratista,
        }));
      }
    }
  }
}
