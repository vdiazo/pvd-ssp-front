import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Headers, Response } from '@angular/http';
import { InfoGeneralProyecto } from '../../models/InfoGeneralProyecto';
import { Settings } from '../../appSettings/settings';
import { InfoGeneralProyectoExpTecService } from '../services/info-general-proyecto-exp-tec.service';
import { Proyecto } from '../../models/proyecto';

@Component({
  selector: 'set-info-general-proyecto-exp-tec',
  templateUrl: './info-general-proyecto-exp-tec.component.html',
  styleUrls: ['./info-general-proyecto-exp-tec.component.css']
})
export class InfoGeneralProyectoExpTecComponent implements OnInit {
  public beProyecto: Proyecto = new Proyecto();

  token: string;
  idTramo: number;

  InfoGeneral: any;
  General: any;

  EntidadInfoProyecto: InfoGeneralProyecto;
  idProyecto: any;

  separator = "";

  //constructor(private myHttp: HttpClient) { }

  constructor(private InfoGeneralService: InfoGeneralProyectoExpTecService) { }




  ngOnInit() {
    // this.EntidadInfoProyecto = new InfoGeneralProyecto();
    this.EntidadInfoProyecto = new InfoGeneralProyecto();
    this.beProyecto.id_municipalidad = parseInt(sessionStorage.getItem("IdMunicipalidad"));
    this.beProyecto.cod_depa = sessionStorage.getItem("Coddepa");
    this.beProyecto.nombre_perfil = sessionStorage.getItem("Nombre_Perfil");
    this.beProyecto.id_zona = parseInt(sessionStorage.getItem("IdZona"));
    this.beProyecto.id_usuario = parseInt(sessionStorage.getItem("IdUsuario"));
    this.beProyecto.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil"));
    this.beProyecto.nombre_municipalidad = sessionStorage.getItem("Municipalidad");
    this.idProyecto = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")); //datosProyectoExpTec
    this.mostrarInformacionProyecto();
    setTimeout(() => {
    }, 500);

  }

  mostrarInformacionProyecto() {
    this.InfoGeneralService.ListarInfoProyectoExpTecnico(parseInt(sessionStorage.getItem("CodUnificado"))).subscribe(
      data2 => {
        this.InfoGeneral = data2;
        this.EntidadInfoProyecto = this.InfoGeneral;
      }
    )
  }

}
