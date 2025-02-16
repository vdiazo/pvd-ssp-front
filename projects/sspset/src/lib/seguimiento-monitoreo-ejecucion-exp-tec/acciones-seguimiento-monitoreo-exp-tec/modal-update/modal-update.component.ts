import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FacadeService } from '../../../patterns/facade.service';
import { Funciones } from '../../../../appSettings/funciones';
import { BsModalRef } from 'ngx-bootstrap/modal'; 
import { tipoArchivo } from '../../../../appSettings/enumeraciones';
import $ from 'jquery';


@Component({
  selector: 'set-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.css']
})
export class ModalUpdateComponent implements OnInit {

  formGroup: FormGroup;
  idSeguimientoMonitoreoObra: number;
  listaTipoDocumento = [];
  nombreArchivo: string = "";
  tipoArchivo: number = tipoArchivo.accionSeguimientoMonitoreo;
  editRow: any
  perfil: string
  listaAccionesSeguimiento: any[];
  @Output() retornoValores = new EventEmitter();
  bMostrar: boolean = false;

  file : any;

  fechaDesignaconMax: string = "";
  diaHoy:any;
  diaInicial:any;

  constructor(private fb: FormBuilder,
    public funciones: Funciones,
    private fs: FacadeService,
    public modalRef: BsModalRef) { }

  ngOnInit() {
    this.diaHoy=new Date();
    this.diaInicial=new Date(this.diaHoy.getFullYear(), this.diaHoy.getMonth(), this.diaHoy.getDate());
    this.fechaDesignaconMax=this.diaInicial;

    this.formGroup = this.fb.group({
      id_accion_seguimiento_ejecucion_expediente: this.editRow.id_accion_seguimiento_ejecucion_expediente,
      //id_seguimiento_monitoreo_obra: this.idSeguimientoMonitoreoObra,
      id_tipo_accion_expediente: this.editRow.id_tipo_accion_expediente,
      fecha: this.funciones.formatDate(this.editRow.fecha),
      descripcion: this.editRow.descripcion,
      id_tipo_documento_detalle_expediente: this.editRow.id_tipo_documento_detalle_expediente,
      nombre_archivo: this.editRow.nombre_archivo,
      id_fase: this.editRow.id_fase,
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      perfil: this.perfil
    })

    this.listarControlSeleccion();
  }

  listarControlSeleccion() {
    /*this.fs.maestraService.listarTipoDocumento().subscribe(
      data => {
        this.listaTipoDocumento = data as any[];
      }
    );

    this.fs.accionSeguimientoMonitoreoExpTecService.listarAccionesSeguimiento().subscribe(
      data => {
        this.listaAccionesSeguimiento = data as any[];
      }
    );*/
    this.fs.accionSeguimientoMonitoreoExpTecService.listarAccionesSeguimiento().subscribe(
      data => {
        this.listaAccionesSeguimiento = data.tipo_accion_expediente as any[];
        this.listaTipoDocumento=data.tipo_documento_detalle_expediente as any[];
      }
    );
  }

  /*fileChangeEvent(rpta: any) {
    if (rpta.uploaded != null) {
      this.nombreArchivo = rpta.uploaded._body;
      this.formGroup.patchValue({
        nombre_archivo: this.nombreArchivo
      });
    }
  }*/

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
      this.nombreArchivo=evento.file.name;
    }
  }

  save() {
    this.bMostrar = true;

    this.formGroup.patchValue({
      nombre_archivo: (this.nombreArchivo == '' ? this.editRow.nombre_archivo : this.editRow.nombre_archivo),
    })

    if (this.validarControles(this.formGroup)) {
      $('input[name="fileInsert"]').val(this.editRow.nombre_archivo);
      this.formGroup.value.fecha.length != undefined ? this.formGroup.value.fecha = this.funciones.ConvertStringtoDate(this.formGroup.value.fecha) : this.formGroup.value.fecha;
      //this.formGroup.value.usuario_eliminacion = sessionStorage.getItem("Usuario");
      this.fs.accionSeguimientoMonitoreoExpTecService.actualizar(this.formGroup.value,this.file).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
            this.retornoValores.emit(true);
            this.modalRef.hide();
          }
          this.bMostrar = false;
        }
      )
    }
    else {
      this.bMostrar = false;
    }
  }

  validarControles(datosFormulario: FormGroup) {
    try {
      let BreakException = {
        controles: 'Ingrese todos los campos con (*)',
      };

      if (datosFormulario.get("id_tipo_accion_expediente").value == 0) throw BreakException.controles;
      if (datosFormulario.get("fecha").value == "") throw BreakException.controles;
      if (datosFormulario.get("descripcion").value == "") throw BreakException.controles;
      if (datosFormulario.get("id_tipo_documento_detalle_expediente").value == 0) throw BreakException.controles;
      if (datosFormulario.get("nombre_archivo").value == "") throw BreakException.controles;
    } catch (e) {
      this.funciones.mensaje("info", e);
      return false;
    }
    return true;
  }

  closeModal() {
    this.modalRef.hide();
  }

}
