import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transferencia } from '../../../../models/response/transferencia';
import { TransferenciaService } from '../../../../lib/services/transferencia.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalMontoTransferidoComponent } from './modal-monto-transferido/modal-monto-transferido.component';

@Component({
  selector: 'set-monto-transferido',
  templateUrl: './monto-transferido.component.html',
  styleUrls: ['./monto-transferido.component.css']
})
export class MontoTransferidoComponent implements OnInit {
  idTramo: number;
  idFase: number;
  idMunicipalidad: number;
  listTransferencia: Transferencia;
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  montoTotal: number;
  model: Transferencia;
  bsModalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private servicio: TransferenciaService, private modalService: BsModalService) { };

  ngOnInit() {
    //this.idTramo = parseInt(this.route.snapshot.params.idTramo);
    //this.idMunicipalidad = parseInt(this.route.snapshot.params.idMunicipalidad);
    this.idTramo=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTramo);

    this.idFase=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);


    this.idMunicipalidad=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idMunicipalidad);
    this.listarTransferencia(this.idFase, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }

  listarTransferencia(idFase, idMunicipalidad, numFilas, numPagina) {
    this.servicio.listarTransferenciaXidTramoXidMunicipalidad(idFase, idMunicipalidad, numFilas, numPagina).subscribe(
      respuesta => {
        let rptaTransferencia = respuesta as any;
        this.listTransferencia = rptaTransferencia.data;
        this.montoTotal = rptaTransferencia.monto_total;
        this.totalRegistros = rptaTransferencia.cantidad_registro;
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarTransferencia(this.idFase, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
  }

  config;
  openModalDetalleTransferencia(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        model: model, idTramo: this.idTramo, idMunicipalidad: this.idMunicipalidad
      }
    };

    this.bsModalRef = this.modalService.show(ModalMontoTransferidoComponent, this.config);
    this.bsModalRef.content.retornoTransferencia.subscribe(
      () => {
        this.listarTransferencia(this.idFase, this.idMunicipalidad, this.num_filas, this.numero_Pagina);
      }
    );
  }
}
