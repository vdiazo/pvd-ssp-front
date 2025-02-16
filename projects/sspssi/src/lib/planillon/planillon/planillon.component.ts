import { PlanillonService } from './../../../servicios/planillon/planillon.service';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ssi-planillon',
  templateUrl: './planillon.component.html',
  styleUrls: ['./planillon.component.css']
})
export class PlanillonComponent implements OnInit {

  formBusquedaPlanillon: FormGroup;
  arrProyectosSeleccionados: any[] = [];
  listAnio: any = [
    { codanio: '2020', anio: '2020' },
    { codanio: '2019', anio: '2019' }
  ];

  listProgramaPvd: any = [];
  listFases: any = [];
  listProyectos: any = [];
  num_filas: number = 10;
  totalfilasPorPagina: number = 150;
  paginaActiva: number = 1;
  totalRegistros: number = 0;
  proyectoSeleccionado: number = 0;
  mostrarDetalle: boolean = true;


  constructor(private fb: FormBuilder, private facadeSvc: FacadeService, private planillonSvc: PlanillonService) { }

  ngOnInit() {
    this.createForm();
    this.buscarProyecto();
    this.listarProgramas();
  }

  createForm() {
    this.formBusquedaPlanillon = this.fb.group({
      cod_snip: null,
      codmes: null,
      codanio: null,
      id_programa: null,
      id_tipo_fase: null
    });
  }

  buscarProyecto() {
    let paramEnvio = { ...{}, ...this.formBusquedaPlanillon.value };
    paramEnvio.cod_snip = paramEnvio.cod_snip == null ? 0 : parseInt(paramEnvio.cod_snip, 10);
    paramEnvio.codanio = paramEnvio.codanio == null ? 2020 : parseInt(paramEnvio.codanio, 10);
    paramEnvio.id_programa = paramEnvio.id_programa == null ? 0 : parseInt(paramEnvio.id_programa, 10);
    this.listadoPrincipal(paramEnvio);
  }

  listadoPrincipal(pBusqueda: any) {
    let param = {
      cod_snip: pBusqueda.cod_snip,
      nombre_proyecto: '',
      anio_eje: pBusqueda.codanio,
      id_programa: pBusqueda.id_programa,
      id_usuario: parseInt(sessionStorage.getItem('IdUsuario'), 10),
      id_perfil: parseInt(sessionStorage.getItem('Id_Perfil'), 10),
      limit: this.num_filas,
      offset: (this.paginaActiva - 1) * 10
    };
    this.planillonSvc.listarProyectoPlanillonGeneral(param).subscribe(
      data => {
        let dataReturn;
        dataReturn = data as any;
        this.totalRegistros = dataReturn.cantidad;
        this.listProyectos = dataReturn.detalle_planillon;
      }
    );
  }

  listarProgramas() {
    forkJoin(
      this.facadeSvc.convenioService.ListarPrograma(),
      this.facadeSvc.maestraService.listarTipoFases()
    ).subscribe(
      (data: any) => {
        this.listProgramaPvd = data[0];
        this.listFases = data[1];
      }
    )
  }

  exportarReportePlanillon() {

  }

  limpiarControles() {
    this.formBusquedaPlanillon.reset();
    this.buscarProyecto();
  }

  cambiarPagina(pagina) {
    this.paginaActiva = pagina.page;
    const paramEnvio = { ...{}, ...this.formBusquedaPlanillon.value };
    paramEnvio.cod_snip = paramEnvio.cod_snip == null ? 0 : parseInt(paramEnvio.cod_snip, 10);
    paramEnvio.codanio = paramEnvio.codanio == null ? 2020 : parseInt(paramEnvio.codanio, 10);
    paramEnvio.id_programa = paramEnvio.id_programa == null ? 0 : parseInt(paramEnvio.id_programa, 10);
    paramEnvio.codanio = paramEnvio.codanio == null ? 2020 : parseInt(paramEnvio.codanio, 10);

    this.listadoPrincipal(paramEnvio);
  }

  mostrarFila(idProyectoSeleccionado, idProyecto) {
    if (idProyectoSeleccionado == idProyecto) {
      return true;
    } else {
      return false;
    }
  }

  verDetalle(item) {
    let arrayResponse = [];
    if (item.isopen) {
      item.isopen = false;
    } else {
      item.isopen = true;
      item.arrComponenteProyecto = [];
      let ipInput = { cod_snip: item.codigo_unico, anio: (this.formBusquedaPlanillon.get('codanio').value == null ? 2020 : this.formBusquedaPlanillon.get('codanio').value) };
      this.planillonSvc.listarDetalleComponenteProyecto(ipInput).subscribe(
        data => {
          arrayResponse = data;
          if (arrayResponse.length > 0) {
            item.arrComponenteProyecto = arrayResponse;
          }
        }
      );
    }
  }
}
