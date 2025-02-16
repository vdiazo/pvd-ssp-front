import { Component, OnInit, Input } from '@angular/core';
import { AccionSeguimientoMonitoreo } from '../../../models/response/seguimiento-monitoreo-accion';
import { SeguimientoMonitoreo } from '../../../models/response/seguimiento-monitoreo';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalRegistrarComponent } from './modal-valorizaciones/modal-registrar.component';
import { FacadeService } from '../../../patterns/facade.service';
import { IAccionSeguimientoMonitoreo, IAccionSegMonitoreo } from '../../../Interfaces';
import { MaestraService } from '../../../services/maestra.service';
import { Functions } from '../../../appSettings';
import { GaleriaComponent } from './galeria/galeria.component';
import { InfoObrasValorizacionesComponent } from './info-obras-valorizaciones/info-obras-valorizaciones.component';
import { ModalInformeContraloriaComponent } from './modal-informe-contraloria/modal-informe-contraloria.component';

@Component({
  selector: 'app-valorizaciones',
  templateUrl: './valorizaciones.component.html',
  styleUrls: ['./valorizaciones.component.css']
})
export class ValorizacionesComponent implements OnInit {

  // bValorizacion: boolean = false;
  entidad: AccionSeguimientoMonitoreo;
  config;
  id_seguimientoMonitoreoObra: number;
  model: SeguimientoMonitoreo;
  bsModalRef: BsModalRef;
  paginaActiva: number = 0;
  paginaActual: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  totalRegistros: number;
  UltimaActualizacionInfObra: string = "";
  UltimaActualizacionValorizacion: string = "";
  montoTotalFisicoReal: number;
  montoTotalFisicoProgramado: number;
  montoTotalFinancieroReal: number;
  montoTotalFinancieroProgramado: number;
  montoTotal: number;
  listAccionSeguimientoMonitoreo: IAccionSegMonitoreo[];
  totalAccionSeguimientoMonitoreo: number = 0;
  @Input() idSeguimientoMonitoreoObra;
  @Input() snip;
  seguimientoMonitoreo;
  fecha_inicio_contractual: Date;
  fecha_termino_contractual_temporal: Date;
  guid: string = "";
  @Input() bEstado:boolean;

  // has_seguimientoMonitoreoObra: boolean = false;

  constructor(private modalService: BsModalService, private fs: FacadeService, private sMant: MaestraService, public funciones: Functions) { }

  ngOnInit() {
    // if (this.idSeguimientoMonitoreoObra == 0) {//set valor del seguimiento
    //   this.idSeguimientoMonitoreoObra = parseInt(sessionStorage.getItem("idSeguimiento"));
    // }
    if(sessionStorage.getItem("esSuspension")=="false"){
      if (this.idSeguimientoMonitoreoObra != 0) {
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.obtenerFechaContractual(this.idSeguimientoMonitoreoObra);
      }
    }
    

    //Datos Auditoria
    this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
    this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
  }

  obtenerFechaContractual(idSegMonitoreo) {
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, this.bEstado).subscribe(
      respuesta => {
        this.seguimientoMonitoreo = respuesta as any;

        if (this.seguimientoMonitoreo == '{ "data":[{}]}') {
        }
        else {
          this.model = new SeguimientoMonitoreo();
          if(this.seguimientoMonitoreo[0].fecha_inicio_contractual!=null){
            this.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(this.seguimientoMonitoreo[0].fecha_inicio_contractual);
          }
        }
      }
    )
  }

  openModalAccSeguimientoObra() {
    this.entidad = new AccionSeguimientoMonitoreo();
    this.entidad.id_accion_seguimiento_monitoreo_obra = 0;
    this.entidad.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
    this.entidad.id_presupuesto_adicional_obra = 0;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        seguimientoMonitoreoAccion: this.entidad, fecha_inicio_contractual: this.model.fecha_inicio_contractual
      },
      class: "modal-standar-md"
    };

    this.bsModalRef = this.modalService.show(ModalRegistrarComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria("Valorizaciones");
      }
    )
  }


  openModalInfoObras() {
    /*this.entidad = new AccionSeguimientoMonitoreo();
    this.entidad.id_accion_seguimiento_monitoreo_obra = 0;
    this.entidad.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
    this.entidad.id_presupuesto_adicional_obra = 0;*/
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        snip: this.snip
      },
      class: "modal-standar-md"
    };

    this.bsModalRef = this.modalService.show(InfoObrasValorizacionesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria("Valorizaciones");
      }
    )
  }

  // openModalInformesContraloria(){
  //   this.config = {
  //     ignoreBackdropClick: true,
  //     keyboard: false,
  //     initialState: {
  //       seguimientoMonitoreoAccion: this.entidad, fecha_inicio_contractual: this.model.fecha_inicio_contractual
  //     },
  //     class: "modal-standar-md"
  //   };

  //   this.bsModalRef = this.modalService.show(ModalInformeContraloriaComponent, this.config);
  //   this.bsModalRef.content.retornoValores.subscribe(
  //     () => {
  //       this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  //       this.consultaAuditoria("Valorizaciones");
  //     }
  //   )
  // }

  listarAccionSeguimientoMonitoreoObra(id: number, skip: number, take: number) {

    this.fs.valorizacionService.listarValorizaciones(id, skip, take).subscribe(
      (respuesta: IAccionSeguimientoMonitoreo) => {

        //respuesta.accion_seguimiento.sort(this.ordernarFecha);

        let cantidad = respuesta.cantidad_registro - (this.paginaActiva * 5);

        respuesta.accion_seguimiento.map(
          (item) => {
            item.indice = cantidad;
            cantidad = cantidad - 1;
          }
        )

        this.setearMontosValorizaciones(respuesta);
      }
    )
  };

  consultaAuditoria(pNombreTipoAuditoria) {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == "InformacionObra") {
          this.UltimaActualizacionInfObra = this.obtenerDatosAuditoria("InformacionObra");
        } else if (pNombreTipoAuditoria == "Valorizaciones") {
          this.UltimaActualizacionValorizacion = this.obtenerDatosAuditoria("Valorizaciones");
        } else if (pNombreTipoAuditoria == "Paralizacion") {
          //this.UltimaActualizacionParalizacion = this.obtenerDatosAuditoria("Paralizacion");
        }
      }
    );
  }

  private setearMontosValorizaciones(respuesta: IAccionSeguimientoMonitoreo) {
    this.montoTotalFisicoReal = 0;
    this.montoTotalFisicoProgramado = 0;
    this.montoTotalFinancieroReal = 0;
    this.montoTotalFinancieroProgramado = 0;
    this.montoTotal = 0;
    if (respuesta.cantidad_registro == 0) {
      this.listAccionSeguimientoMonitoreo = [];
    }
    else {
      this.totalAccionSeguimientoMonitoreo = respuesta.cantidad_registro;
      this.listAccionSeguimientoMonitoreo = respuesta.accion_seguimiento;
      this.listAccionSeguimientoMonitoreo.forEach(element => {
        element.fecha_valorizacion = this.funciones.formatDate(element.fecha_valorizacion);
      });
      if (respuesta.total_accion_seguimiento != null) {
        this.montoTotalFisicoReal = respuesta.total_accion_seguimiento.avance_fisico_real;
        this.montoTotalFisicoProgramado = respuesta.total_accion_seguimiento.avance_fisico_programado;
        this.montoTotalFinancieroReal = respuesta.total_accion_seguimiento.avance_financiero_real;
        this.montoTotalFinancieroProgramado = respuesta.total_accion_seguimiento.avance_financiero_programado;
        this.montoTotal = respuesta.total_accion_seguimiento.monto;
      }
    }
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return " " + (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        return "";
      }
    }
    //Fin
  }

  verImagenesValorizacion(row) {
    let lista_archivos = row.lista_archivos;
    this.config = {
      ignoreBackdropClick: false,
      keyboard: false,
      initialState: {
        listaImagenes: lista_archivos
      }
    };

    this.bsModalRef = this.modalService.show(GaleriaComponent, this.config);
  }

  editarAccionSeguimientoObra(model: IAccionSegMonitoreo) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        seguimientoMonitoreoAccion: model
      }
    };

    this.bsModalRef = this.modalService.show(ModalRegistrarComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
        this.consultaAuditoria("Valorizaciones");
      }
    )
  }

  eliminarAccionSeguimientoMonitoreo(model) {
    model.usuario_eliminacion = sessionStorage.getItem("Usuario");

    let strData = { id_accion_seguimiento_monitoreo_obra: model.id_accion_seguimiento_monitoreo_obra, usuario_eliminacion: model.usuario_eliminacion }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el Avance de Obra?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.valorizacionService.eliminarValorizacion(strData).subscribe(
          () => {
            this.listarAccionSeguimientoMonitoreoObra(model.id_seguimiento_monitoreo_obra, this.num_filas, this.numero_Pagina);
            this.consultaAuditoria("Valorizaciones");
          }
        );
      }
    });
  }

  cambiarPaginaAccionSeguimiento(pagina) {
    this.paginaActiva = pagina.page - 1;
    this.paginaActual = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActual;

    this.listarAccionSeguimientoMonitoreoObra(this.idSeguimientoMonitoreoObra, this.num_filas, this.numero_Pagina);
  };
}