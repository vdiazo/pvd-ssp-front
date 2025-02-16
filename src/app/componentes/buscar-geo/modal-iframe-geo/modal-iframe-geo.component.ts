import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { BsModalRef } from '../../../../../node_modules/ngx-bootstrap/modal';
import { Settings } from '../../../appSettings';

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) { }
//   transform(url) {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }

@Component({
  selector: 'app-modal-iframe-geo',
  templateUrl: './modal-iframe-geo.component.html',
  styleUrls: ['./modal-iframe-geo.component.css']
})
export class ModalIframeGeoComponent implements OnInit {

  idGeoTramo:any;
  entidadGeografica:any;
  ruta_mapa:string="";
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {    
    setTimeout(() => {
       this.VerEnMapa();
    }, 500);
  }

  closeModal() {
    this.modalRef.hide();
  }
  VerEnMapa(){
    let n=new Date().getTime();
    this.ruta_mapa='./GeoMapa.html?v='+n+'&idGeoTramo='+this.idGeoTramo+'&url_api='+Settings.API_ENDPOINT;
  }
}
