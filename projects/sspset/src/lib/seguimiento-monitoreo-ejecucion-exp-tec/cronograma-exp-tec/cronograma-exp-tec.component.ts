import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Cronograma } from '../../../models/response/cronograma';
import { Funciones } from '../../../appSettings/funciones';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from '../../patterns/facade.service';
import { MaestraService } from '../../services/maestra.service';

import { ModalCronogramaComponent } from '../cronograma-exp-tec/modal-cronograma/modal-cronograma.component';
import { ModalUpdateCronogramaComponent } from '../cronograma-exp-tec/modal-update-cronograma/modal-update-cronograma.component';

@Component({
  selector: 'set-cronograma-exp-tec',
  templateUrl: './cronograma-exp-tec.component.html',
  styleUrls: ['./cronograma-exp-tec.component.css']
})
export class CronogramaExpTecComponent implements OnInit {

  UltimaActualizacion: string = "";
  @Input() idSeguimientoMonitoreoObra: number
  @Input() guid: string
  @Input() fecha_inicio_contractual: Date;
  listaCronogramasBD: Cronograma[];
  codigoEditar: number = 0;
  bsModalRef: BsModalRef;
  @Input() bEstado: boolean;
  editarFila:boolean=false;

  constructor(public funciones: Funciones,
    private fs: FacadeService,
    private modalService: BsModalService,
    private sMant: MaestraService) {

  }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "Cronograma");
      if (infoAuditoria != undefined) {
        this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        this.UltimaActualizacion = "";
      }
    } else {
      this.UltimaActualizacion = "";
    }
    //Fin
  }

  ngOnInit() {
    this.obtenerDatosAuditoria();
    this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.guid.isFirstChange()) {
      this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
    }
  }

  listarCronogramas(numeroPagina: number, nroFilas: number) {
    // this.fs.cronogramaExpTecService.listarCronogramasPorSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, numeroPagina, nroFilas)
    //   .subscribe(
    //     data => {
    //       let lista = data as any;
    //       let cantidad = lista.cantidad_registro;
    //       this.totalRegistros = cantidad;

    //       if (cantidad == 0) {
    //         this.listaCronogramasBD = [];
    //       }
    //       else {
    //         this.listaCronogramasBD = lista.actividad_ejecucion_expediente as Cronograma[]
    //       }
    //     });
  }

  nuevoRegistroCronograma() {
    const initialState = {
      lista: this.listaCronogramasBD,
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      fecha_inicio_contractual: this.fecha_inicio_contractual
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-cronograma',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalCronogramaComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
        //this.consultaAuditoria();
      }
    )
  }

  editarFilaCronograma(cronograma: Cronograma) {
    let cronogramaCopy = Object.assign({}, cronograma);

    const initialState = {
      Cronograma: cronogramaCopy,
      fecha_inicio_contractual: this.fecha_inicio_contractual
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-cronograma',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalUpdateCronogramaComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data) => {
        this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
        //this.consultaAuditoria();
      }
    )
  }

  eliminarFilaCronograma(cronograma: Cronograma) {
    cronograma.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Cronograma?", "", true, (respuesta) => {
      if (respuesta.value) {
        let param={
          id_actividad_ejecucion_expediente:cronograma.id_actividad_ejecucion_expediente,
          usuario_eliminacion:sessionStorage.getItem("Usuario")
        }
        this.fs.cronogramaExpTecService.removerCronograma(param).subscribe(
          () => {
            this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
            //this.consultaAuditoria();
          }
        )
      }
    });
  }

  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 5;

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarCronogramas(this.numero_Pagina, this.numPaginasMostrar);
  }

  verDetalleCronograma(codigo: number) {
    if (codigo == this.codigoEditar) {
      this.codigoEditar = 0;
    } else {
      this.codigoEditar = codigo;
    }
  }

 /* consultaAuditoria() {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }*/

}
