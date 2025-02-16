import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SupervisorEstudio } from '../../../../models/supervisor-estudio';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';

import  $ from 'jquery';

@Component({
  selector: 'set-modal-supervisor-estudio',
  templateUrl: './modal-supervisor-estudio.component.html',
  styleUrls: ['./modal-supervisor-estudio.component.css']
})
export class ModalSupervisorEstudioComponent implements OnInit {
  model: SupervisorEstudio;
  listColegiatura = [];
  listSupervisor = [];
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  respSupervisor;
  id_seguimientoMonitoreoExpediente:number
  registrado: EventEmitter<any> = new EventEmitter();
  @Output() emitResponsable = new EventEmitter();
  file: any;
  bEstado: boolean;
  bMostrar: boolean = false;

  nombreArchivo: string = null;

  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  foto = '';

  constructor(private modalRef: BsModalRef, public funciones: Funciones, private fs: FacadeService) { }

  ngOnInit() {
    this.diaHoy=new Date();
    this.diaInicial=new Date(this.diaHoy.getFullYear(), this.diaHoy.getMonth(), this.diaHoy.getDate());
    this.fechaDesignaconMax=this.diaInicial;
    this.setControles();
    this.listarColegiatura();
    this.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
  }

  listarColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      respuesta => {
        this.listColegiatura = respuesta as any;
      }
    )
  }

  listarSupervisorEstudio(id_seguimientoMonitoreoExpediente, filas, paginas) {
    this.fs.supervisorService.listarSupervisorEstudio(id_seguimientoMonitoreoExpediente, filas, paginas).subscribe(
      respuesta => {
        this.respSupervisor = respuesta as any;
        this.listSupervisor = this.respSupervisor[0].supervisores != null ? this.respSupervisor[0].supervisores : [];
        this.totalRegistros = this.respSupervisor[0].cantidad;
      }
    )
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoMonitoreoExpediente);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new SupervisorEstudio();
    this.file = null;
    $('input[name="filesupervisorEstudio"], #filesupervisorEstudio').val("");
    const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
    if(imagen!=undefined){
      imagen.src = '';
    }
    
    
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
  }

  validarEmail(email: string): boolean {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (emailRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  modificarSupervisor(model, form) {
    if(!this.validarEmail(model.email)){
      this.funciones.mensaje("warning","Debe ingresar email valido");
      return;
    }

    this.bMostrar = true;
    //actualizar
    if (model.id_supervisor_estudio != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.supervisorService.modificarSupervisorEstudio(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
            this.limpiarControles();
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      );
    }
    //registrar
    else {
      model.usuario_creacion = sessionStorage.getItem("Usuario");
      model.id_seguimiento_ejecucion_expediente = this.id_seguimientoMonitoreoExpediente;
      this.fs.supervisorService.insertarSupervisorEstudio(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
            this.limpiarControles();
          } else {
            this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
          }
          this.bMostrar = false;
        }
      );
    }
    form.resetForm();
    this.setControles();
  }

  limpiarControles() {
    const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
    imagen.src = '';
  }


  editarSupervisor(model) {
    this.setControles();
    this.model = Object.assign({}, model);
    this.model.fecha_designacion = this.funciones.ConvertStringtoDateDB(model.fecha_designacion);

    this.nombreArchivo=model.nombre_archivo;
    this.ValidarInformacionReniec();
    $('input[name="filesupervisorEstudio"]').val(model.nombre_archivo);
  }

  eliminarSupervisor(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_supervisor_estudio: model.id_supervisor_estudio, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.supervisorService.anularSupervisorEstudio(strData).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina);
              this.setControles();
            } else {
              this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
            }
          }
        );
      }
    });
  }


  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
      this.nombreArchivo=evento.file.name;
    }
  }



  validarDNI() {
    let valDni = this.model.dni;
    if(valDni!=null){
      if (valDni.length == 8) {
        this.ValidarInformacionReniec();
      } else {
        this.model.nombres=null;
        this.model.apellidos=null;
  
        const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
        imagen.src = '';
      }
    }
  }

  lstResponsables =[];
  ValidarInformacionReniec() {
    let valDni = this.model.dni;
    let cant=0;
    if (valDni == "" || valDni == null) {
      document.getElementById("dni").focus();
      this.funciones.mensaje("info", "Debe ingresar el N° de Dni a validar.");
    } else {
      this.fs.supervisorService.listarSupervisorEstudio(this.id_seguimientoMonitoreoExpediente, this.num_filas, this.numero_Pagina).subscribe(
        (respuesta:any) => {
          this.lstResponsables = respuesta[0].supervisores;
          if(this.lstResponsables!=null){
            for(let i=0;i<this.lstResponsables.length;i++){
              if(this.lstResponsables[i].dni==valDni){
                cant++;
              }
            }
          }
          //if(cant==0){
            this.fs.dataexternaService.consultarInformacionReniec(valDni).subscribe(
              data => {
                let response = data as any;
                if (data != null && data != "") {
                  this.model.nombres=response.strnombres;
                  this.model.apellidos=response.strapellidopaterno +' '+ response.strapellidomaterno;

                  this.foto = response.strfoto;
                  const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
                  imagen.src = response.strfoto;
                } else {
                  this.funciones.mensaje("info", "No se encontró información del Dni ingresado.");
                  this.model.nombres=null;
                  this.model.apellidos=null;
                  let imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
                  imagen.src = '';
                }
              }
            );
          //}else{
            //this.funciones.mensaje("info", "El DNI ingresado ya se encuentra registrado.");
          //}
        }
      )
    }
  }



}
