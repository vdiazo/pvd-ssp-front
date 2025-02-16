import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ContratistaExpedienteService } from 'projects/sspssi/src/servicios/expediente/responsables/contratista-expediente.service';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-contratista-expediente',
  templateUrl: './modal-contratista-expediente.component.html',
  styleUrls: ['./modal-contratista-expediente.component.css']
})
export class ModalContratistaExpedienteComponent implements OnInit {

  id_seguimientoMonitoreoExpediente: number;
  bEstado: boolean;
  formGroupContratista: FormGroup;
  cambiarEditar = false;
  listaContratista: any = [];
  listaConsorcio: any = [];
  rptaListaContratista: any;

  bMostrar = false;
  esConsorcio = false;
  consorciadosDetalleList: FormArray;
  listConsorciadoEliminados: FormArray;
  mostrarConsorcio = false;
  totalRegistros: number;
  paginaActiva = 0;
  numero_Pagina = 0;
  num_filas = 5;
  numPaginasMostrar = 5;

  @Output() emitResponsableContratista = new EventEmitter();

  constructor(private fb: FormBuilder, public modalRef: BsModalRef, private contratistaService: ContratistaExpedienteService, public funciones: Functions) {
  }

  ngOnInit() {
    this.formGroupContratista = this.fb.group({
      id_contratista_seguimiento_expediente: [0],
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
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
    this.consorciadosDetalleList = this.formGroupContratista.get('ListDetalleContratista') as FormArray;
    this.listConsorciadoEliminados = new FormArray([]);

    this.listarContratista(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
  }

  listarContratista(id_seguimientoMonitoreoExpediente: number, nro_filas: number, nro_pagina: number) {
    this.contratistaService.listarContratista(id_seguimientoMonitoreoExpediente, nro_filas, nro_pagina).subscribe(
      data => {
        this.rptaListaContratista = data;
        this.totalRegistros = this.rptaListaContratista[0].cantidad;
        if (this.totalRegistros > 0) {
          this.listaContratista = this.rptaListaContratista[0].contratistas;
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
      this.contratistaService.actualizarContratista(contratistaEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.listarContratista(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
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
      this.contratistaService.registrarContratista(contratistaEnvio).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.listarContratista(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.paginaActiva);
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
      id_contratista_seguimiento_expediente: contratista.id_contratista_seguimiento_expediente,
      id_seguimiento_ejecucion_expediente: contratista.id_seguimiento_ejecucion_expediente,
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
      id_detalle_contratista_seguimiento_expediente: [0],
      id_contratista_seguimiento_expediente: [0],
      ruc_detalle: [null],
      razon_social_detalle: [null],
      nombre_porcentaje_participacion: [null],
      activo: [true],
      usuario_modificacion: sessionStorage.getItem('Usuario'),
    });
  }

  closeModal() {
    this.emitResponsableContratista.emit(this.id_seguimientoMonitoreoExpediente);
    this.modalRef.hide();
  }

  setControles() {
    this.formGroupContratista.patchValue({
      id_contratista_seguimiento_expediente: 0,
      id_seguimiento_ejecucion_expediente: this.id_seguimientoMonitoreoExpediente,
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
    while (this.consorciadosDetalleList.length !== 0) {
      if (this.consorciadosDetalleList.at(0).get('id_detalle_contratista_seguimiento_expediente').value != 0) {
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
          id_detalle_contratista_seguimiento_expediente: listaConsorcio[i].id_detalle_contratista_seguimiento_expediente,
          id_contratista_seguimiento_expediente: listaConsorcio[i].id_contratista_seguimiento_expediente,
          ruc_detalle: listaConsorcio[i].ruc_detalle,
          razon_social_detalle: listaConsorcio[i].razon_social_detalle,
          nombre_porcentaje_participacion: listaConsorcio[i].nombre_porcentaje_participacion,
          activo: listaConsorcio[i].tipo_contratista,
        }));
      }
    }
  }
}
