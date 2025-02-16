import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConvenioService } from 'projects/sspssi/src/servicios/convenio.service';


@Component({
  selector: 'ssi-modal-registro-tramo',
  templateUrl: './modal-registro-tramo.component.html',
  styleUrls: ['./modal-registro-tramo.component.css']
})
export class ModalRegistroTramoComponent implements OnInit {

  formRegistrarTramo: FormGroup;
  lstCodigoRuta: any = [];
  tramosVer: any = [];
  tramosAgregados: any = [];
  ejecutoras: any = [];
  fases: any = [];
  entidadEditar: any;
  idMunicipalidad: any;
  visibleEjecutora = false;
  strCodigoRuta = '';
  visible = false;
  @Output() emiteRespuesta = new EventEmitter();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef, private convenioService: ConvenioService, public funciones: Functions) {
    this.formRegistrarTramo = this.fb.group({
      id_tramo: [],
      nombre_tramo: [],
      id_ejecutora: [],
      id_tipo_fase: [null],
      nombre_fase: [],
      codigo_ruta: []
    });
  }

  ngOnInit() {
    if (this.entidadEditar != null) {
      if (this.entidadEditar.id_tramo != 0) this.visible = true;
      this.formRegistrarTramo.patchValue({
        id_tramo: this.entidadEditar.id_tramo,
        nombre_tramo: this.entidadEditar.nombreTramo,
        id_ejecutora: this.entidadEditar.idEjecutora,
        nombre_ejecutora: this.entidadEditar.nombreEjecutora,
        id_tipo_fase: this.entidadEditar.idTipoFase,
        nombre_fase: this.entidadEditar.nombreFase,
      });
      if (this.entidadEditar.idEjecutora != 0 && this.entidadEditar.nombreEjecutora != '') {
        this.listarEjecutora(this.idMunicipalidad);
        this.visibleEjecutora = true;
      }
      this.strCodigoRuta = this.entidadEditar.codigo_ruta;
      if (this.strCodigoRuta != '') { this.lstCodigoRuta = this.strCodigoRuta.split(','); }
    }
  }

  listarEjecutora(idMunicipalidad) {
    this.convenioService.ListarEjecutora(idMunicipalidad).subscribe(
      response => {
        this.ejecutoras = response;
      }
    )
  }

  guardarTramo() {
    let tramoReturn = Object.assign({}, this.formRegistrarTramo.value);
    let idTipoFase = this.formRegistrarTramo.get("id_tipo_fase").value;
    let id_ejecutora = this.formRegistrarTramo.get("id_ejecutora").value == null ? 0 : this.formRegistrarTramo.get("id_ejecutora").value;
    let nombreEjecutora = '';
    let entidadfase = this.fases.find(x => {
      return x.id_tipo_fase == idTipoFase
    });

    if (id_ejecutora != 0) {
      let ejecutora = this.ejecutoras.find(x => {
        return x.id_ejecutora == id_ejecutora
      });

      nombreEjecutora = ejecutora.nombre_ejecutora;
    }

    tramoReturn.nombre_fase = entidadfase.nombre_tipo_fase;
    tramoReturn.nombre_ejecutora = nombreEjecutora;
    tramoReturn.codigo_ruta = this.strCodigoRuta;

    this.emiteRespuesta.emit(tramoReturn);
    this.closeModalGuardarTramo();
  }

  agregarCodigoRuta() {
    let valCodigoRuta = this.formRegistrarTramo.get("codigo_ruta").value;
    if (valCodigoRuta.trim() == "" || valCodigoRuta == null) {
      document.getElementById("txtCodigoRuta").focus();
      this.funciones.mensaje("info", "Debe ingresar el código de Ruta.");
    } else {

      if (this.lstCodigoRuta.find(x => x == valCodigoRuta.trim()) != null) {
        this.funciones.mensaje("info", "El código de Ruta ya fue ingresado.");
        return;
      }
      this.strCodigoRuta = "";
      this.lstCodigoRuta.push(valCodigoRuta);
      let cont = 0;
      this.lstCodigoRuta.forEach(element => {
        if (cont == 0) {
          this.strCodigoRuta = this.strCodigoRuta + element;
        } else {
          this.strCodigoRuta = this.strCodigoRuta + "," + element;
        }
        cont++;
      });

      this.formRegistrarTramo.patchValue({ codigo_ruta: null });
    }
  }
  eliminarCodigoRuta(index) {
    if (this.lstCodigoRuta != null) {
      this.lstCodigoRuta.splice(index, 1);
      let cont = 0;
      this.strCodigoRuta = "";
      this.lstCodigoRuta.forEach(element => {
        if (cont == 0) {
          this.strCodigoRuta = this.strCodigoRuta + element;
        } else {
          this.strCodigoRuta = this.strCodigoRuta + "," + element;
        }
        cont++;
      });
    }
  }

  closeModalGuardarTramo() {
    this.formRegistrarTramo.reset();
    this.modalRef.hide();
  }
}
