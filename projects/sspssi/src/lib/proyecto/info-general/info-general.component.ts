import { Component, OnInit } from '@angular/core';
import { InfoGeneralProyecto } from '../../../models/response/info-general-proyecto';
import { ActivatedRoute } from '@angular/router';
import { InfoGeneralProyectoService } from '../../../servicios/info-general-proyecto.service';
import { InfoFinancieraService } from '../../../servicios/info-financiera.service';

@Component({
  selector: 'ssi-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.css']
})
export class InfoGeneralComponent implements OnInit {

  respuesta: any;
  CodSnip: any;
  UnidadEjecutora: any;
  EntidadInfoProyecto: InfoGeneralProyecto;
  idProyecto: any;
  separator = "";
  
  constructor(private svcInfoGeneral: InfoGeneralProyectoService, private route: ActivatedRoute, private svcFinanciera: InfoFinancieraService) { }

  ngOnInit() {
    this.EntidadInfoProyecto = new InfoGeneralProyecto();
    this.idProyecto = sessionStorage.getItem("CodUnificado");
    setTimeout(() => {
      this.MostrarInformacion();
    }, 500);
  }

  MostrarInformacion() {
    this.idProyecto = sessionStorage.getItem("CodUnificado");
    this.svcInfoGeneral.ListarInfoProyecto(this.idProyecto).subscribe(
      data => {
        this.respuesta = data;
        this.EntidadInfoProyecto = this.respuesta;
      }
    )
  }
}
