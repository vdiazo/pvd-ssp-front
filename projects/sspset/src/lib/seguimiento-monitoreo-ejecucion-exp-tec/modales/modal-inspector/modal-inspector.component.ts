import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { Inspector } from '../../../../models/inspector';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import   $ from 'jquery';

@Component({
  selector: 'set-modal-inspector',
  templateUrl: './modal-inspector.component.html',
  styleUrls: ['./modal-inspector.component.css']
})
export class ModalInspectorComponent implements OnInit {
  
  model: Inspector;
  listColegiatura = [];
  listInspector = [];
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  //id_seguimientoMonitoreoObra: number;
  id_seguimientoEjecucionExpediente:number;
  bsConfig: any;
  respInspector;
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
    this.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina);
  }

  listarColegiatura() {
    this.fs.maestraService.listarTipoColegiatura().subscribe(
      respuesta => {
        this.listColegiatura = respuesta as any;
      }
    )
  }

  listarInspector(id_seguimientoEjecucionExpediente, filas, paginas) {
    this.fs.inspectorService.listarInspector(id_seguimientoEjecucionExpediente, filas, paginas).subscribe(
      respuesta => {
        this.respInspector = respuesta as any;
        this.listInspector = this.respInspector[0].inspectores != null ? this.respInspector[0].inspectores : [];
        this.totalRegistros = this.respInspector[0].cantidad;
      }
    )
  }

  closeModal() {
    this.emitResponsable.emit(this.id_seguimientoEjecucionExpediente);
    this.modalRef.hide();
  }

  setControles() {
    this.model = new Inspector();
    this.file = null;
    $('input[name="fileinspector"], #fileinspector').val("");
    const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
    if(imagen!=undefined){
      imagen.src = '';
    }
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina);
  }

  modificarInspector(model, form) {
    if(model.nombres==null || model.nombres==""){
      this.funciones.mensaje("warning","Debe ingresar el nombre del responsable");
      return;
    }
    if(model.apellidos==null || model.apellidos==""){
      this.funciones.mensaje("warning","Debe ingresar los apellidos del responsable");
      return;
    }
    this.bMostrar = true;
    //actualizar
    if (model.id_inspector_seguimiento_expediente != undefined) {
      model.usuario_modificacion = sessionStorage.getItem("Usuario");
      this.fs.inspectorService.actualizarInspector(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina);
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
      model.id_seguimiento_ejecucion_expediente = this.id_seguimientoEjecucionExpediente;
      //model.id_tipo_colegiatura_expediente=2;
      this.fs.inspectorService.registrarInspector(model, this.file).subscribe(
        respuesta => {
          if (respuesta > 0) {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
            this.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina);
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

  editarInspector(model) {
    this.setControles();
    this.model = Object.assign({}, model);
    this.model.fecha_designacion = this.funciones.ConvertStringtoDateDB(model.fecha_designacion);
    this.nombreArchivo=model.nombre_archivo;
    this.ValidarInformacionReniec();
    $('input[name="fileinspector"]').val(model.nombre_archivo);
  }

  eliminarInspector(model) {
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        model.usuario_eliminacion = sessionStorage.getItem("Usuario");
        let strData = { id_inspector_seguimiento_expediente: model.id_inspector_seguimiento_expediente, usuario_eliminacion: model.usuario_eliminacion }
        this.fs.inspectorService.eliminarInspector(strData).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina);
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

  limpiarControles() {
    const imagen: HTMLImageElement = document.getElementsByName('imgFoto')[0] as HTMLImageElement;
    imagen.src = '';
  }

  lstResponsables =[];
  ValidarInformacionReniec() {
    let valDni = this.model.dni;
    let cant=0;
    if (valDni == "" || valDni == null) {
      document.getElementById("dni").focus();
      this.funciones.mensaje("info", "Debe ingresar el N°  DNI a validar.");
    } else {
      this.fs.inspectorService.listarInspector(this.id_seguimientoEjecucionExpediente, this.num_filas, this.numero_Pagina).subscribe(
        (respuesta:any) => {
          this.lstResponsables = respuesta[0].inspectores;
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
         // }else{
            //this.funciones.mensaje("info", "El DNI ingresado ya se encuentra registrado.");
          //}
        }
      )
    }
  }


}
