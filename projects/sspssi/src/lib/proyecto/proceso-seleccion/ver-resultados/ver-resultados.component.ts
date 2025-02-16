import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProcesoSeleccionService } from '../../../../servicios/proceso-seleccion.service';
import { ProcesoSeleccionBienesServiciosRequest } from '../../../../models/request/proceso-seleccion-bs-request';
import { ProcesoSeleccionResultado } from '../../../../models/response/proceso-seleccion-resultado';
import { WsConsultaPrincipalService } from '../../../../servicios/ws-consulta-principal.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
//  import { BsModalService } from '../../../../../node_modules/ngx-bootstrap/modal/bs-modal.service';
import { ModalGarantiasComponent } from './modal-garantias/modal-garantias.component';
import { Functions } from '../../../../appSettings/functions';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Contratista } from 'projects/sspssi/src/models/response/contratista';

defineLocale('es', deLocale);

@Component({
  selector: 'ssi-ver-resultados',
  templateUrl: './ver-resultados.component.html',
  styleUrls: ['./ver-resultados.component.css']
})
export class VerResultadosComponent implements OnInit {
  idSeguimientoMonitoreo;
  modelVerResultados;
  nom_muni;
  procesoSeleccionRequest: ProcesoSeleccionBienesServiciosRequest;
  bsModalRef: BsModalRef;
  listEmpresasConsorciadas;
  listGarantias = [];
  listGarantiasInsertadas = [];
  listGarantiasMerge = [];
  beResultados;
  mostrarResultados;
  nombreProyecto: string = '';
  Proyecto: {
    cod_snip: number,
    cod_unificado: number,
    id_proyecto: number,
    nombre_proyecto: string
  };
  totalRegistros: number;
  totalRegistrosGarantia: number;
  paginaActiva: number = 0;
  paginaActivaGarantia: number = 0;
  numero_Pagina: number = 0;
  numero_Pagina_Garantia: number = 0;
  num_filas: number = 5;
  verConvocado: boolean = false;
  verAdjudicado: boolean = false;
  verConsentido: boolean = false;
  verContratado: boolean = false;
  verLabelNullsFecha: boolean = true;
  tempNomMuni: string = '';
  nomemclaturaProc: string = '';
  urlGarantia: string = '';

  contratistaRegistrar: Contratista;
  ListDetalleContratista = [];

  constructor(public modalRef: BsModalRef, private servicio: ProcesoSeleccionService, private ssWS: WsConsultaPrincipalService, private modalService: BsModalService, public funciones: Functions) { }

  ngOnInit() {
    this.procesoSeleccionRequest = new ProcesoSeleccionBienesServiciosRequest();
    this.procesoSeleccionRequest.snip = this.modelVerResultados.snip;
    this.procesoSeleccionRequest.identificador = this.modelVerResultados.identificador;
    this.procesoSeleccionRequest.tipo = this.modelVerResultados.tipo;
    this.nomemclaturaProc = this.modelVerResultados.nomenclatura;
    this.procesoSeleccionRequest.codigo_unificado = parseInt(sessionStorage.getItem("CodUnificado"));
    this.ssWS.getProyecto(this.modelVerResultados.id_proyecto, this.modelVerResultados.idTramo).subscribe(
      respuesta => {
        this.Proyecto = respuesta[0] as any;
        this.nombreProyecto = this.Proyecto.nombre_proyecto;
      }
    );

    if (this.modelVerResultados.nombre_municipalidad == '') {
      this.modelVerResultados.nombre_municipalidad = this.nom_muni;
      this.tempNomMuni = "limpiar";
    }

    this.beResultados = new ProcesoSeleccionResultado();
    this.mostrarResultados = new ProcesoSeleccionResultado();
    this.verGarantias(this.procesoSeleccionRequest, this.num_filas, this.numero_Pagina);
    this.ocultarInformacion();
    this.setearIdSeguimiento();

  }

  ocultarInformacion() {
    if (this.modelVerResultados.estado_proceso.toUpperCase() == "CONVOCADO") {
    } else if (this.modelVerResultados.estado_proceso.toUpperCase() == "ADJUDICADO") {
      this.verAdjudicado = true;
    } else if (this.modelVerResultados.estado_proceso.toUpperCase() == "CONSENTIDO") {
      this.verConsentido = true;
      this.verAdjudicado = true;
    } else if (this.modelVerResultados.estado_proceso.toUpperCase() == "CONTRATADO") {
      this.verContratado = true;
      this.verConsentido = true;
    } else {
      this.verConsentido = false;
      this.verAdjudicado = true;
      this.verLabelNullsFecha = false;
    }
  }

  setearIdSeguimiento(): any {
    if (sessionStorage.getItem("idSeguimiento") == null) {
      this.idSeguimientoMonitoreo = 0;
    } else {
      this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento"));
    }
  }

  verGarantias(pProcesoSeleccionRequest: ProcesoSeleccionBienesServiciosRequest, num_filas, numero_Pagina) {
    this.servicio.verResultado(pProcesoSeleccionRequest).subscribe(
      respuesta => {
        if (respuesta != '') {
          this.beResultados = respuesta as any;
          this.mostrarResultados = this.beResultados;
          this.listEmpresasConsorciadas = JSON.parse(this.beResultados.miembros);
          this.listGarantias = JSON.parse(this.beResultados.garantia);
        } else {
          this.beResultados = {};
          this.listEmpresasConsorciadas = [];
          this.listGarantias = [];
        }
        if (this.listGarantias != null) {
          this.totalRegistrosGarantia = this.listGarantias.length;
        } else {
          this.totalRegistrosGarantia = 0;
        }
        if (this.listEmpresasConsorciadas != null) {
          this.totalRegistros = this.listEmpresasConsorciadas.length;
        } else {
          this.totalRegistros = 0;
        }
        if (this.totalRegistrosGarantia > 0) {
          this.urlGarantia = this.listGarantias[0].url;
        }
        // this.listEmpresasConsorciadas = this.paginar(this.beResultados.miembros, numero_Pagina, num_filas, this.totalRegistros);
        // this.consultaGarantiasInsertadas(this.Proyecto.id_proyecto, this.listGarantias);
      });
  }

  verPaginacionGarantias(pProcesoSeleccionRequest: ProcesoSeleccionBienesServiciosRequest, num_filas, numero_Pagina) {
    this.servicio.verResultado(pProcesoSeleccionRequest).subscribe(
      respuesta => {
        if (respuesta != '' || respuesta != null) {
          this.beResultados = respuesta as any;
          this.listGarantias = this.beResultados.garantia;
        } else {
          this.beResultados = {};
          this.listGarantias = [];
        }
        this.totalRegistrosGarantia = this.listGarantias.length;
        this.consultaGarantiasInsertadas(this.Proyecto.id_proyecto, this.listGarantias);
      });
  }

  consultaGarantiasInsertadas(pIdProyecto, pListGarantias) {
    this.servicio.listarGarantia(pIdProyecto).subscribe(
      respuesta => {
        this.listGarantiasInsertadas = respuesta as any;
        this.mergeGarantias(pListGarantias, this.listGarantiasInsertadas)
      });
  }

  mergeGarantias(pListGarantias, pListGarantiasInsertadas) {
    this.listGarantiasMerge = [];
    let cont: number = 0;
    if (pListGarantias != null && pListGarantias != '' && pListGarantiasInsertadas != null && pListGarantiasInsertadas != '') {
      for (let i = 0; i < pListGarantias.length; i++) {
        for (let j = 0; j < pListGarantiasInsertadas.length; j++) {
          if (pListGarantias[i].numero_garantia == pListGarantiasInsertadas[j].numero_garantia) {
            this.listGarantiasMerge.push({
              id_proyecto: pListGarantiasInsertadas[j].id_proyecto,
              id_garantia: pListGarantiasInsertadas[j].id_garantia,
              numero_garantia: pListGarantiasInsertadas[j].numero_garantia,
              fecha_inicio: pListGarantiasInsertadas[j].fecha_inicio,
              fecha_termino: pListGarantiasInsertadas[j].fecha_termino,
              monto_garantia: this.funciones.format(this.funciones.setearValorDecimal(pListGarantiasInsertadas[j].monto_garantia.toString())),
              url: pListGarantias[i].url,
            });
            break;
          } else {
            if (j == pListGarantiasInsertadas.length - 1) {
              this.listGarantiasMerge.push({
                id_proyecto: this.Proyecto.id_proyecto,
                id_garantia: 0,
                numero_garantia: pListGarantias[i].numero_garantia,
                fecha_inicio: '',
                fecha_termino: '',
                monto_garantia: '',
                url: pListGarantias[i].url,
              });
              break;
            }
          }
        }
      }
    } else {
      if (pListGarantias != null) {
        for (let i = 0; i < pListGarantias.length; i++) {
          this.listGarantiasMerge.push({
            id_proyecto: this.Proyecto.id_proyecto,
            id_garantia: 0,
            numero_garantia: pListGarantias[i].numero_garantia,
            fecha_inicio: '',
            fecha_termino: '',
            monto_garantia: '',
            url: pListGarantias[i].url,
          });
        }
      }
    }
    this.listGarantiasMerge = this.paginar(this.listGarantiasMerge, this.numero_Pagina_Garantia, this.num_filas, this.totalRegistrosGarantia);
  }

  closeModal() {
    if (this.tempNomMuni == 'limpiar') {
      this.modelVerResultados.nombre_municipalidad = '';
    }
    this.modalRef.hide();
  }

  paginar(lista: any, numPagina: number, numfila: number, total: number) {
    let listFor = [];
    for (let i = numPagina; i < numPagina + numfila; i++) {
      if (i < total) {
        listFor.push(lista[i]);
      } else {
        i = numPagina + numfila;
      }
    };
    return listFor as any;
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.num_filas);
    this.numero_Pagina = this.paginaActiva;
    this.verGarantias(this.procesoSeleccionRequest, this.num_filas, this.numero_Pagina);
  }

  cambiarPaginaGarantia(pagina) {
    this.paginaActivaGarantia = ((pagina.page - 1) * this.num_filas);
    this.numero_Pagina_Garantia = this.paginaActivaGarantia;
    this.verPaginacionGarantias(this.procesoSeleccionRequest, this.num_filas, this.numero_Pagina_Garantia);
  }

  config;
  editarGarantia(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelGarantia: model
      }
    };

    this.bsModalRef = this.modalService.show(ModalGarantiasComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.consultaGarantiasInsertadas(this.Proyecto.id_proyecto, this.listGarantias);
      }
    )
  }
}
