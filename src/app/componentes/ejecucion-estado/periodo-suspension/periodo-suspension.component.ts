import { Component, OnInit, Input, ɵConsole,Output,EventEmitter } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Functions, AplicarTipoControl } from 'src/app/appSettings';
import { Suspension } from 'src/app/models/response/suspension';
import { SeguimientoMonitoreo } from 'src/app/models/response/seguimiento-monitoreo';
import { AuthService } from '../../auth/auth.service';

import { SuspensionAccion } from 'src/app/models/response/suspension-accion';
import { SuspensionAccionComponent } from '../../ejecucion-estado/periodo-suspension/suspension-accion/suspension-accion.component';

import { SuspensionModalComponent } from '../../ejecucion-estado/periodo-suspension/suspension-modal/suspension-modal.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { parseDate } from 'ngx-bootstrap/chronos';


@Component({
  selector: 'app-periodo-suspension',
  templateUrl: './periodo-suspension.component.html',
  styleUrls: ['./periodo-suspension.component.css']
})
export class PeriodoSuspensionComponent implements OnInit {
   @Output() emitEventInformacionObra = new EventEmitter();

   model_Suspension: Suspension;
   @Input() idSeguimientoMonitoreoObra: number
   @Input() tipoPerfil: string

   bsModalRef: BsModalRef;
   listSuspension;
   model: SeguimientoMonitoreo;
   model_Accion_Suspension: SuspensionAccion;
   UltimaActualizacionSuspension: string = "";
   UltimaActualizacionAccionSuspension: string = "";
   mostrarAuditoriaAccionSuspension: boolean = true;
   idParalizacionObra: number;
   @Input() bEstado: boolean;

   listAccionSuspension;
   bsModaAccSuspension: BsModalRef;

  // /*Juan Ojeda*/
   totalRegistrosSuspension;
   paginaActiva: number = 0;
   numPaginasMostrar: number = 5;
  // /*Fin*/

  fecha_inicio_contractual_parametro: string = "";

  constructor(private fs: FacadeService,
    private modalService: BsModalService,
    public funciones: Functions,
    public securityService: AuthService) { }


  monitoreo_tabSeg_suspension_listSuspension_susp: boolean
  monitoreo_tabSeg_suspension_regSuspension_susp: boolean
  monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones_susp: boolean
  monitoreo_tabSeg_suspension_listSuspension_regDetalleSuspension_susp: boolean
  monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones_susp: boolean
  monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones_susp: boolean
  monitoreo_tabSeg_suspension_listSuspension_listDetalleSuspension_susp: boolean
  monitoreo_tabSeg_suspension_listSuspension_editSuspension_susp: boolean
  monitoreo_tabSeg_suspension_listSuspension_eliSuspension_susp: boolean
  monitoreo_tabSeg_suspension_listSuspension_verArchivo_susp: boolean



  ngOnInit() {
    this.fecha_inicio_contractual_parametro = sessionStorage.getItem("fecha_inicio_obra");
    this.UltimaActualizacionSuspension = this.obtenerDatosAuditoria("Suspension");
    this.UltimaActualizacionAccionSuspension=this.obtenerDatosAuditoria("AccionSuspension");

    //if(!sessionStorage.getItem("esSuspension")){
      //if(this.idSeguimientoMonitoreoObra!=0){
        if(sessionStorage.getItem("esSuspension")=="false"){
          this.crearSeguimientoMOnitoreoModel(this.idSeguimientoMonitoreoObra);
          this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
        }
        else{
          this.crearSeguimientoMOnitoreoModel(this.idSeguimientoMonitoreoObra);
          this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
        }
     // }
      
    //}


    this.monitoreo_tabSeg_suspension_listSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_susp");
    this.monitoreo_tabSeg_suspension_regSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_regSuspension_susp")
    this.monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones_susp = this.esVisible("monitoreo_tabSeg_obraValorizaciones_nuevObraValorizaciones_susp")
    this.monitoreo_tabSeg_suspension_listSuspension_regDetalleSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_regDetalleSuspension_susp")
    this.monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones_susp = this.esVisible("monitoreo_tabSeg_obraValorizaciones_editObraValorizaciones_susp")
    this.monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones_susp = this.esVisible("monitoreo_tabSeg_obraValorizaciones_eliObraValorizaciones_susp")
    this.monitoreo_tabSeg_suspension_listSuspension_listDetalleSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_listDetalleSuspension_susp")
    this.monitoreo_tabSeg_suspension_listSuspension_editSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_editSuspension_susp")
    this.monitoreo_tabSeg_suspension_listSuspension_eliSuspension_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_eliSuspension_susp")
    this.monitoreo_tabSeg_suspension_listSuspension_verArchivo_susp = this.esVisible("monitoreo_tabSeg_suspension_listSuspension_verArchivo_susp")
  }

  crearSeguimientoMOnitoreoModel(idSegMonitoreo) {
    this.fs.seguimientoMonitoreoService.listarSeguimientoMonitoreo(idSegMonitoreo, this.bEstado).subscribe(
      respuesta => {
        this.model = new SeguimientoMonitoreo();

        if (respuesta != "{ \"data\":[{}]}") {
          if(respuesta[0].fecha_inicio_contractual!=null){
            this.model.fecha_inicio_contractual = this.funciones.ConvertStringtoDateDB(respuesta[0].fecha_inicio_contractual); 
          }
           
        }
      });
  }

  mensajeValidarCausalSuspension: string = "";
  config;
  EsSuspendido :boolean;


  opnModNuevaSuspension() {
      if (this.idSeguimientoMonitoreoObra == 0) {
        this.EsSuspendido=false; 
      } else {
        if(sessionStorage.getItem("esSuspension")=="true"){
          this.EsSuspendido =true;
        }else{
          this.EsSuspendido=false;
        }
        
      }
    this.fs.suspensionService.validarSuspensionObra(this.idSeguimientoMonitoreoObra,this.tipoPerfil,"",this.EsSuspendido,0).subscribe(
      (respuesta:any)=>{
        if(!respuesta.estado){
          this.mensajeValidarCausalSuspension = "";
          this.funciones.mensaje("info", "Existe una suspensión y/o paralización pendiente de su Reinicio de la Obra y/o pendiente de su ampliación.");
        }else{
          this.mensajeValidarCausalSuspension="validado";
        }

        if(this.mensajeValidarCausalSuspension=="validado"){
          this.model_Suspension = new Suspension();
          this.model_Suspension.id_suspension_obra = 0;
          this.model_Suspension.id_seguimiento_monitoreo_obra = this.idSeguimientoMonitoreoObra;
          this.model_Suspension.perfil = this.tipoPerfil;
          /*let fechaInicioContractual:Date;

          if(sessionStorage.getItem("fecha_inicio_obra")=="null"){
            fechaInicioContractual=null;
          }else{
            if(sessionStorage.getItem("esSuspension")=="false"){
              fechaInicioContractual=this.model.fecha_inicio_contractual;// parseDate(sessionStorage.getItem("fecha_inicio_obra"));
            }else{
              fechaInicioContractual=this.model.fecha_inicio_contractual//parseDate(sessionStorage.getItem("fecha_inicio_obra"));
            }
            
          }*/
      
          this.config = {
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
              modelSuspension: this.model_Suspension,fecha_inicio_contractual:this.model.fecha_inicio_contractual   //fechaInicioContractual//
            }
          };
      
          this.bsModalRef = this.modalService.show(SuspensionModalComponent, this.config);
          this.bsModalRef.content.retornoValores.subscribe(
            () => {
              this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
              this.consultaAuditoria("Suspension");
             }
           )

        }else{
          this.funciones.mensaje("info", "Existe una suspensión y/o paralización pendiente de su Reinicio de la Obra y/o pendiente de su ampliación.");
        }
        this.mensajeValidarCausalSuspension="";

      });

    
   }

  listarSuspension(id, pNumPagina, pNumFilas) {
    let sum = 0;
    this.fs.suspensionService.listarSuspensionObra(id, this.tipoPerfil, pNumPagina, pNumFilas).subscribe(
      respuesta => {
        let suspensionReturn;
        suspensionReturn = respuesta as any;
        if (suspensionReturn.cantidad_registro == 0) {
          this.listSuspension = [];
        } else {
          this.listSuspension = suspensionReturn.suspension_obra;
          this.totalRegistrosSuspension = suspensionReturn.cantidad_registro;

          if (this.listSuspension) {
            this.listSuspension.forEach(element => {

              let fechaInicio = new Date(element.fecha_inicio).getTime();
              let fechaFin = new Date(element.fecha_termino).getTime();

              var day_as_milliseconds = 86400000;
              var diff_in_millisenconds = fechaFin - fechaInicio;
              var diff_in_days = diff_in_millisenconds / day_as_milliseconds;

              sum = sum + diff_in_days;
              
              //element.fecha_inicio = this.funciones.formatDate(element.fecha_inicio);
              element.fecha_inicio = this.funciones.fechaStringAAAAMMDDtoDDMMYYYY(element.fecha_inicio);
              element.fecha_termino = this.funciones.formatDate(element.fecha_termino);
              element.fecha_termino_sugerido = this.funciones.formatDate(element.fecha_termino);


            });
          }
        }
      }
    )
  };

  consultaAuditoria(pNombreTipoAuditoria) {
    this.fs.maestraService.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.UltimaActualizacionSuspension = this.obtenerDatosAuditoria("Suspension");
        this.UltimaActualizacionAccionSuspension=this.obtenerDatosAuditoria("AccionSuspension");
             
      }
    );
  }

  consultaAuditoriaAccion(pNombreTipoAuditoria) {
    this.fs.maestraService.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.UltimaActualizacionAccionSuspension = this.obtenerDatosAuditoria("AccionSuspension");
             
      }
    );
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
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
  }

  numPagina: number = 0;
  cambiarPaginaSuspension(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numPagina = ((pagina.page - 1) * this.numPaginasMostrar);
    this.listAccionSuspension = [];
    this.totalRegistrosSuspensionAccion = 0;
    this.listarSuspension(this.idSeguimientoMonitoreoObra, this.numPagina, this.numPaginasMostrar);
  }

  numPaginaAccionSuspension: number = 0;
  numPaginasMostrarAccionSuspension: number = 5;
  paginaActivaAccionSuspension: number = 0;
  totalRegistrosSuspensionAccion: number = 0;
  idSuspensionAccionObraParametro: number = 0;

  cambiarPaginaAccionSuspension(pagina) {
    this.paginaActivaAccionSuspension = ((pagina.page - 1) * this.numPaginasMostrarAccionSuspension);
    this.numPaginaAccionSuspension = ((pagina.page - 1) * this.numPaginasMostrarAccionSuspension);
    this.listarAccionSuspension(this.idSuspensionAccionObraParametro, this.numPaginaAccionSuspension, this.numPaginasMostrarAccionSuspension);
  }

  listarAccionSuspension(id, pNumPagina, pNumFilas) {
    this.fs.suspensionAccionService.listarSuspensionAccionObra(id, pNumPagina, pNumFilas).subscribe(
      respuesta => {
        let suspensionAccionReturn;
        suspensionAccionReturn = respuesta as any;
        if (suspensionAccionReturn.cantidad_registro == 0) {
          this.listAccionSuspension = [];
        } else {
          this.listAccionSuspension = suspensionAccionReturn.suspension_accion_obra;
          this.totalRegistrosSuspensionAccion = suspensionAccionReturn.cantidad_registro;
          this.listAccionSuspension.forEach(element => {
            element.fecha = this.funciones.formatDate(element.fecha);
          });
        }
        if (suspensionAccionReturn.auditoria != null) {
          this.UltimaActualizacionAccionSuspension = (suspensionAccionReturn.auditoria.usuario == null ? "" : suspensionAccionReturn.auditoria.usuario) + (suspensionAccionReturn.auditoria.fecha == null ? "" : " - " + this.funciones.formatFullDate(suspensionAccionReturn.auditoria.fecha));
        }

      }
    )
  };

  ObtenerDetalleAccionesSuspension(pIdSuspensionObra) {
    this.mostrarAuditoriaAccionSuspension = false;
    this.idSuspensionAccionObraParametro = pIdSuspensionObra;
    this.listarAccionSuspension(pIdSuspensionObra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension)
    this.consultaAuditoria("AccionSuspension");
  }

  eliminarAccionSuspension(model) {
    let EsSuspendido :boolean;
    if(sessionStorage.getItem("esSuspension")=="false"){
      if (this.idSeguimientoMonitoreoObra == 0) {
        EsSuspendido = true;
      } else {
        EsSuspendido = false;
      }
    }else{
      EsSuspendido = true;
    }

    this.fs.suspensionService.validarSuspensionObraEliminar(this.idSeguimientoMonitoreoObra,this.tipoPerfil,EsSuspendido,model.id_suspension_obra).subscribe(
      (respuesta:any)=>{
        if(!respuesta.estado){
          this.mensajeValidarCausalSuspension = "";
          this.funciones.mensaje("info", "Primero debe eliminar la ampliación asociado a la suspensión");
          return false;
        }else{
          /**inicio */
          model.usuario_eliminacion = sessionStorage.getItem("Usuario");
          let strData = { id_suspension_accion_obra: model.id_suspension_accion_obra, usuario_eliminacion: model.usuario_eliminacion }
          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
            if (respuesta.value) {
              this.fs.suspensionAccionService.anularSuspensionAccionObra(strData).subscribe(
                () => {
                  if(sessionStorage.getItem("fecha_inicio_obra") == "null" && model.id_tipo_suspension_accion_obra == 6){
                    sessionStorage.setItem("esSuspension", JSON.stringify(true));
                    this.emitEventInformacionObra.emit(true);
                  }else{
                    sessionStorage.setItem("esSuspension", JSON.stringify(false));
                  }
                  this.listarAccionSuspension(model.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension);
                  this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
                  this.consultaAuditoria("AccionSuspension");
                  
                }
              );
            }
          });
          /**fin de validacion */
        }

      });
  }


  numAccionSuspension;
  editarSuspension(model: Suspension) {
    let cont=0;
    this.fs.suspensionAccionService.listarSuspensionAccionObra(model.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension).subscribe(
      (respuesta:any) => {
        this.numAccionSuspension=respuesta.suspension_accion_obra;
       for (let index = 0; index < this.numAccionSuspension.length; index++) {
          if(this.numAccionSuspension[index].cod_suspension_accion=="TSUO06" && this.numAccionSuspension[index].cod_tipo_documento=="TDOC07"){
            cont++;
          }
        
        }
        if(cont>0){
          this.funciones.mensaje("warning", "No puede editar la suspensión por tener acta de reinicio de obra");
          return false;
        }else{
          /**inicio */
          model.perfil = this.tipoPerfil;
          this.config = {
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
              modelSuspension: model
            }
          };
      
          this.bsModalRef = this.modalService.show(SuspensionModalComponent, this.config);
          this.bsModalRef.content.retornoValores.subscribe(
            () => {
              this.listarSuspension(model.id_seguimiento_monitoreo_obra, this.paginaActiva, this.numPaginasMostrar);
              this.consultaAuditoria("Suspension");
            }
          )
          /**termino */
        }

      }
    )
  }

  eliminarSuspension(model) {
    let cont=0;
    this.fs.suspensionAccionService.listarSuspensionAccionObra(model.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension).subscribe(
      (respuesta:any) => {
        this.numAccionSuspension=respuesta.suspension_accion_obra;
       for (let index = 0; index < this.numAccionSuspension.length; index++) {
          if(this.numAccionSuspension[index].cod_suspension_accion=="TSUO06" && this.numAccionSuspension[index].cod_tipo_documento=="TDOC07"){
            cont++;
          }
        
        }
        if(cont>0){
          this.funciones.mensaje("warning", "No puede eliminar la suspensión por tener acta de reinicio de obra");
          return false;
        }else{
          /**inicio */
          this.listarAccionesSuspensionEliminar(model);
          /**termino */
        }

      }
    )
    
  }

  listarAccionesSuspensionEliminar(model) {

   this.fs.suspensionAccionService.listarSuspensionAccionObra(model.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension).subscribe(
      respuesta => {
        let suspensionAccionReturnEliminar;
        suspensionAccionReturnEliminar = respuesta as any;
        if (suspensionAccionReturnEliminar.cantidad_registro == 0) {
          model.usuario_eliminacion = sessionStorage.getItem("Usuario");
          let strData = { id_suspension_obra: model.id_suspension_obra, usuario_eliminacion: model.usuario_eliminacion }//modificar bd

          this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
            if (respuesta.value) {
              this.fs.suspensionService.anularSuspensionObra(strData).subscribe(
                () => {
                  this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
                  this.consultaAuditoria("Suspension");
                  sessionStorage.setItem("esSuspension", JSON.stringify(false));
                }
              );
            }
          });
        } else {
          this.funciones.mensaje("warning", "La suspensión a eliminar contiene acciones asociadas.");
        }

      }
    )
  };

  openModalAccSuspension(model) {
    this.model_Accion_Suspension = new SuspensionAccion();
    this.model_Accion_Suspension.id_suspension_accion_obra = 0;
    this.model_Accion_Suspension.id_suspension_obra= model.id_suspension_obra;
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelAccionSuspension: this.model_Accion_Suspension, minDate: model.fecha_inicio, maxDate: model.fecha_termino
      }
    };

    this.bsModaAccSuspension = this.modalService.show(SuspensionAccionComponent, this.config);
    this.bsModaAccSuspension.content.retornoValores.subscribe(
      () => {
        this.mostrarAuditoriaAccionSuspension = false;
        this.listarAccionSuspension(this.model_Accion_Suspension.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension);
        this.listarSuspension(this.idSeguimientoMonitoreoObra, this.paginaActiva, this.numPaginasMostrar);
        this.consultaAuditoria("AccionSuspension");
        this.emitEventInformacionObra.emit(true);
      }
    )
  }


  editarAccionSuspension(model) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelAccionSuspension: model, minDate: model.fecha_inicio, maxDate: model.fecha_termino
      }
    };

    this.bsModaAccSuspension = this.modalService.show(SuspensionAccionComponent, this.config);
    this.bsModaAccSuspension.content.retornoValores.subscribe(
      () => {
        this.listarAccionSuspension(model.id_suspension_obra, this.paginaActivaAccionSuspension, this.numPaginasMostrarAccionSuspension);
        this.consultaAuditoria("AccionSuspension");
      }
    )
  }

  esVisible(hasClaimType) : boolean {
    hasClaimType = hasClaimType + "_" + this.tipoPerfil;
    let value = this.securityService.hasClaim(hasClaimType) == AplicarTipoControl.Visible; 
    return value;
  }

}
