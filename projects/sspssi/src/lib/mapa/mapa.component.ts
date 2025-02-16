import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TramoGeograficoService } from '../../servicios/tramo-geografico.service';
import { Settings } from '../../appSettings/settings';

/* @Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} */

@Component({
  selector: 'ssi-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  // options;
  // layersControl;
  idProyecto: any;
  idTramo: any;
  entidadGeografica: any;

  ruta_mapa: string = "";

  constructor(public modalRef: BsModalRef, private svcPuntos: TramoGeograficoService) { }
  ngOnInit() {
    setTimeout(() => {
      this.VerEnMapa();
    }, 500);
  }

  closeModal() {
    this.modalRef.hide();
  }
  VerEnMapa() {
    let n = new Date().getTime();
    this.ruta_mapa = './mapaEjeDir.html?v=' + n + '&idTramo=' + this.idTramo + '&url_api=' + Settings.API_ENDPOINT;
  }
}
