import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, tipoArchivo } from 'projects/sspssi/src/appSettings';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ResponsablesPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento/responsables-preinversion.service';
import { isNullOrUndefined } from 'util';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';

@Component({
  selector: 'ssi-modal-crud-responsables-pre',
  templateUrl: './modal-crud-responsables-pre.component.html',
  styleUrls: ['./modal-crud-responsables-pre.component.css']
})
export class ModalCrudResponsablesPreComponent implements OnInit {

  public formRegistroResponsable: FormGroup;
  lstResponsablePreinversion: any[] = [];
  lstTipoColegiatura: any[] = [];
  tipoArchivo: number = tipoArchivo.administradorProyectoPreinversion;
  id_seguimientoMonitoreoPreinversion: number = 0;
  id_tipo_responsable: number;
  cod_responsable: string;
  documentoDesignacion: string = '';
  cambiarEditar: boolean = false;
  itemsPerPage: number = 5;
  totalRegistros: number = 0;
  UltimaActualizacion: string = '';
  @Output() retornoValores = new EventEmitter();

  constructor(
    private bsModal: BsModalRef,
    private fb: FormBuilder,
    private responsableSvc: ResponsablesPreinversionService,
    private facadeSvc: FacadeService,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.createForm();
    this.listarResponsableCombo();
    this.listarResponsableEstudio(1);
  }

  createForm() {
    this.formRegistroResponsable = this.fb.group({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_responsable: 0,
      id_tipo_responsable: this.id_tipo_responsable,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
      detalle: this.fb.array([this.createDetalleResponsable()]),
      email: this.fb.array([this.createEmail()]),
      numero_telefonico: this.fb.array([this.createTelefono()]),
    });
  }

  listarResponsableCombo() {
    this.responsableSvc.listarResponsableComboPreInv().subscribe((data: any) => {
      if (data != null) {
        this.lstTipoColegiatura = data.tipo_colegiatura;
      }
    });
  }

  listarResponsableEstudio(pagina: number) {
    const param = {
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      cod_tipo_responsable: this.cod_responsable,
      limit: this.itemsPerPage,
      offset: (pagina - 1) * this.itemsPerPage
    };

    this.responsableSvc.listarResponsablePreinversion(param).subscribe((data: any) => {
      // data = JSON.parse(data);
      this.totalRegistros = data.cantidad;
      if (this.totalRegistros > 0) {
        this.lstResponsablePreinversion = data.responsable;
      } else {
        this.lstResponsablePreinversion = [];
      }
    });
  }

  editarResponsable(responsable: any) {
    this.formRegistroResponsable.patchValue(responsable);
    this.detalle.at(0).patchValue({
      id_detalle_responsable: responsable.id_detalle_responsable,
      dni_responsable: responsable.dni_responsable,
      apellidos: `${responsable.ape_pat_responsable} ${responsable.ape_mat_responsable}`,
      ape_pat_responsable: responsable.ape_pat_responsable,
      ape_mat_responsable: responsable.ape_mat_responsable,
      nombre_responsable: responsable.nombre_responsable,
      id_tipo_colegiatura: responsable.id_tipo_colegiatura,
      nro_colegiatura: responsable.nro_colegiatura,
      fecha_designacion: (responsable.fecha_designacion != null) ? new Date(responsable.fecha_designacion) : null,
      documento_nombramiento: responsable.documento_nombramiento,
    });
    this.documentoDesignacion = responsable.documento_nombramiento;
    this.cambiarEditar = true;
  }

  registrarResponsablePreinversion() {
    const paramEnvio = { ...{}, ...this.formRegistroResponsable.value };
    if (this.cambiarEditar) {
      // registrar edicion
      this.responsableSvc.modificarResponsablePreinversion(paramEnvio).subscribe((data: any) => {
        if (data != null) {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('actualizar', ''), true);
            this.listarResponsableEstudio(1);
            this.retornoValores.emit();
            this.limpiarForm();
            this.cambiarEditar = false;
          }
        }
      });

    } else {
      // registrar nuevo responsable
      this.responsableSvc.insertarResponsablePreinversion(paramEnvio).subscribe(
        (data: any) => {
          if (data != null) {
            if (data.resultado == 1) {
              this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
              this.listarResponsableEstudio(1);
              this.retornoValores.emit();
              this.limpiarForm();
            }
          }
        }
      );
    }
  }

  anularResponsable(idResponsable) {
    const param = { id_responsable: idResponsable, usuario_eliminacion: this.usuario };
    this.funciones.alertaRetorno('question', '¿Está seguro que desea eliminar este registro?', '', true, (rpta) => {
      if (rpta.value) {
        this.responsableSvc.anularResponsablePreinversion(param).subscribe((data: any) => {
          if (data.resultado == 1) {
            this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('eliminacion', ''), true);
            this.listarResponsableEstudio(1);
            this.retornoValores.emit();
          }
        });
      }
    });
  }

  get f(): any { return this.formRegistroResponsable.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  validarDNI() {
    const valDni = this.detalle.at(0).get('dni_responsable').value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.detalle.at(0).patchValue({
        apellidos: null,
        ape_pat_responsable: null,
        ape_mat_responsable: null,
        nombre_responsable: null,
      });
    }
  }

  validarInformacionReniec() {
    const valDni = this.detalle.at(0).get('dni_responsable').value;
    if (valDni == '' || valDni == null) {
      // document.getElementById('dni_responsable').focus();
      this.funciones.mensaje('info', 'Debe ingresar el N° de Dni.');
    } else {
      this.facadeSvc.dataExternaService.consultarInformacionReniec(valDni).subscribe((data: any) => {
        if (data.strnombres == '') {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        } else {
          this.detalle.at(0).patchValue({
            ape_pat_responsable: data.strapellidopaterno,
            ape_mat_responsable: data.strapellidomaterno,
            apellidos: `${data.strapellidopaterno} ${data.strapellidomaterno}`,
            nombre_responsable: data.strnombres,
          });
        }
      },
        (error: any) => {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        }
      );
    }
  }

  get detalle(): FormArray { return this.f.detalle as FormArray; }

  get numeroTelefonico(): FormArray { return this.f.numero_telefonico as FormArray; }

  get emails(): FormArray { return this.f.email as FormArray; }

  fileChangeEvent(event: any) {
    if (event.uploaded != null) {
      this.documentoDesignacion = event.uploaded._body;
      this.detalle.at(0).patchValue({
        documento_nombramiento: this.documentoDesignacion
      });
    }
  }

  createDetalleResponsable(): FormGroup {
    return this.fb.group({
      id_detalle_responsable: 0,
      dni_responsable: [null, Validators.required],
      apellidos: null,
      ape_pat_responsable: null,
      ape_mat_responsable: null,
      nombre_responsable: null,
      id_tipo_colegiatura: [null, Validators.required],
      nro_colegiatura: [null, Validators.required],
      fecha_designacion: [null, Validators.required],
      documento_nombramiento: null,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
    });
  }

  createEmail(): FormGroup {
    return this.fb.group({
      id_email: 0,
      email: [null, Validators.email],
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
    });
  }

  createTelefono(): FormGroup {
    return this.fb.group({
      id_telefono: 0,
      nro_telefono: null,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
    });
  }

  limpiarForm() {
    this.formRegistroResponsable.reset();
    this.documentoDesignacion = '';
    this.formRegistroResponsable.patchValue({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      id_responsable: 0,
      id_tipo_responsable: this.id_tipo_responsable,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario,
      detalle: [{
        id_detalle_responsable: 0,
        usuario_creacion: this.usuario,
        usuario_modificacion: this.usuario,
      }],
      email: [{
        id_email: 0,
        usuario_creacion: this.usuario,
        usuario_modificacion: this.usuario,
      }],
      numero_telefonico: [{
        id_telefono: 0,
        usuario_creacion: this.usuario,
        usuario_modificacion: this.usuario,
      }]
    });
  }

  cambiarPagina(page) {
    const paginaActual = page.page;
    this.listarResponsableEstudio(paginaActual);
  }

  closeModal() {
    this.bsModal.hide();
  }
}
