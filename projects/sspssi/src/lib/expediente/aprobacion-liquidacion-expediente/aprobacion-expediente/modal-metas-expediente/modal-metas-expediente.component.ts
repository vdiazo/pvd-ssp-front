import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { MaestraSsiService } from 'projects/sspssi/src/servicios/maestra-ssi.service';
import { MetasProyectoService } from 'projects/sspssi/src/servicios/expediente/liquidacion-cierre/metas-proyecto.service';

@Component({
  selector: 'ssi-modal-metas-expediente',
  templateUrl: './modal-metas-expediente.component.html',
  styleUrls: ['./modal-metas-expediente.component.css']
})
export class ModalMetasExpedienteComponent implements OnInit {

  idAprobacionExpediente: number;
  formRegistroMetasExpediente: FormGroup;
  entidadEditar: any;
  cambiarEditar = false;
  listaTipoInfraestructura: any = [];
  listaTipoVia: any = [];
  listaUnidadMedida: any = [];
  listaMetasRegistro: any = [];
  contador = 0;
  @Output() retornoValoresMetasExpediente = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, public funciones: Functions, private ssMaestra: MaestraSsiService, private metasExpedienteService: MetasProyectoService) {
    this.formRegistroMetasExpediente = this.fb.group({
      id_meta_proyecto: [0],
      id_aprobacion_expediente: [0],
      id_tipo_infraestructura: [null, Validators.required],
      longitud: [null, Validators.required],
      id_unidad_medida: [null, Validators.required],
      id_tipo_via: [null, Validators.required],
      codigo_ruta: [null],
      plazo_ejecucion: [null, Validators.required],
      num_carriles: [null],
      ancho_infraestructura: [null],
      observacion: [null],
    });
  }

  ngOnInit() {
    this.listarUnidades();
    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      const tempEditar = JSON.parse(JSON.stringify(this.entidadEditar));
      this.formRegistroMetasExpediente.patchValue(tempEditar);
    } else {
      this.formRegistroMetasExpediente.patchValue({
        id_aprobacion_expediente: this.idAprobacionExpediente,
      });
    }
  }

  registrarMetasExpediente() {
    const metasEnvio = Object.assign({}, this.formRegistroMetasExpediente.value);
    metasEnvio.longitud = this.funciones.castToFloat(metasEnvio.longitud);
    metasEnvio.num_carriles = metasEnvio.num_carriles == null ? 0 : metasEnvio.num_carriles;
    metasEnvio.ancho_infraestructura = metasEnvio.ancho_infraestructura == null ? 0 : metasEnvio.ancho_infraestructura;
    if (this.cambiarEditar) {
      // editar
      metasEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      this.metasExpedienteService.modificarMetasProyectoExpediente(metasEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresMetasExpediente.emit(this.idAprobacionExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      // registrar
      metasEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      this.metasExpedienteService.registrarMetasProyectoExpediente(metasEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresMetasExpediente.emit(this.idAprobacionExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  listarUnidades() {
    this.ssMaestra.listarTipoInfraestructura().subscribe(
      data => {
        this.listaTipoInfraestructura = data;
      }
    );
    this.ssMaestra.listarUnidadMedidas().subscribe(
      data => {
        this.listaUnidadMedida = data;
      }
    );
    this.ssMaestra.listarTipoVia().subscribe(
      data => {
        this.listaTipoVia = data;
      }
    );
  }

  agregarMetas() {
    this.contador++;
    let meta = {
      id_meta: 0,
      descripcion: this.contador,
      material: '',
      cantidad: '',
      unidad: ''
    };
    this.listaMetasRegistro.push(meta);
  }

  editarMeta(meta: any) {

  }

  anularMeta(index: number) {
    this.listaMetasRegistro.splice(index, 1);
  }

  closeModal() {
    this.bsModal.hide();
  }

}
