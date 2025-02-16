import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SuspensionAccion } from '../../../../models/response/suspension-accion';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TipoDocumento } from '../../../../models/response/tipo-documento';
import { TipoSuspensionAccion } from '../../../../models/response/tipo-suspension-accion';
import { Functions } from '../../../../appSettings/functions';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import { FacadeService } from '../../../../patterns/facade.service';


@Component({
  selector: 'app-suspension-accion',
  templateUrl: './suspension-accion.component.html',
  styleUrls: ['./suspension-accion.component.css']
})
export class SuspensionAccionComponent implements OnInit {
  modelAccionSuspension;
  model: SuspensionAccion;
  tipoDocumento: TipoDocumento;
  tipoSuspensionAccion: TipoSuspensionAccion;
  listTipoDocumento;
  file: any;
  entidadArchivo;
  nombreArchivo: string = null;
  IdTipoArchivo: number = tipoArchivo.suspensionAccion;
  minimoDate = new Date();
  maximoDate = new Date();
  minDate;
  maxDate;
  bMostrar: boolean = false;

  vNombreFecha: string = "Fecha";

  pNumPagina?:number=0;
  pNumFilas?:number=0;
  listAccionSuspension;

  fecha_inicio_contractual: string = "";


  constructor(
    public modalRef: BsModalRef,
    private fs: FacadeService,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.fecha_inicio_contractual = sessionStorage.getItem("fecha_inicio_obra");
    this.listarTipoDocumento();
    this.listarTipoSuspensionAccion();
    if (this.modelAccionSuspension.id_suspension_accion_obra == 0) {
      this.model = new SuspensionAccion();
      this.model.id_suspension_accion_obra = this.modelAccionSuspension.id_suspension_accion_obra;
      this.model.id_suspension_obra = this.modelAccionSuspension.id_suspension_obra;
      this.minimoDate = this.funciones.ConvertStringtoDate(this.minDate);
      this.maximoDate = this.funciones.ConvertStringtoDate(this.maxDate);
    } else {
      this.minimoDate = this.funciones.ConvertStringtoDateDB(this.minDate);
      this.maximoDate = this.funciones.ConvertStringtoDateDB(this.maxDate);
      this.editarSuspensionAccionObra();
    }
  }

  editarSuspensionAccionObra() {
    this.model = new SuspensionAccion();
    this.model.id_suspension_accion_obra = this.modelAccionSuspension.id_suspension_accion_obra;
    this.model.id_suspension_obra = this.modelAccionSuspension.id_suspension_obra;
    this.model.id_tipo_documento = this.modelAccionSuspension.id_tipo_documento;
    this.model.id_tipo_suspension_accion_obra = this.modelAccionSuspension.id_tipo_suspension_accion_obra;
    this.model.fecha = this.funciones.ConvertStringtoDate(this.modelAccionSuspension.fecha);
    this.model.observacion = this.modelAccionSuspension.observacion;
    this.model.nombre_archivo = this.modelAccionSuspension.archivo_convenio;
    this.model.usuario_modificacion = sessionStorage.getItem("Usuario");

    if(this.model.id_tipo_suspension_accion_obra == 6){ //Reinicio de Obra
      this.vNombreFecha = "Fecha de Reinicio de Obra";
    }else{
      this.vNombreFecha = "Fecha";
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.listarTipoSuspensionAccion();
  }

  listarTipoDocumento() {
    //this.fs.maestraService.listarTipoDocumento().subscribe(
      this.fs.suspensionAccionService.listarSuspensionAccionControl().subscribe(
      data => {
        let listaTipoDocumento=data as any;
        this.tipoDocumento = listaTipoDocumento.tipo_documento as any;
      }
    )
  }

  listarTipoSuspensionAccion() {
    //this.fs.maestraService.listarTipoParalizacionAccion().subscribe(
      this.fs.suspensionAccionService.listarSuspensionAccionControl().subscribe(
      data => {
        let listTipAcSuspension = data as any;
        this.tipoSuspensionAccion = listTipAcSuspension.tipo_suspension_accion_obra;
      }
    )
  }

  @Output() retornoValores = new EventEmitter();

  administrarAccionSuspension(model) {
    let cont=0;
    this.fs.suspensionAccionService.listarSuspensionAccionObra(this.model.id_suspension_obra, this.pNumPagina, this.pNumFilas).subscribe(
      respuesta => {
        let suspensionAccionReturn;
        suspensionAccionReturn = respuesta as any; 
          this.listAccionSuspension = suspensionAccionReturn.suspension_accion_obra;
          for (let index = 0; index < this.listAccionSuspension.length; index++) {
            if(this.listAccionSuspension[index].cod_suspension_accion=="TSUO06" && this.listAccionSuspension[index].cod_tipo_documento=="TDOC07"){
              cont++;
            }
            
          }
          if(cont>0){
            this.funciones.mensaje("info", "No puede realizar más registro de detalles de suspensión dado que tiene un reinicio de obra");
            return false;
          }else{
            this.bMostrar = true;
            if (model.id_suspension_accion_obra == 0) {
              model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
              if (model.nombre_archivo == "") {
                this.funciones.mensaje("info", "Debe adjuntar un documento.");
                this.bMostrar = false;
              }else if(model.id_tipo_suspension_accion_obra == 6 && model.id_tipo_documento != 8){ // La accion de seguimiento debe ser igual debe corresponder al tipo de documento.
                this.funciones.mensaje("info", "El tipo de documento debe ser Acta de Reinicio de Obra.");
                this.bMostrar = false;
              }else if(model.id_tipo_suspension_accion_obra != 6 && model.id_tipo_documento == 8){
                this.funciones.mensaje("info", "El tipo de acción de seguimiento de monitoreo debe ser Reinicio de Obra.");
                this.bMostrar = false;
              }
              else {
                model.usuario_creacion = sessionStorage.getItem("Usuario");
                this.fs.suspensionAccionService.insertarSuspensionAccionObra(model).subscribe(
                  respuesta => {
                    if(this.fecha_inicio_contractual == "null" && model.id_tipo_suspension_accion_obra == 6){
                      sessionStorage.setItem("esSuspension", JSON.stringify(false));
                    }
                    
                    this.retornoValores.emit(respuesta);
                    this.modalRef.hide();
                    this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                    this.bMostrar = false;

                    
                  }
                );
              }
            }
            //registrar
            else {
              if(model.id_tipo_suspension_accion_obra == 6 && model.id_tipo_documento != 8){ // La accion de seguimiento debe ser igual debe corresponder al tipo de documento.
                this.funciones.mensaje("info", "El tipo de documento debe ser Acta de Reinicio de Obra.");
                this.bMostrar = false;
              }else if(model.id_tipo_suspension_accion_obra != 6 && model.id_tipo_documento == 8){
                this.funciones.mensaje("info", "El tipo de acción de seguimiento de monitoreo debe ser Reinicio de Obra.");
                this.bMostrar = false;
              } else {
              model.nombre_archivo = this.nombreArchivo == null ? model.nombre_archivo : this.nombreArchivo;
              this.fs.suspensionAccionService.modificarSuspensionAccionObra(model).subscribe(
                respuesta => {
                  this.retornoValores.emit(respuesta);
                  this.modalRef.hide();
                  this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
                  this.bMostrar = false;
                }
              );
            }
          }
        }
      }
    )
  };

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }

  seleccionarTipoAccionSuspension(e){
    if(e.id_tipo_suspension_accion_obra == 6){ //Reinicio de Obra
      this.vNombreFecha = "Fecha de Reinicio de Obra";
    }else{
      this.vNombreFecha = "Fecha";
    }
  }



}
