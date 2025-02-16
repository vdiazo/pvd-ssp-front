import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Settings } from 'projects/sspssi/src/appSettings/settings';

@Component({
  selector: 'ssi-modal-ver-geo',
  templateUrl: './modal-ver-geo.component.html',
  styleUrls: ['./modal-ver-geo.component.css']
})
export class ModalVerGeoComponent implements OnInit {

  idGeoTramo: any;
  entidadGeografica: any;
  ruta_mapa = '';
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.verEnMapa();
    }, 500);
  }

  verEnMapa() {
    let n = new Date().getTime();
    this.ruta_mapa = './GeoMapaEjeDir.html?v=' + n + '&idGeoTramo=' + this.idGeoTramo + '&url_api=' + Settings.API_ENDPOINT;
  }

  closeModal() {
    this.modalRef.hide();
  }
}
