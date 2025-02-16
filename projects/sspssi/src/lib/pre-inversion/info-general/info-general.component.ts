import { Component, OnInit } from '@angular/core';
import { InfoGeneralProyecto } from 'projects/sspssi/src/models/response/info-general-proyecto';
import { InfoGeneralProyectoService } from 'projects/sspssi/src/servicios/info-general-proyecto.service';
import { WsConsultaPrincipalService } from 'projects/sspssi/src/servicios/ws-consulta-principal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.css']
})
export class InfoGeneralComponent implements OnInit {

  respuesta: any;
  Proyecto: {
    cod_snip: number;
    cod_unificado: number;
    id_proyecto: number;
    nombre_proyecto: string;
    nombre_municipalidad: string;
    Region: string;
    Provincia: string;
    Distrito: string;
  };
  UnidadEjecutora: any;
  EntidadInfoProyecto: InfoGeneralProyecto;
  idProyecto: number;
  idTramo: number;
  separator = '';
  constructor(private infoGeneralSvc: InfoGeneralProyectoService, private ssWS: WsConsultaPrincipalService, private route: ActivatedRoute) {
    this.Proyecto = {
      cod_snip: 0,
      cod_unificado: 0,
      id_proyecto: 0,
      nombre_proyecto: '',
      nombre_municipalidad: '',
      Region: '',
      Provincia: '',
      Distrito: ''
    };
  }

  ngOnInit() {
    this.idProyecto = this.route.snapshot.params.idProyecto;
    this.idTramo = this.route.snapshot.params.idTramo;

    this.EntidadInfoProyecto = new InfoGeneralProyecto();
    setTimeout(() => {
      this.mostrarInformacion(this.idProyecto, this.idTramo);
    }, 500);
  }

  mostrarInformacion(idProyecto: number, idTramo: number) {
    this.ssWS.getProyecto(idProyecto, idTramo).subscribe(
      data => {
        this.Proyecto = data[0] as any;
      }
    )
  }
}
