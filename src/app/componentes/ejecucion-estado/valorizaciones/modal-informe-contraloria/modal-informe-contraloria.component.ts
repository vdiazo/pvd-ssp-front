import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal-informe-contraloria',
  templateUrl: './modal-informe-contraloria.component.html',
  styleUrls: ['./modal-informe-contraloria.component.css']
})
export class ModalInformeContraloriaComponent implements OnInit {

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.modalRef.hide();
  }

}
