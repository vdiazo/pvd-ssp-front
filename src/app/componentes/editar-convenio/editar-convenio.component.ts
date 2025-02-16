import { Component, OnInit, ViewEncapsulation,Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Convenio, _proyecto, _tramo, _Tipofase, _convenio } from '../../models/Convenio';
import { Functions } from '../../appSettings/functions';
import { tipoArchivo } from '../../appSettings/enumeraciones';
import { FacadeService } from '../../patterns/facade.service';

@Component({
  selector: 'app-editar-convenio',
  templateUrl: './editar-convenio.component.html',
  styleUrls: ['./editar-convenio.component.css'],  
  encapsulation: ViewEncapsulation.None,
  providers: [Functions]
})
export class EditarConvenioComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  file: any;
  entidadEditar;
  municipalidades;
  denominacion;
  vias;
  infraestructuras;
  documentos;
  medidas;
  ejecutoras;
  visibleEjecutora :boolean;
  entidadArchivo;
  nombreArchivo:string = null;
  IdTipoArchivo : number = tipoArchivo.convenio;
  
  constructor(public modalRef: BsModalRef,
              private fs : FacadeService,
              public funciones : Functions) { }

  ngOnInit() {
    if(this.entidadEditar.id_ejecutora == 0 || this.entidadEditar.id_ejecutora == null){
      this.visibleEjecutora = false;
    }else{
     
      this.fs.convenioService.ListarEjecutora(this.entidadEditar.id_municipalidad).subscribe(
        response => {
          this.ejecutoras = response;
          this.visibleEjecutora = true;
        }
      );
    }
    this.entidadEditar.numMonto_texto = this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.monto.toString()));
    this.entidadEditar.numLongitud_texto = this.funciones.format(this.funciones.setearValorDecimal(this.entidadEditar.longitud.toString()));
    this.listarMunicipalidades();
    this.listarDenominacion();
    this.listarTipoDocumentos();
    this.listarTipoInfraestructura();
    this.listarTipoVias();
    this.listarTipoMedidas();
  }

  administrarConvenioEditar(){
    this.editarConvenios();
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;  
    }
  }


  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  seleccionarEjecutora(municipalidad){
    let id = municipalidad.id_municipalidad;
    this.fs.convenioService.ListarEjecutora(id).subscribe(
      response => {
        this.ejecutoras = response;
        if(this.ejecutoras == '{ \"data\":[{}]}'){
          this.visibleEjecutora = false;
          this.ejecutoras = null;
          this.entidadEditar.id_ejecutora = 0;
        }
        else{
          this.visibleEjecutora = true;
        }
      }
    );
  }
  listarMunicipalidades() {
    this.fs.maestraService.listarMunicipalidad().subscribe(
      data => {
        this.municipalidades = data;
      }
    ) 
  }
  listarDenominacion() {
    this.fs.maestraService.listarDenominacion().subscribe(
      data => {
        this.denominacion = data;
      }
    ) 
  }  
  listarTipoDocumentos() {
    this.fs.maestraService.listarTipoDocumentoCompromiso().subscribe(
      data => {
        this.documentos = data;
      }
    ) 
  }
  listarTipoInfraestructura() {
    this.fs.maestraService.listarTipoInfraestructura().subscribe(
      data => {
        this.infraestructuras = data;
      }
    ) 
  }
  listarTipoVias() {
    this.fs.maestraService.listarTipoVia().subscribe(
      data => {
        this.vias = data;
      }
    ) 
  }

  listarTipoMedidas() {
    this.fs.maestraService.listarUnidadMedidas().subscribe(
      data => {
        this.medidas = data;
      }
    ) 
  }

  editarConvenios(){
    if(this.visibleEjecutora && (this.entidadEditar.id_ejecutora == null || this.entidadEditar.id_ejecutora == 0)){
      this.funciones.mensaje("info","Debe seleccionar un tipo de ejecutora.");
      return;
    }
    const fechaconvenio = this.entidadEditar.fecha_firma.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_firma):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_firma));
    const fechavigencia =this.entidadEditar.fecha_vigencia.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_vigencia):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_vigencia));
    if(fechaconvenio > fechavigencia){
      this.funciones.mensaje("info","La fecha de firma de convenio no puede ser mayor a la fecha de vigencia.");
      return;
    }
    
    let envioEditar = new Convenio();
    envioEditar._BE_Tm_Ssppvd_Proyecto = new _proyecto();
    envioEditar._BE_Tm_Ssppvd_Proyecto.id_proyecto = this.entidadEditar.id_proyecto;
    envioEditar._BE_Tm_Ssppvd_Proyecto.cod_snip = this.entidadEditar.cod_snip;
    envioEditar._BE_Tm_Ssppvd_Proyecto.cod_unificado = this.entidadEditar.cod_unificado;
    envioEditar._BE_Tm_Ssppvd_Proyecto.nombre_proyecto = this.entidadEditar.nombre_proyecto;
    envioEditar._BE_Tm_Ssppvd_Proyecto.activo = true;
    envioEditar._BE_Tm_Ssppvd_Proyecto.usuario_creacion = sessionStorage.getItem("Usuario");
    envioEditar._BE_Tm_Ssppvd_Tramo = new _tramo();
    envioEditar._BE_Tm_Ssppvd_Tramo.id_tramo = this.entidadEditar.id_tramo;
    envioEditar._BE_Tm_Ssppvd_Tramo.nombre_tramo = this.entidadEditar.nombre_tramo;
    envioEditar._BE_Tm_Ssppvd_Tramo.descripcion_tramo = this.entidadEditar.nombre_tramo;
    envioEditar._BE_Tm_Ssppvd_Tramo.activo = true;
    envioEditar._BE_Tm_Ssppvd_Tramo.usuario_modificacion = sessionStorage.getItem("Usuario");
    envioEditar._BE_Tm_Ssppvd_Fase = new _Tipofase();
    envioEditar._BE_Tm_Ssppvd_Fase.id_tipo_fase = this.entidadEditar.id_tipo_fase;
    envioEditar._BE_Tm_Ssppvd_Fase.usuario_creacion = sessionStorage.getItem("Usuario");
    envioEditar._BE_Tm_Ssppvd_Convenio = new _convenio();
    envioEditar._BE_Tm_Ssppvd_Convenio.id_convenio = this.entidadEditar.id_convenio;
    envioEditar._BE_Tm_Ssppvd_Convenio.fecha_firma = this.entidadEditar.fecha_firma.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_firma):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_firma));
    envioEditar._BE_Tm_Ssppvd_Convenio.fecha_vigencia = this.entidadEditar.fecha_vigencia.toString().length == 10 ? this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_vigencia):this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.entidadEditar.fecha_vigencia));
    envioEditar._BE_Tm_Ssppvd_Convenio.id_documento_compromiso = this.entidadEditar.id_documento_compromiso;
    envioEditar._BE_Tm_Ssppvd_Convenio.id_fuente_financiamiento = this.entidadEditar.id_fuente_financiamiento;
    //envioEditar._BE_Tm_Ssppvd_Convenio.id_municipalidad = this.entidadEditar.id_municipalidad;
    envioEditar._BE_Tm_Ssppvd_Convenio.id_tipo_infraestructura = this.entidadEditar.id_tipo_infraestructura;
    envioEditar._BE_Tm_Ssppvd_Convenio.id_tipo_via = this.entidadEditar.id_tipo_via;
    envioEditar._BE_Tm_Ssppvd_Convenio.id_unidad_medida = this.entidadEditar.id_unidad_medida;
    envioEditar._BE_Tm_Ssppvd_Convenio.longitud = Number.parseFloat(this.entidadEditar.numLongitud_texto.toString().replace(/,/g,""));

    envioEditar._BE_Tm_Ssppvd_Convenio.monto = Number.parseFloat(this.entidadEditar.numMonto_texto.toString().replace(/,/g,""));
    envioEditar._BE_Tm_Ssppvd_Convenio.siglas = this.entidadEditar.siglas;
    envioEditar._BE_Tm_Ssppvd_Convenio.usuario_modificacion = sessionStorage.getItem("Usuario");
    //envioEditar._BE_Tm_Ssppvd_Convenio.id_ejecutora = this.entidadEditar.id_ejecutora == null? 0 : this.entidadEditar.id_ejecutora;
    envioEditar._BE_Tm_Ssppvd_Convenio.nombre_archivo = this.nombreArchivo==null? this.entidadEditar.archivo_convenio : this.nombreArchivo;
    this.fs.convenioService.registrarConvenioSosem(envioEditar).subscribe(
      data => { 
        if(data == 0){
          this.funciones.mensaje("danger",this.funciones.mostrarMensaje("error","")); 
        }
        else{   
          this.funciones.mensaje("success",this.funciones.mostrarMensaje("actualizar",""));      
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );

    
  }

  calcularMonto(monto){
    let vmonto : string;
    vmonto= this.funciones.format(monto);
    this.entidadEditar.numMonto_texto = vmonto;
  }
  calcularLongitud(longitud){
    let vmonto : string;
    vmonto= this.funciones.format(longitud);
    this.entidadEditar.numLongitud_texto = vmonto;
  }

}
