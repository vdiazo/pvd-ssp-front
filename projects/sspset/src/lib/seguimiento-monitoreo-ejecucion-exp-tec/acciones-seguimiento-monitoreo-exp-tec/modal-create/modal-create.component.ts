import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FacadeService } from '../../../patterns/facade.service';
import { Funciones } from '../../../../appSettings/funciones';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tipoArchivo } from '../../../../appSettings/enumeraciones';

@Component({
  selector: 'set-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css']
})
export class ModalCreateComponent implements OnInit {

  formGroup: FormGroup;
  idSeguimientoMonitoreoObra: number;
  idFase: number;
  perfil: string
  listaTipoDocumento = [];
  listaAccionesSeguimiento = [];
  nombreArchivo: string = "";
  tipoArchivo: number = tipoArchivo.accionSeguimientoMonitoreo;
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
      //id_seguimiento_ejecucion_expediente: this.idSeguimientoMonitoreoObra,
      fecha: '',
      descripcion: '',
      id_tipo_documento_detalle_expediente: 0,
      nombre_archivo: '',
      id_fase: this.idFase,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      perfil: this.perfil,
      id_tipo_accion_expediente:0,
    })

    this.listarControlSeleccion();
  }

  listarControlSeleccion() {

    this.fs.accionSeguimientoMonitoreoExpTecService.listarAccionesSeguimiento().subscribe(
      data => {
        this.listaAccionesSeguimiento = data.tipo_accion_expediente as any[];
        this.listaTipoDocumento=data.tipo_documento_detalle_expediente as any[];
      }
    );
  }

  fileChangeEvent(evento: any) {
    if (evento.sizeOK == true && evento.extensionOK == true) {
      this.file = evento;
      this.nombreArchivo=evento.file.name;
    }
  }

  save() {
    this.bMostrar = true;
    this.formGroup.patchValue(
      {
        nombre_archivo:this.nombreArchivo,
      }
    )
    if (this.validarControles(this.formGroup)) {
      this.fs.accionSeguimientoMonitoreoExpTecService.registar(this.formGroup.value,this.file).subscribe(
        data => {
          if (data == 0) {
            this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
          }
          else {
            this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
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
