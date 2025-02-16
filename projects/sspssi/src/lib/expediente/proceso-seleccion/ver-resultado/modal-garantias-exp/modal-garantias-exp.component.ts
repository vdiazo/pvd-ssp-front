import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Garantia } from 'projects/sspssi/src/models/response/garantia';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ProcesoSeleccionService } from 'projects/sspssi/src/servicios/proceso-seleccion.service';

@Component({
  selector: 'ssi-modal-garantias-exp',
  templateUrl: './modal-garantias-exp.component.html',
  styleUrls: ['./modal-garantias-exp.component.css']
})
export class ModalGarantiasExpComponent implements OnInit {

  modelGarantia;
  model: Garantia;

  constructor(public modalRef: BsModalRef, public funciones: Functions, private servicio: ProcesoSeleccionService) { }

  ngOnInit() {
    this.editarGarantia();
  }

  @Output() retornoValores = new EventEmitter();

  editarGarantia() {
    this.model = new Garantia();
    this.model.id_proyecto = this.modelGarantia.id_proyecto;
    this.model.id_garantia = this.modelGarantia.id_garantia;
    this.model.numero_garantia = this.modelGarantia.numero_garantia;
    if (this.modelGarantia.fecha_inicio != "") {
      this.model.fecha_inicio = this.funciones.ConvertStringtoDate(this.modelGarantia.fecha_inicio);
    } else {
      this.model.fecha_inicio = "";
    }
    if (this.modelGarantia.fecha_termino != "") {
      this.model.fecha_termino = this.funciones.ConvertStringtoDate(this.modelGarantia.fecha_termino);
    } else {
      this.model.fecha_termino = "";
    }
    this.model.monto_garantia = this.funciones.format(this.funciones.setearValorDecimal(this.modelGarantia.monto_garantia.toString()));
    //this.model.monto_garantia_texto = this.modelGarantia.monto_garantia;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.model.usuario_creacion = sessionStorage.getItem("Usuario");
  }

  administrarGarantia(model) {
    //registrar
    if (model.fecha_inicio > model.fecha_termino) {
      this.funciones.mensaje("info", "La fecha de inicio no puede ser mayor a la fecha de término.");
    } else {
      model.monto_garantia = Number.parseFloat(this.model.monto_garantia.toString().replace(/,/g, ""));
      this.servicio.actualizarGarantia(model).subscribe(
        respuesta => {
          this.retornoValores.emit(respuesta);
          this.modalRef.hide();
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
        }
      );
    }
  }

  closeModal() {
    this.modalRef.hide();
  }
}
