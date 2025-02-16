import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AsociacionExpresionInteresComponent } from "./asociacion-expresion-interes/asociacion-expresion-interes.component";
import { ContratacionObraComponent } from './contratacion-obra/contratacion-obra.component';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';


@Component({
  selector: 'ssi-proceso-seleccion',
  templateUrl: './proceso-seleccion.component.html',
  styleUrls: ['./proceso-seleccion.component.css']
})
export class ProcesoSeleccionComponent implements OnInit {
  idSeguimientoMonitoreo: number;
  snip: number;
  idFase: string;
  separator = "";
  bsModalAsociacionProceso: BsModalRef;
  config;
  @ViewChild('Obra') Obra: ContratacionObraComponent;
  @ViewChild('BienesServicios') BienesServicios: ContratacionBienesServiciosComponent;
  @ViewChild('Consultoria') Consultoria: ContratacionConsultoriaComponent;

  constructor(private route: ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit() {
    this.snip = this.route.snapshot.params.snip;
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
    this.idFase = this.route.snapshot.params.idFase;
  }

  AbrirModalVincularProceso() {
    this.config = {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        intIdFase: Number(this.idFase)
      }
    };
    this.bsModalAsociacionProceso = this.modalService.show(AsociacionExpresionInteresComponent, this.config);
    this.bsModalAsociacionProceso.content.EventInsertar.subscribe(
      (data: number) => {
        if (data == 1) {
          this.Obra.busqueda(1);
        }
        if (data == 2) {
          this.BienesServicios.busqueda(1);
        }
        if (data == 3) {
          this.Consultoria.busqueda(1);
        }
      }
    );
  }

}
