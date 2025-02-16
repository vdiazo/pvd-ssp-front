import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResponsablesPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/responsables-preinversion.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { isNullOrUndefined } from 'util';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';

@Component({
  selector: 'ssi-modal-crud-contratista',
  templateUrl: './modal-crud-contratista-pre.component.html',
  styleUrls: ['./modal-crud-contratista-pre.component.css']
})
export class ModalCrudContratistaPreComponent implements OnInit {

  formRegistroContratistaPreinversion: FormGroup;
  listConsorciadoEliminados: any[] = [];
  id_seguimientoMonitoreoPreinversion: number = 0;
  listaContratista: any[] = [];
  listaConsorcio: any[] = [];
  mostrarConsorcio: boolean = false;
  esConsorcio: boolean = false;
  itemsPerPage: number = 5;
  totalRegistros: number = 0;
  cambiarEditar: boolean = false;
  bEstado: boolean = false;
  @Output() retornoValores = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private bsModal: BsModalRef,
    private contratistaPreSvc: ResponsablesPreinversionService,
    private facadeSvc: FacadeService,
    public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarContratistaPreinversion(1);
  }

  createForm() {
    this.formRegistroContratistaPreinversion = this.fb.group({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_contratista_seguimiento_preinversion: 0,
      ruc: null,
      razon_social: null,
      apellido_representante_legal: null,
      nombre_representante_legal: null,
      dni_representante_legal: null,
      telefono: null,
      email: null,
      tipo_contratista: false,
      detallecontratista: this.fb.array([])
    });
  }

  createDetalleContratista(): FormGroup {
    return this.fb.group({
      id_detalle_contratista_seguimiento_preinversion: 0,
      id_contratista_seguimiento_preinversion: parseInt(this.f.id_contratista_seguimiento_preinversion.value, 10),
      ruc_detalle: null,
      razon_social_detalle: null,
      nombre_porcentaje_participacion: null,
      tipo_contratista: true,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
      activo: true,
    });
  }

  agregarContratistaDetalle() {
    this.detalle_contratista.push(this.createDetalleContratista());
  }

  removerContratistaDetalle(index: number) {
    this.desactivarContratista(index);
    this.detalle_contratista.removeAt(index);
  }

  listarContratistaPreinversion(pagina: number) {
    const param = { id_seguimiento: this.id_seguimientoMonitoreoPreinversion, limit: this.itemsPerPage, offset: (pagina - 1) * this.itemsPerPage };
    this.contratistaPreSvc.listarContratistaPreinversion(param).subscribe((data: any) => {
      this.totalRegistros = data.cantidad;
      if (this.totalRegistros > 0) {
        this.listaContratista = data.contratista;
      } else {
        this.listaContratista = [];
      }
    });
  }

  registrarContratistaPreinversion() {
    const paramEnvio = { ...{}, ...this.formRegistroContratistaPreinversion.value };
    if (this.cambiarEditar) {
      // modificar
      paramEnvio.usuario_modificacion = this.usuario;
      if (this.listConsorciadoEliminados.length > 0) {
        this.listConsorciadoEliminados.forEach(element => {
          paramEnvio.detallecontratista.push(element);
        });
      }
      this.contratistaPreSvc.modificarContratistaPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
          this.retornoValores.emit();
          this.listarContratistaPreinversion(1);
          this.limpiarForm();
          this.reiniciarConsorciados();
          this.cambiarEditar = false;
        }
      });
    } else {
      // insertar nuevo registro
      paramEnvio.usuario_creacion = this.usuario;
      this.contratistaPreSvc.insertarContratistaPreinversion(paramEnvio).subscribe((data: any) => {
        if (data.resultado > 0) {
          this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
          this.retornoValores.emit();
          this.listarContratistaPreinversion(1);
          this.limpiarForm();
          this.reiniciarConsorciados();
          this.cambiarEditar = false;
        }
      });
    }
  }

  modificarContratistaPreinversion(contratista: any) {
    this.cambiarEditar = true;
    this.esConsorcio = contratista.tipo_contratista;
    this.cargarConsorciadosEdicion(contratista.detallecontratista);
    this.formRegistroContratistaPreinversion.patchValue(contratista);
  }

  cargarConsorciadosEdicion(listaConsorcio: any) {
    if (listaConsorcio.length > 0) {
      for (let i = 0; i < listaConsorcio.length; i++) {
        this.detalle_contratista.push(this.createDetalleContratista());
      }
    }
  }

  anularContratistaPreinversion(idContratista: any) {
    const param = { id_contratista_seguimiento_preinversion: idContratista, usuario_eliminacion: this.usuario };

  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }
  get f(): any { return this.formRegistroContratistaPreinversion.controls; }
  get detalle_contratista(): FormArray { return this.f.detallecontratista as FormArray; }

  validarDNI() {
    const valDni = this.f.dni_representante_legal.value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formRegistroContratistaPreinversion.patchValue({
        apellido_representante_legal: null,
        nombre_representante_legal: null,
      });
    }
  }

  validarInformacionReniec() {
    const valDni = this.f.dni_representante_legal.value;
    if (valDni == '' || valDni == null) {
      // document.getElementById('dni_responsable').focus();
      this.funciones.mensaje('info', 'Debe ingresar el N° de Dni.');
    } else {
      this.facadeSvc.dataExternaService.consultarInformacionReniec(valDni).subscribe((data: any) => {
        if (data.strnombres == '') {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        } else {
          this.formRegistroContratistaPreinversion.patchValue({
            apellido_representante_legal: `${data.strapellidopaterno} ${data.strapellidomaterno}`,
            nombre_representante_legal: data.strnombres,
          });
        }
      },
        (error: any) => {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        }
      );
    }
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
    while (this.detalle_contratista.length !== 0) {
      if (this.detalle_contratista.at(0).get('id_detalle_contratista_seguimiento_preinversion').value != 0) {
        this.desactivarContratista(0);
      }
      this.detalle_contratista.removeAt(0);
    }
  }

  desactivarContratista(index: number) {
    const temp = this.detalle_contratista.at(index).value;
    temp.activo = false;
    this.listConsorciadoEliminados.push(temp);
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

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarContratistaPreinversion(paginaActual);
  }

  limpiarForm() {
    this.formRegistroContratistaPreinversion.reset();
    this.formRegistroContratistaPreinversion.patchValue({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_contratista_seguimiento_preinversion: 0,
      tipo_contratista: false,
    });
    this.esConsorcio = false;
    this.reiniciarConsorciados();
    this.listConsorciadoEliminados = [];
    this.cambiarEditar = false;
  }
  closeModal() {
    this.bsModal.hide();
  }

}
