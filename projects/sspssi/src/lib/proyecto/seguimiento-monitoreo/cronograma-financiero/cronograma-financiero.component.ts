import { Component, OnInit, Input } from '@angular/core';
import { ModalCrudProgramacionFinancieraComponent } from './modal/modal-crud-programacion-financiera/modal-crud-programacion-financiera.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { PlanillonService } from 'projects/sspssi/src/servicios/planillon/planillon.service';

@Component({
  selector: 'ssi-cronograma-financiero',
  templateUrl: './cronograma-financiero.component.html',
  styleUrls: ['./cronograma-financiero.component.css']
})
export class CronogramaFinancieroComponent implements OnInit {

  listaCronogramasBD: any = [];
  @Input() idSeguimientoMonitoreoObra: number;
  @Input() bEstado: boolean;
  bsModal: BsModalRef;
  UltimaActualizacion: string = '';
  editarFila: boolean = false;
  codigoEditar: number = 0;
  numPaginasMostrar: number = 5;
  totalRegistros: number = 0;

  constructor(private cronogramaFinancieroSvc: PlanillonService, private modalSvc: BsModalService, public funciones: Functions) { }

  ngOnInit() {
    this.listarCronogramaFinanciero(1);
  }

  listarCronogramaFinanciero(paginaActual: number) {
    let ipInput = {
      id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra,
      skip: this.numPaginasMostrar,
      take: (paginaActual - 1) * 10
    };
    this.cronogramaFinancieroSvc.listarProgramacionFinancieraObra(ipInput).subscribe(
      data => {
        let temp = data;
        this.totalRegistros = temp.cantidad_registro;
        if (this.totalRegistros > 0) {
          this.listaCronogramasBD = temp.programacion_financiera;
        }
        else {
          this.listaCronogramasBD = [];
        }
      }
    );
  }
  nuevoRegistroCronograma() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-cronograma',
      initialState: {
        bEstado: this.bEstado,
        idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        entidadEditar: null
      }
    };

    this.bsModal = this.modalSvc.show(ModalCrudProgramacionFinancieraComponent, config);
    this.bsModal.content.retornoValoresCronograma.subscribe(
      data => {
        if (data > 0) {
          this.listarCronogramaFinanciero(1);
        }
      }
    );
  }

  verDetalleCronograma(codigo: number) {
    if (codigo == this.codigoEditar) {
      this.codigoEditar = 0;
    } else {
      this.codigoEditar = codigo;
    }
  }

  editarCronograma(item) {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-cronograma',
      initialState: {
        bEstado: this.bEstado,
        idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
        entidadEditar: item
      }
    };

    this.bsModal = this.modalSvc.show(ModalCrudProgramacionFinancieraComponent, config);

    this.bsModal.content.retornoValoresCronograma.subscribe(
      data => {
        if (data > 0) {
          this.listarCronogramaFinanciero(1);
        }
      }
    );
  }

  eliminarCronograma(item) {
    let paramEnvio = { id_programacion_financiera: item.id_programacion_financiera, usuario_eliminacion: this.getUsuario() };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el Cronograma?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.cronogramaFinancieroSvc.anularProgramacionFinancieraObra(paramEnvio).subscribe(
          data => {
            if (data > 0) {
              this.listarCronogramaFinanciero(1);
            }
          }
        );
      }
    })
  }

  cambiarPagina(page) {

  }

  getUsuario(): string {
    return sessionStorage.getItem('Usuario');
  }
}
