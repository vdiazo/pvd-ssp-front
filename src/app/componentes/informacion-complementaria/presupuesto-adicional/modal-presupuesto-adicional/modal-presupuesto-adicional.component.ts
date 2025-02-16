import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacadeService } from '../../../../patterns/facade.service';
import { Functions } from '../../../../appSettings/functions';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-presupuesto-adicional',
  templateUrl: './modal-presupuesto-adicional.component.html',
  styleUrls: ['./modal-presupuesto-adicional.component.css']
})
export class ModalPresupuestoAdicionalComponent implements OnInit {
  formGroup: FormGroup
  tipoArchivo: number = tipoArchivo.PresupuestoAdicionalObra
  nombreArchivo: string = ""
  entidad: any
  id_seguimiento_monitoreo_obra: number
  @Output() retornoValores = new EventEmitter();
  titulo: string = "Nuevo Presupuesto Adicional"
  subtitulo: string = "Registro de un nuevo presupuesto adicional"

  constructor(private fs: FacadeService,
    private fb: FormBuilder,
    public funciones: Functions,
    private modalRef: BsModalRef
  ) { }

  ngOnInit() {
    if (this.entidad == null) {
      this.construirFormulario();
    } else {
      this.editarFormulario();
    }
  }

  construirFormulario(): void {
    this.formGroup = this.fb.group({
      id_presupuesto_adicional_obra: 0,
      id_seguimiento_monitoreo_obra: this.id_seguimiento_monitoreo_obra,
      monto_presupuesto: '',
      resolucion_aprobacion: '',
      resolucion_fecha: '',
      incidencia: '',
      concepto: '',
      observacion: '',
      nombre_archivo: '',
      adiciona_plazo: false,
      activo: true,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      fecha_creacion: new Date(),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      fecha_modificacion: new Date(),
      usuario_eliminacion: sessionStorage.getItem("Usuario"),
      fecha_eliminacion: new Date(),
    })
  }

  editarFormulario(): void {
    this.titulo = "Edición Presupuesto Adicional";
    this.subtitulo = "Edición de un presupuesto adicional";

    this.formGroup = this.fb.group({
      id_presupuesto_adicional_obra: this.entidad.id_presupuesto_adicional_obra,
      id_seguimiento_monitoreo_obra: this.entidad.id_seguimiento_monitoreo_obra,
      monto_presupuesto: this.entidad.monto_presupuesto,
      resolucion_aprobacion: this.entidad.resolucion_aprobacion,
      resolucion_fecha: this.funciones.formatDate(this.entidad.resolucion_fecha),
      incidencia: this.entidad.incidencia,
      concepto: this.entidad.concepto,
      observacion: this.entidad.observacion,
      nombre_archivo: (this.entidad.nombre_archivo == null ? '' : this.entidad.nombre_archivo),
      adiciona_plazo: this.entidad.adiciona_plazo,
      activo: true,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      fecha_creacion: new Date(),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      fecha_modificacion: new Date(),
      usuario_eliminacion: sessionStorage.getItem("Usuario"),
      fecha_eliminacion: new Date(),
    })

    this.nombreArchivo = this.formGroup.get("nombre_archivo").value;
  }

  fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
    }
  }

  grabar() {

    // if (!this.validarFormulario()) {
    //   return;
    // }

    this.formGroup.patchValue({
      nombre_archivo: this.nombreArchivo,
      monto_presupuesto: this.castToFloat(this.formGroup.get("monto_presupuesto").value)
    })

    if (this.entidad == null) {
      this.fs.presupuestoAdicionalService.grabar(this.formGroup.value).subscribe(
        data => {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          this.retornoValores.emit(true);
          this.modalRef.hide();
        }
      )
    } else {

      let fecha: string = this.formGroup.get("resolucion_fecha").value;
      let fechaValue: Date

      if (fecha.toString().length == 10) {
        fechaValue = this.funciones.ConvertStringtoDate(fecha)
      } else {

        fechaValue = this.funciones.ConvertStringtoDate(this.funciones.formatDate(fecha))
      }

      this.formGroup.patchValue({
        nombre_archivo: (this.nombreArchivo == '' ? this.formGroup.get("nombre_archivo").value : this.nombreArchivo),
        resolucion_fecha: fechaValue
      })
      this.fs.presupuestoAdicionalService.actualizar(this.formGroup.value).subscribe(
        data => {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
          this.retornoValores.emit(true);
          this.modalRef.hide();
        }
      )
    }
  }

  validarFormulario(): boolean {
    // let valorMontoPresupuesto = this.formGroup.get("monto_presupuesto").value;
    // let valorResolucion = this.formGroup.get("resolucion_aprobacion").value;
    // let valorFechaResolucion = this.formGroup.get("resolucion_fecha").value;
    // let incidencia = this.formGroup.get("incidencia").value;
    // let concepto = this.formGroup.get("concepto").value;
    
    // if ((valorMontoPresupuesto == "") || (valorResolucion == "") || (valorFechaResolucion == "") || (incidencia == "") || (concepto == "")) {
    //   this.funciones.mensaje("info", "Ingrese todos los campos con (*)");
    //   return false;
    // }

    return true;
  }

  castToFloat(monto: number | string): number {
    if (monto == 0 || monto == "") {
      return 0;
    }
    let valueWithReplace = monto.toString().replace(/,/g, "");
    let value = Number.parseFloat(valueWithReplace);
    return value;
  }

  cerrar() {
    this.modalRef.hide();
  }

}
