import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Transferencia } from '../../../../../models/response/transferencia';
import { Funciones } from '../../../../../appSettings/funciones';
import { TransferenciaService } from '../../../../services/transferencia.service';
import { tipoArchivo } from '../../../../../appSettings/enumeraciones';

@Component({
  selector: 'app-modal-monto-transferido',
  templateUrl: './modal-monto-transferido.component.html',
  styleUrls: ['./modal-monto-transferido.component.css']
})
export class ModalMontoTransferidoComponent implements OnInit {

  model: Transferencia;
  modelTransferencia: Transferencia;
  nombreArchivo: string = null;
  IdTipoArchivo = tipoArchivo.transferido;
  @Output() retornoTransferencia = new EventEmitter();

  constructor(private modal: BsModalRef, private funciones: Funciones, private servicio: TransferenciaService) {
  }

  ngOnInit() {
    this.modelTransferencia = Object.assign({}, this.model)
    this.modelTransferencia.fecha_publicacion = this.funciones.formatDate(this.model.fecha_publicacion);
    this.modelTransferencia.fecha_incorporacion = this.model.fecha_incorporacion != null ? this.funciones.formatDate(this.model.fecha_incorporacion) : '';
    this.modelTransferencia.monto = this.model.monto != null ?  this.funciones.numberWithCommas(this.model.monto):'';
    this.modelTransferencia.monto_incorporacion = this.model.monto_incorporacion != null ? this.funciones.numberWithCommas(this.model.monto_incorporacion):'';
  }

  closeModal() {
    this.modal.hide();
  }

  modificarTransferencia(model) {
    model.nombre_archivo = this.nombreArchivo == null ? model.archivo_transferencia : this.nombreArchivo;
    // let transferencia = {
    //   id_transferencia: model.id_transferencia,
    //   nombre_archivo: model.nombre_archivo,
    //   usuario_modificacion: sessionStorage.getItem("Usuario")
    // }

    let transferencia = {
      id_transferencia_convenio: model.id_transferencia_convenio,
      nombre_archivo: model.nombre_archivo,
      usuario_modificacion: sessionStorage.getItem("Usuario")
    }

    this.servicio.registrarArchivoTransferencia(transferencia).subscribe(
      respuesta => {
        if (respuesta > 0) {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
          this.retornoTransferencia.emit();
        } else {
          this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
        }
      }
    )
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }
}
