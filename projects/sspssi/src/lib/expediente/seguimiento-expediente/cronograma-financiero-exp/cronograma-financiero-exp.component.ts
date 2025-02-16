import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
import { ModalCrudPrograFinancieraExpComponent } from './modal/modal-crud-progra-financiera-exp/modal-crud-progra-financiera-exp.component';
import { PlanillonService } from 'projects/sspssi/src/servicios/planillon/planillon.service';

@Component({
  selector: 'ssi-cronograma-financiero-exp',
  templateUrl: './cronograma-financiero-exp.component.html',
  styleUrls: ['./cronograma-financiero-exp.component.css']
})
export class CronogramaFinancieroExpComponent implements OnInit {

  listaCronogramasBD: any = [];
  @Input() idSeguimientoMonitoreoExpediente: number;
  @Input() bEstado: boolean;
  bsModal: BsModalRef;
  UltimaActualizacion: string = '';
  editarFila: boolean = false;
  codigoEditar: number = 0;
  numPaginasMostrar: number = 5;
  totalRegistros: number = 0;

  constructor(private cronogramaFinancieroSvc: PlanillonService, private modalSvc: BsModalService, public funciones: Functions) { }

  ngOnInit() {
    this.listarProgramacionFinanciera(1);
  }

  listarProgramacionFinanciera(paginaActual: number) {
    let ipInput = {
      id_seguimiento_monitoreo: this.idSeguimientoMonitoreoExpediente,
      skip: this.numPaginasMostrar,
      take: (paginaActual - 1) * 10
    };
    this.cronogramaFinancieroSvc.listarProgracionFinancieraExpTecnico(ipInput).subscribe(
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
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        entidadEditar: null,
      }
    };

    this.bsModal = this.modalSvc.show(ModalCrudPrograFinancieraExpComponent, config);
    this.bsModal.content.retornoValoresCronograma.subscribe(
      (rpta) => {
        if (rpta > 0) {
          this.listarProgramacionFinanciera(1);
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
        id_seguimientoMonitoreoExpediente: this.idSeguimientoMonitoreoExpediente,
        bEstado: this.bEstado,
        entidadEditar: item,
      }
    };

    this.bsModal = this.modalSvc.show(ModalCrudPrograFinancieraExpComponent, config);
    this.bsModal.content.retornoValoresCronograma.subscribe(
      (rpta) => {
        if (rpta > 0) {
          this.listarProgramacionFinanciera(1);
        }
      }
    );
  }

  eliminarCronograma(item) {
    let paramEnvio = { id_programacion_financiera_expediente: item.id_programacion_financiera_expediente, usuario_eliminacion: this.getUsuario() };
    this.funciones.alertaRetorno('question', '¿Está seguro de eliminar el Cronograma?', '', true, (respuesta) => {
      if (respuesta.value) {
        this.cronogramaFinancieroSvc.anularProgramacionFinancieraExpTecnico(paramEnvio).subscribe(
          data => {
            if (data > 0) {
              this.listarProgramacionFinanciera(1);
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
