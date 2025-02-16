import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FacadeService } from 'src/app/patterns/facade.service';
import { Functions } from 'src/app/appSettings/functions';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css']
})
export class ModalCreateComponent implements OnInit {
  formGroup: FormGroup;
  idSeguimientoMonitoreoObra: number;
  idFase: number;
  perfil: string
  listaTipoDocumento = [];
  listaAccionesSeguimiento = [];
  nombreArchivo: string = "";
  tipoArchivo: number = tipoArchivo.accionSeguimientoMonitoreo;
  @Output() retornoValores = new EventEmitter();
  bMostrar: boolean = false;

  constructor(private fb: FormBuilder,
    public funciones: Functions,
    private fs: FacadeService,
    public modalRef: BsModalRef) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra,
      id_acciones_seguimiento_pvd: 0,
      fecha: '',
      descripcion: '',
      id_tipo_documento: 0,
      nombre_archivo: '',
      id_fase: this.idFase,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      perfil: this.perfil
    })

    this.listarControlSeleccion();
  }

  listarControlSeleccion() {
    this.fs.maestraService.listarTipoDocumento().subscribe(
      data => {
        this.listaTipoDocumento = data as any[];
      }
    );

    this.fs.accionSeguimientoMonitoreoService.listarAccionesSeguimiento().subscribe(
      data => {
        this.listaAccionesSeguimiento = data as any[];
      }
    );
  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
      this.formGroup.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }

  save() {
    this.bMostrar = true;
    if (this.validarControles(this.formGroup)) {
      this.fs.accionSeguimientoMonitoreoService.registar(this.formGroup.value).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.retornoValores.emit(true);
            this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      )
    }
    else {
      this.bMostrar = false;
    }
  }

  validarControles(datosFormulario: FormGroup) {
    try {
      let BreakException = {
        controles: 'Ingrese todos los campos con (*)',
      };

      if (datosFormulario.get("id_acciones_seguimiento_pvd").value == 0) throw BreakException.controles;
      if (datosFormulario.get("fecha").value == "") throw BreakException.controles;
      if (datosFormulario.get("descripcion").value == "") throw BreakException.controles;
      if (datosFormulario.get("id_tipo_documento").value == 0) throw BreakException.controles;
      if (datosFormulario.get("nombre_archivo").value == "") throw BreakException.controles;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  closeModal() {
    this.modalRef.hide();
  }
}