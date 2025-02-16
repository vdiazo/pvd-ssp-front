import { Component, OnInit } from '@angular/core';
import { InfoGeneralProyectoService } from '../../services/info-general-proyecto.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { InfoFinancieraService } from '../../services/info-financiera.service';
import { InfoGeneralProyecto } from '../../models/response/infro-general-proyecto';
import { MetasService } from 'src/app/services/metas.service';
@Component({
  selector: 'app-info-general-proyecto',
  templateUrl: './info-general-proyecto.component.html',
  styleUrls: ['./info-general-proyecto.component.css']
})
export class InfoGeneralProyectoComponent implements OnInit {
  respuesta: any;
  CodSnip: any;
  UnidadEjecutora: any;
  EntidadInfoProyecto: InfoGeneralProyecto;
  idProyecto: any;
  metas = [];
  constructor(private svcInfoGeneral: InfoGeneralProyectoService, private route: ActivatedRoute, private svcFinanciera: InfoFinancieraService,
    private servicioMetas: MetasService
  ) { }

  ngOnInit() {
    this.EntidadInfoProyecto = new InfoGeneralProyecto();
    setTimeout(() => {
      this.MostrarInformacion();
    }, 100);

  }

  MostrarInformacion() {
    this.idProyecto = parseInt(sessionStorage.getItem("CodUnificado"), 10);
    this.svcInfoGeneral.ListarInfoProyecto(this.idProyecto).subscribe(
      data => {
        this.respuesta = data;
        this.EntidadInfoProyecto = this.respuesta;
        this.UnidadEjecutora = sessionStorage.getItem("UnidadEjecutora");
      }
    );

    this.servicioMetas.listarMeta(this.route.snapshot.params.idProyecto, 100, 0).subscribe((data: any) => {
      this.metas = data.proyecto;
    });
  }
}
