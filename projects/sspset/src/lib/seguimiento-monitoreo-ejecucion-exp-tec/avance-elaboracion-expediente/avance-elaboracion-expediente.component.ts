import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../appSettings/funciones';
import { FacadeService } from '../../patterns/facade.service';
import { ModalAvanceEntregableComponent } from '../avance-elaboracion-expediente/modal-avance-entregable/modal-avance-entregable.component';
import { ModalUpdateAvanceEntregableComponent } from '../avance-elaboracion-expediente/modal-update-avance-entregable/modal-update-avance-entregable.component';

@Component({
  selector: 'set-avance-elaboracion-expediente',
  templateUrl: './avance-elaboracion-expediente.component.html',
  styleUrls: ['./avance-elaboracion-expediente.component.css']
})
export class AvanceElaboracionExpedienteComponent implements OnInit {

  listaAvanceEntregablesBD;
  @Input() idSeguimientoMonitoreoObra: number
  @Input() guid: string
  @Input() fecha_inicio_contractual: Date;


  codigoEditar: number = 0;
  bsModalRef: BsModalRef;
  @Input() bEstado: boolean;
  editarFila:boolean=false;

  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 5;
  porcentajeAcumulado:number=0;

  montoTotalAvance:number=0;

  constructor(
    public funciones: Funciones,
    private fs: FacadeService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.listarAvanceEntregables(this.numero_Pagina,this.numPaginasMostrar);
  }

  nuevoRegistroAvanceEntregable(){
    const initialState = {
      lista: this.listaAvanceEntregablesBD,
      sumatoriaMontoAvanceEntregable:this.montoTotalAvance,
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      fecha_inicio_contractual: this.fecha_inicio_contractual
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-entregable',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalAvanceEntregableComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAvanceEntregables(this.numero_Pagina, this.numPaginasMostrar);
      }
    )
  }
  listarAvanceEntregables(numeroPagina: number, nroFilas: number) {
    this.fs.avanceEntregableExpTecService.listarAvanceEntregable(this.idSeguimientoMonitoreoObra, numeroPagina, nroFilas)
      .subscribe(
        data => {
          let lista = data as any;
          /*let monto=0;
          for(let i=0;i<data.avance.length;i++){
            monto=monto+data.avance[i].monto_pagado;
          }*/
          this.montoTotalAvance=data.monto_pagado;



          let cantidad = lista.cantidad;
          this.porcentajeAcumulado = lista.porcentaje;
          this.totalRegistros = cantidad;
          if (cantidad == 0) {
            this.listaAvanceEntregablesBD = [];
          }
          else {
            this.listaAvanceEntregablesBD = lista.avance ;//as Entregable[]
          }
        });
  }

  editarFilaAvanceEntregable(avanceEntregable){
    let avanceEntregableCopy = Object.assign({}, avanceEntregable);

    const initialState = {
      AvanceEntregableEditar: avanceEntregableCopy,
      sumatoriaMontoAvanceEntregable:this.montoTotalAvance,
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      fecha_inicio_contractual: this.fecha_inicio_contractual
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-cronograma',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalUpdateAvanceEntregableComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data) => {
        this.listarAvanceEntregables(this.numero_Pagina, this.numPaginasMostrar);
        //this.consultaAuditoria();
      }
    )
  }

  eliminarFilaAvanceEntregable(avanceEntregable){
    avanceEntregable.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el avance del entregable?", "", true, (respuesta) => {
      if (respuesta.value) {
        let param={
          id_avance_entregable:avanceEntregable.id_avance_entregable,
          usuario_eliminacion:sessionStorage.getItem("Usuario")
        }
        this.fs.avanceEntregableExpTecService.anularAvanceEntregable(param).subscribe(
          () => {
            this.listarAvanceEntregables(this.numero_Pagina, this.numPaginasMostrar);
            //this.consultaAuditoria();
          }
        )
      }
    });

  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarAvanceEntregables(this.numero_Pagina, this.numPaginasMostrar);
  }

}
