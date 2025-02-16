import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { AsociacionExpresionInteresComponent } from '../../proyecto/proceso-seleccion/asociacion-expresion-interes/asociacion-expresion-interes.component';
import { ContratacionBienesServiciosPreComponent } from './contratacion-bienes-servicios-pre/contratacion-bienes-servicios-pre.component';
import { ContratacionConsultoriaPreComponent } from './contratacion-consultoria-pre/contratacion-consultoria-pre.component';

@Component({
  selector: 'ssi-proceso-seleccion',
  templateUrl: './proceso-seleccion.component.html',
  styleUrls: ['./proceso-seleccion.component.css']
})
export class ProcesoSeleccionComponent implements OnInit {

  idFase: number = 0;
  idSeguimientoMonitoreo: number = 0;
  separator: string = '';
  bsModal: BsModalRef;
  @ViewChild('bienesServiciosPre') bienesServiciosPre: ContratacionBienesServiciosPreComponent;
  @ViewChild('consultoriaPre') consultoriaPre: ContratacionConsultoriaPreComponent;
  constructor(private route: ActivatedRoute, private modalSvc: BsModalService) { }

  ngOnInit() {
    this.idSeguimientoMonitoreo = this.route.snapshot.params.idSeguimientoMonitoreo;
    this.idFase = this.route.snapshot.params.idFase;
  }


  abrirModalVincularProceso() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        intIdFase: this.idFase
      }
    };
    this.bsModal = this.modalSvc.show(AsociacionExpresionInteresComponent, config);
    this.bsModal.content.EventInsertar.subscribe(
      (data: number) => {
        if (data == 2) {
          this.bienesServiciosPre.busqueda(1);
        }
        if (data == 3) {
          this.consultoriaPre.busqueda(1);
        }
      }
    );
  }
}
