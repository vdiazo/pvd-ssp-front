import { Component, OnInit, Pipe } from '@angular/core';
import { MaestraService } from '../../services/maestra.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Functions } from '../../appSettings/functions';
import { Settings } from '../../appSettings/settings';
import * as $ from 'jquery';
import * as L from 'leaflet';
import { TramoGeograficoService } from '../../services/tramo-geografico.service';
import { LinkNubeService } from 'src/app/services/link-nube.service';

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.css']
})
export class ModalPDFComponent implements OnInit {

  constructor(public modalRef: BsModalRef, private svcMAestra: MaestraService, public funciones: Functions, private svcTramo: TramoGeograficoService, private LinkNubeService:LinkNubeService) { }
  idTramo: number;
  entidadAyuda: any = {};
  fecha: Date = new Date();
  actual: any;
  ListaFinanciera: any;
  ArregloFinanciera: any = [];
  ruta_mapa: string = "";
  monto_total: number;
  respuesta: any;
  isOpen: boolean = false;
  //rutaLogo: string = Settings.RUTA_LOGO + "assets/img/logo_pvd.png";
  rutaLogo: string = "";
  
  imprimir(pdf) {
    pdf.saveAs('Ayuda_Memoria_' + this.actual + '.pdf');
  }

  ExportToWord() {
    
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head>" +
    "<meta charset='utf-8'>" +
    "<title>Export HTML To Doc</title>" +
    "</head><body>";
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById("contentToConvert").innerHTML + postHtml;
    var blob = new Blob(['\ufeff', html], {
      type: "application/msword"
    })

    
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    let filename = 'Ayuda_Memoria_' + this.actual + '.doc'

    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
    }

    document.body.removeChild(downloadLink);
  }

  ngOnInit() {
    this.actual = this.fecha.getDate() + "/" + (this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear();
    
    this.svcMAestra.listarLogoPVD().subscribe((data:any)=>{
      this.rutaLogo=data;
    });
    if(this.entidadAyuda.fotos!=null){
      this.entidadAyuda.fotos.forEach((ele:any)=>{

        this.LinkNubeService.VisualizarArchivo(ele.nombre_archivo,ele.ruta).subscribe((data:any)=>{
          ele.ruta_real=data;
        // this.imagenes$.next(1);
        });

        // this.clientes.push(cliente);
        // this.clientes$.next(this.clientes);
      });
    }

  }

  ListarAyuda() {
    this.svcMAestra.AyudaMemoria(this.idTramo)
    .subscribe(
      data => {
        this.entidadAyuda = data;
        this.ListaFinanciera = this.entidadAyuda.fuente_financiera;
        this.ListaFinanciera.forEach(element => {
          if (element.anio == this.fecha.getFullYear()) {
            this.ArregloFinanciera.push(element);
          }
        });
      }
    )
  }
  closeModal() {
    this.modalRef.hide();
  }
  VerEnMapa() {
    var map = L.map('map').setView([-12.047511, -77.056026], 13);
    var InfoGeneral = { descripcion_infraestructura: '', nombre_intervencion: '', snip: '', tipo_administracion: '', };
    var $PVN_PALETA_VIAS = { 0: '#ffffff', 1: '#f44336', 2: '#607D8B', 3: '#00BCD4', 4: '#795548', 9: '#3f51b5', 11: '#9c27b0' };
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    var myStyle = { "color": "red", "opacity": 1, "weight": 5 };
    this.svcTramo.TramoGeofraficoGEOJSON(this.idTramo).subscribe(
      data => {
        this.respuesta = data;
        var layer = L.geoJSON(this.respuesta, { onEachFeature: this.onEachFeatureClosure(this.respuesta.features[0].properties) }).addTo(map);
        map.fitBounds(layer.getBounds());
      }
    );
  }

  onEachFeatureClosure(obj) {
    return function onEachFeature(feature, layer) {
      if (feature.properties) {
        var html = '<div>' + obj.nombre_tramo + '</div>';
        html = html + '<div><b>' + obj.nombre_camino + '</b></div>';
        layer.bindPopup(html);//.openPopup();
      }
    }
  }
}

