import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Proyecto } from 'src/app/models/request/proyecto-request';
import { FacadeService } from 'src/app/patterns/facade.service';
import { FormControl } from '@angular/forms';
import { PerfilesService } from 'src/app/services/perfiles.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CrudMetasComponent } from './crud-metas/crud-metas.component';
import { MetasService } from 'src/app/services/metas.service';
import { Functions } from 'src/app/appSettings';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.css']
})
export class MetasComponent implements OnInit {
  beProyecto: Proyecto = new Proyecto();
  numPagina: number = 0;
  totalRegistrosPrincipal;
  paginaActiva: number = 0;

  unidadesEjecutoras;
  buscarProyecto: FormControl = new FormControl();
  buscarMunicipalidad: FormControl = new FormControl();
  buscarUnidadEjecutora: FormControl = new FormControl();
  proyects;
  lstTiposFase;
  numFases: number = 0;
  numColumnasDetalle: number = 0;
  listRegiones = [];
  estado_perfil: boolean = true;
  ListaProyecto={
    proyecto:[],
    cantidad_registro:0
  };
  ACCION:number=0;
  BsModalRef:BsModalRef;
  constructor(
    private fs:FacadeService,
    private svcPerfiles : PerfilesService,
    private BsModalService:BsModalService,
    private servicioMetas:MetasService,
    public funciones:Functions
  ) { }

  ngOnInit() {
    let nombrePerfil = sessionStorage.getItem("Nombre_Perfil");
    this.estado_perfil = (( nombrePerfil == "RESPONSABLE" ||  nombrePerfil == "COLABORADOR")  ? true : false);

    this.beProyecto.id_municipalidad = parseInt(sessionStorage.getItem("IdMunicipalidad"));
    this.beProyecto.cod_depa = sessionStorage.getItem("Coddepa");
    this.beProyecto.nombre_perfil = sessionStorage.getItem("Nombre_Perfil");
    this.beProyecto.id_zona = parseInt(sessionStorage.getItem("IdZona"));
    this.beProyecto.id_usuario = parseInt(sessionStorage.getItem("IdUsuario"));
    this.beProyecto.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil"));
    this.beProyecto.nombre_municipalidad = sessionStorage.getItem("Municipalidad");

    this.ConsultaMunicipalidadesAutoComplete();
    this.ConsultarProyectosAutocomplete();
    this.consultaTiposFase();
    this.consultarRegiones();
    this.beProyecto.num_pagina=0;
    this.ConsultaPrincipal(this.beProyecto);
  }
  ConsultaPrincipal(beProyecto: Proyecto) {
    beProyecto.coddepartamento = (this.beProyecto.cod_depa == null ? "" : this.beProyecto.cod_depa );

    if (beProyecto.nombre_municipalidad == "") {
      beProyecto.id_municipalidad = 0;
    }
    
    // this.servicioMetas.ListarProyectoGeneralMeta(beProyecto)
    // .subscribe(
    //   (data:any) => {
    //     this.ListaProyecto=data;
    //     //this.pager = this.pagerService.getPager(this.totalfilasPorPagina, this.beProyecto.page);
    //     this.SetearPaginaActiva(this.paginaActiva);
    //   }
    // );
    this.fs.wsConsultaPrincipalService.wsConsultaPrincipal(beProyecto)
    .subscribe(
      (data:any) => {
        this.ListaProyecto=data;
        this.SetearPaginaActiva(this.paginaActiva);
      }
    );
  }
  SetearPaginaActiva(parametro){
    setTimeout(()=>{this.paginaActiva =parametro;},1)
  }
  CambiarPagina(pagina:any){
    this.paginaActiva = pagina.page;
    this.beProyecto.num_pagina = ((pagina.page - 1) * this.beProyecto.num_filas);
    this.ConsultaPrincipal(this.beProyecto);
  }
  ConsultaMunicipalidadesAutoComplete() {
    this.buscarMunicipalidad.valueChanges.subscribe(
      term => {
        if (term != '') {
          if (term.length > 2) {
            let idMunicipalidad: number = 0;
            if (term.split('|').length > 1) {
              term = term.split('|')[1];
            }
            //this.maestraServices.listarMunicipalidadPorFiltro(idMunicipalidad, term).subscribe(
            this.fs.maestraService.listarMunicipalidadPorFiltro(this.beProyecto, term).subscribe(
              data => {
                if (data.length != 0) {
                  this.unidadesEjecutoras = data;
                } else {
                  this.unidadesEjecutoras = [];
                }
              })
          } else {
            this.unidadesEjecutoras = undefined;
          }
        } else {
          this.unidadesEjecutoras = undefined;
          this.beProyecto.id_municipalidad = 0;
        }
      })
  }
  ConsultarProyectosAutocomplete() {
    var self = this;

    self.buscarProyecto.valueChanges.subscribe(
      term => {
        if (term != '') {
          if (term.length > 2) {
            //if(term.length % 3 == 0){
            self.beProyecto.nombre_proyecto = term.toUpperCase();
            self.beProyecto.cod_snip = 0;
            (<any>window).Pace.ignore(function () {
              self.fs.wsConsultaPrincipalService.wsConsultaAutocompletadoPrincipal(self.beProyecto).subscribe(
                data => {
                  let proyectoReturn;
                  proyectoReturn = data as any;
                  self.proyects = proyectoReturn.proyecto;
                  if (self.beProyecto.cod_snip == 0) {
                    self.beProyecto.cod_snip_texto = "";
                  }
                })
            })
            //}
          } else {
            self.proyects = undefined;
          }
        }
      })
  }
  consultaTiposFase() {
    this.fs.wsConsultaPrincipalService.listarTipoFases().subscribe(
      data => {
        this.lstTiposFase = data;
        this.numFases = this.lstTiposFase.length;
        this.numColumnasDetalle = this.lstTiposFase.length + 8;
      });
  }
  consultarRegiones(): void {
    let codigoUsuario: number = 0;
    if (this.beProyecto.id_perfil == 6 || this.beProyecto.id_perfil == 3 || this.beProyecto.id_perfil == 2) {
      codigoUsuario = this.beProyecto.id_usuario;
    }

    this.svcPerfiles.listarRegionesSegunPerfilUsuario(this.beProyecto.id_perfil, codigoUsuario).subscribe(
      data => {
        this.listRegiones = data as any[];
      }
    )
  }
  limpiarAutocomplete() {
    this.proyects = undefined;
  }
  limpiarAutocompleteMunicipalidad() {
    this.unidadesEjecutoras = undefined;
  }
  mostrarProyectoSeleccionado(pProyectoSeleccionado) {
    this.beProyecto.id_proyecto = pProyectoSeleccionado.split('|')[0];
    this.beProyecto.nombre_proyecto = pProyectoSeleccionado.split('|')[1];
    this.proyects = undefined;
  }
  mostrarProyectoInicial(beProyecto) {
    this.ConsultaPrincipal(beProyecto);
  }
  AbrirModalMetas(ID_PROYECTO:number){
    let config={
      initialState:{
        ACCION:3,
        ID_PROYECTO:ID_PROYECTO,
        valor:null
      }
    }
    this.BsModalRef=this.BsModalService.show(CrudMetasComponent,config);
  }
  mostrarMunicipalidadSeleccionado(pMunicipalidadSeleccionada) {
    this.beProyecto.id_municipalidad = pMunicipalidadSeleccionada.split('|')[0];
    this.beProyecto.nombre_municipalidad = pMunicipalidadSeleccionada.split('|')[1];
    //this.beUnidadEjecutoraResponse.id_municipalidad = this.beProyecto.id_municipalidad;
    this.proyects = undefined;
  }
  LimpiarControles() {
    this.beProyecto.cod_snip_texto = "";
    this.beProyecto.nombre_proyecto = "";
    this.ConsultaPrincipal(this.beProyecto);
  }
}
