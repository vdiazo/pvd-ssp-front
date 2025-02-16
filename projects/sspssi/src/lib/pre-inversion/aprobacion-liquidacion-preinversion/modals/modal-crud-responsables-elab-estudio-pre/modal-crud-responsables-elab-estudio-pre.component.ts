import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { isNullOrUndefined, isUndefined } from 'util';
import { Functions } from 'projects/sspssi/src/appSettings';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { ResponsablesElaboracionPreinversionService } from 'projects/sspssi/src/servicios/preinversion/aprobacion-liquidacion/responsables-elaboracion-preinversion.service';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';

@Component({
  selector: 'ssi-modal-crud-responsables-elab-estudio-pre',
  templateUrl: './modal-crud-responsables-elab-estudio-pre.component.html',
  styleUrls: ['./modal-crud-responsables-elab-estudio-pre.component.css']
})
export class ModalCrudResponsablesElabEstudioPreComponent implements OnInit {

  formRegistroResponsableElaboracion: FormGroup;
  id_seguimientoMonitoreoPreinversion: number = 0;
  lstTipoFuncionResponsable: any[] = [];
  otraDescripcion: boolean = false;
  cambiarEditar: boolean = false;
  @Output() retornoValores = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private facadeSvc: FacadeService, private responsableElaboracionSvc: ResponsablesElaboracionPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarResponsableElaboracionCombo();
  }

  createForm() {
    this.formRegistroResponsableElaboracion = this.fb.group({
      id_responsable_elaboracion: 0,
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion,
      nro_dni: [null, Validators.required],
      apellido_paterno: null,
      apellido_materno: null,
      apellidos: null,
      nombres: null,
      foto: null,
      id_funcion: [null, Validators.required],
      otra_descripcion_funcion: null,
      email: this.fb.array([this.createEmail()]),
      telefono: this.fb.array([this.createTelefono()]),
    });
  }

  listarResponsableElaboracionCombo() {
    this.responsableElaboracionSvc.listarResponsableElaboracionEstudioComboPreinversion().subscribe((data: any) => {
      this.lstTipoFuncionResponsable = data.funcion;
    });
  }

  validarDNI() {
    const valDni = this.f.nro_dni.value;
    if (!isNullOrUndefined(valDni) && valDni.length == 8) {
      this.validarInformacionReniec();
    } else {
      this.formRegistroResponsableElaboracion.patchValue({
        apellido_paterno: null,
        apellido_materno: null,
        nombre_responsable: null,
        foto: null,
      });
    }
  }

  registrarResponsableElaboracion() {
    const paramEnvio = { ...{}, ...this.formRegistroResponsableElaboracion.value };
    paramEnvio.usuario_creacion = this.usuario;
    this.responsableElaboracionSvc.insertarResponsableElaboracionEstudioPreinversion(paramEnvio).subscribe((data: any) => {
      if (data.resultado == 1) {
        this.retornoValores.emit();
        this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
        this.limpiarForm();
      }
    });
  }

  validarInformacionReniec() {
    const valDni = this.f.nro_dni.value;
    if (valDni == '' || valDni == null) {
      // document.getElementById('dni_responsable').focus();
      this.funciones.mensaje('info', 'Debe ingresar el N° de Dni.');
    } else {
      this.facadeSvc.dataExternaService.consultarInformacionReniec(valDni).subscribe((data: any) => {
        if (data.strnombres == '') {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        } else {
          this.formRegistroResponsableElaboracion.patchValue({
            apellido_paterno: data.strapellidopaterno,
            apellido_materno: data.strapellidomaterno,
            apellidos: `${data.strapellidopaterno} ${data.strapellidomaterno}`,
            nombres: data.strnombres,
            foto: data.strfoto,
          });
        }
      },
        (error: any) => {
          this.funciones.alertaSimple('info', '', 'No se encontró información para el número de <b>DNI</b> ingresado', true);
        }
      );
    }
  }

  createEmail(): FormGroup {
    return this.fb.group({
      id_email: 0,
      id_responsable_elaboracion: 0,
      email: [null, Validators.email],
    });
  }

  createTelefono(): FormGroup {
    return this.fb.group({
      id_telefono: 0,
      id_responsable_elaboracion: 0,
      telefono: null,
    });
  }

  agregarTelefono() {
    this.telefono.push(this.createTelefono());
  }

  removerTelefono(index: number) {
    this.telefono.removeAt(index);
  }

  agregarEmail() {
    this.email.push(this.createEmail());
  }

  removerEmail(index: number) {
    this.email.removeAt(index);
  }

  funcionSeleccionado(event: any) {
    if (!isUndefined(event)) {
      if (event.cod_funcion == 'CE099') {
        this.otraDescripcion = true;
      } else {
        this.otraDescripcion = false;
      }
    } else {
      this.otraDescripcion = false;
    }
  }

  get f(): any { return this.formRegistroResponsableElaboracion.controls; }

  get telefono(): FormArray { return this.f.telefono as FormArray; }

  get email(): FormArray { return this.f.email as FormArray; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  limpiarForm() {
    this.formRegistroResponsableElaboracion.reset();
    this.formRegistroResponsableElaboracion.patchValue({
      id_seguimiento: this.id_seguimientoMonitoreoPreinversion
    });
  }
  closeModal() {
    this.bsModal.hide();
  }

}
