import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SeguimientoMonitoreo } from '../../../../models/response/seguimiento-monitoreo';

@Component({
  selector: 'set-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.css']
})
export class ModalHistorialComponent implements OnInit {

  idSeguimientoMonitoreo: number;
  idFase: number;
  idTramo: number;
  separator = "";
  guid: string = "";
  isOpen = true;
  //variables externos
  id_seguimientoMonitoreoObra = true;
  fecha_inicio_contractual: Date;
  model: SeguimientoMonitoreo;
  @Output() emitResolucionContrato = new EventEmitter();

  constructor(public modalRef: BsModalRef, private route: ActivatedRoute) {
    this.model = new SeguimientoMonitoreo();
  }

  ngOnInit() {
  }

  closeModal() {
    this.emitResolucionContrato.emit();
    this.modalRef.hide();
  }
}
