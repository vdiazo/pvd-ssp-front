import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeductivoReduccion } from '../../../../models/response/deductivo-reduccion';
import { FacadeService } from '../../../../patterns/facade.service';
import { Functions } from '../../../../appSettings/functions';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import * as $ from 'jquery';

@Component({
  selector: 'app-modal-deductivos-reducciones',
  templateUrl: './modal-deductivos-reducciones.component.html',
  styleUrls: ['./modal-deductivos-reducciones.component.css','../deductivos-reducciones.component.css']
})
export class ModalDeductivosReduccionesComponent implements OnInit {

  model: DeductivoReduccion;
  modelDeductivo: DeductivoReduccion;
  id_seguimientoMonitoreoObra: number;
  @Output() varEmitterDeductivo = new EventEmitter();
  IdTipoArchivo: number = tipoArchivo.DeductivoAdicionalObra;
  nombreArchivo: string = null;

  constructor(public modalRef: BsModalRef, private fs: FacadeService, public funciones: Functions) { }

  ngOnInit() {
    if (this.modelDeductivo == undefined) {
      this.setControles();
    } else {
      this.editarDeductivoReduccion(this.modelDeductivo);
    }
  }

  closeModal() {
    this.varEmitterDeductivo.emit(this.id_seguimientoMonitoreoObra);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new DeductivoReduccion();
    $('input[name="fileDeductivoReduccion"], #fileDeductivoReduccion').val("");
  }

  modificarDeductivoReduccion(model) {
    model.monto_presupuesto = this.castToFloat(model.monto_presupuesto)

    //actualizar
    if (model.id_deductivo_reduccion_obra != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      this.fs.deductivoReduccionService.actualizarDeductivoReduccion(model).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.closeModal();
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
        }
      );
      //registrar
    } else {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      model.id_seguimiento_monitoreo_obra = this.id_seguimientoMonitoreoObra;
      model.observacion == undefined ? model.observacion = "" : model.observacion;
      model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
      this.fs.deductivoReduccionService.registrarDeductivoReduccion(model).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.closeModal();
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
        }
      );
    }
  }

  castToFloat(monto: number | string): number {
    if (monto == 0 || monto == "") {
      return 0;
    }
    let valueWithReplace = monto.toString().replace(/,/g, "");
    let value = Number.parseFloat(valueWithReplace);
    return value;
  }

  editarDeductivoReduccion(modelDeductivo) {
    this.model = Object.assign({}, modelDeductivo);
    this.model.resolucion_fecha = this.funciones.ConvertStringtoDateDB(modelDeductivo.resolucion_fecha);
    $('input[name="fileDeductivoReduccion"]').val(modelDeductivo.nombre_archivo);
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }
}
