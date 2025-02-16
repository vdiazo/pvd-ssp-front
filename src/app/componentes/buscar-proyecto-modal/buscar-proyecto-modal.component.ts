import { OnInit, Component, ViewEncapsulation, TemplateRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MaestraService } from "src/app/services/maestra.service";
import { Functions, tipoArchivo } from "src/app/appSettings";
import { ConvenioRegistrar } from "src/app/models/Convenio";
import { ConvenioService } from "src/app/services/convenio.service";
import { SosemService } from "src/app/services/sosem.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IConvenio, IListBETmSsppvdTramo, IConvenioData, IConvenioListado } from "src/app/Interfaces";

@Component({
  selector: 'app-buscar-proyecto-modal',
  templateUrl: './buscar-proyecto-modal.component.html',
  styleUrls: ['./buscar-proyecto-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BuscarProyectoModalComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadEditar: IConvenioData
  formGroup: FormGroup
  formRegistrarTramo: FormGroup
  documentos: any = [];
  denominacion: any = [];
  maxDate = new Date();
  entidadModal: ConvenioRegistrar;
  IdTipoArchivo: number = tipoArchivo.convenio;
  infraestructuras: any = [];
  vias: any = [];
  medidas: any = [];
  municipalidades: any = [];
  fases: any = [];
  tramos: any = [];
  tramosAgregados: any[] = [];

  constructor(private fb: FormBuilder,
    private maestraService: MaestraService,
    public funciones: Functions,
    public conveniopost: ConvenioService,
    private sosem: SosemService,
    private modalService: BsModalService,
    public modalRefPantallaGeneral: BsModalRef) {

  }

  ngOnInit(): void {
    this.entidadModal = new ConvenioRegistrar();

    this.construirForm();
    this.listarTipoDocumentos();
    this.listarDenominacion();
    this.listarTipoInfraestructura();
    this.listarTipoVias();
    this.listarMunicipalidades();
    this.listarFases();
    this.listarTipoMedidas();

    if (this.entidadEditar != null) {
      this.poblarInformacionConvenioEdicion();
    }

  }
  poblarInformacionConvenioEdicion(): any {
    this.formGroup.controls["codigo_snip"].setValue(this.entidadEditar.cod_snip.toString());
    this.ExtraerInfo();

    this.formGroup.patchValue({
      id_convenio: this.entidadEditar.id_convenio,
      fecha_firma: this.entidadEditar.fecha_firma,
      fecha_vigencia: this.entidadEditar.fecha_vigencia,
      id_documento_compromiso: this.entidadEditar.id_documento_compromiso,
      id_fuente_financiamiento: this.entidadEditar.id_fuente_financiamiento,
      id_tipo_infraestructura: this.entidadEditar.id_tipo_infraestructura,
      id_tipo_via: this.entidadEditar.id_tipo_via,
      id_unidad_medida: this.entidadEditar.id_unidad_medida,
      longitud: this.entidadEditar.longitud,
      monto: this.entidadEditar.monto,
      siglas: this.entidadEditar.siglas,
      nombre_archivo: this.entidadEditar.archivo_convenio,
      numero_tramos: 1,
      id_municipalidad_anterior: this.entidadEditar.id_municipalidad,
      proyectoGroup: this.fb.group({
        activo: true,
        id_municipalidad: this.formGroup.get("id_municipalidad_anterior").value,// this.entidadEditar.id_municipalidad,
        id_ejecutora: this.entidadEditar.id_ejecutora,
        TramoGroupList: this.fb.array([])
      })
    })

    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    for (let index = 0; index < this.entidadEditar.proyecto.length; index++) {
      const element = this.entidadEditar.proyecto[index];
      array.push(this.construirTramo(element.id_tramo, element.id_fase, element.nombre_tramo, element.id_ejecutora, element.id_municipalidad, element.nombre_tramo));

      this.tramosAgregados.push({
        id_tramo: element.id_tramo,
        nombreTramo: element.nombre_tramo,
        nombreFase: element.nombre_tipo_fase,
        nombreEjecutora: element.ejecutora
      })
    }


    this.boldConvenio = false;
    this.boldAdenda = false;
    this.boldDecretoUrgencia = false;

    this.maestraService.listarTipoDocumentoCompromiso().subscribe(
      (data: any) => {

        let documento = data.find(x => {
          return x.id_documento_compromiso == this.entidadEditar.id_documento_compromiso;
        })

        if (documento.nombre_documento_compromiso.toString().toUpperCase() == "CONVENIO") {
          this.boldConvenio = true;
        } else if (documento.nombre_documento_compromiso.toString().toUpperCase() == "ADENDA") {
          this.boldAdenda = true;
        } else {
          this.boldDecretoUrgencia = true;
        }
      }
    )
  }

  idMunicipalidadPreviousValue;


  public construirForm() {
    this.formGroup = this.fb.group(
      {
        id_convenio: 0,
        codigo_snip: [null, Validators.required],
        fecha_firma: [null, Validators.required],
        fecha_vigencia: [null, Validators.required],
        id_documento_compromiso: [null, Validators.required],
        id_fuente_financiamiento: [null, Validators.required],
        id_tipo_infraestructura: [null, Validators.required],
        id_tipo_via: [null, Validators.required],
        id_unidad_medida: [null, Validators.required],
        longitud: [null, Validators.required],
        monto: [null, Validators.required],
        siglas: [null, Validators.required],
        nombre_archivo: [null, Validators.required],
        numero_tramos: [null, Validators.compose([Validators.required, Validators.min(1)])],
        id_municipalidad_anterior: [null],
        proyectoGroup: this.fb.group({
          id_proyecto: [null, Validators.required],
          cod_snip: [null, Validators.required],
          cod_unificado: [null, Validators.required],
          nombre_proyecto: [null, Validators.required],
          activo: true,
          id_municipalidad: [null, Validators.required],
          id_ejecutora: [0, Validators.required],
          TramoGroupList: this.fb.array([])
        })
      }
    )

    this.formRegistrarTramo = this.fb.group({
      id_tramo: [null, Validators.required],
      nombre_tramo: [null, Validators.required],
      id_tipo_fase: [null, Validators.required],
      id_ejecutora: [null, Validators.required],
    })

    this.formGroup.controls["id_documento_compromiso"].valueChanges.subscribe(
      data => {

        this.boldConvenio = false;
        this.boldAdenda = false;
        this.boldDecretoUrgencia = false;

        if (this.documentos != null && this.documentos.length > 0) {
          let documento = this.documentos.find(x => {
            return x.id_documento_compromiso == data;
          })

          if (documento.nombre_documento_compromiso.toString().toUpperCase() == "CONVENIO") {
            this.boldConvenio = true;
          } else if (documento.nombre_documento_compromiso.toString().toUpperCase() == "ADENDA") {
            this.boldAdenda = true;
          } else {
            this.boldDecretoUrgencia = true;
          }
        }
      }
    )
  }

  boldConvenio: boolean = false;
  boldAdenda: boolean = false;
  boldDecretoUrgencia: boolean = false;


  listarTipoDocumentos() {
    this.maestraService.listarTipoDocumentoCompromiso().subscribe(
      data => {
        this.documentos = data;
      }
    )
  }

  listarDenominacion() {
    this.maestraService.listarDenominacion().subscribe(
      data => {
        this.denominacion = data;
      }
    )
  }

  listarTipoInfraestructura() {
    this.maestraService.listarTipoInfraestructura().subscribe(
      data => {
        this.infraestructuras = data;
      }
    )
  }

  listarTipoVias() {
    this.maestraService.listarTipoVia().subscribe(
      data => {
        this.vias = data;
      }
    )
  }

  listarTipoMedidas() {
    this.maestraService.listarUnidadMedidas().subscribe(
      data => {
        this.medidas = data;
      }
    )
  }

  listarMunicipalidades() {
    this.maestraService.listarMunicipalidad().subscribe(
      data => {
        this.municipalidades = data;
      }
    )
  }

  listarFases() {
    this.maestraService.listarTipoFases().subscribe(
      data => {
        this.fases = data;
      }
    )
  }


  get codigoSnip(): any {
    return this.formGroup.get("codigo_snip");
  }

  get codigoMunicipalidad(): any {
    return this.formGroup.get("proyectoGroup.id_municipalidad");
  }

  visible: boolean = false;
  ExtraerInfo() {

    let codigoSnip = this.codigoSnip.value;

    if (this.formGroup.get("proyectoGroup.nombre_proyecto").value != null) {
      this.funciones.alertaRetorno("question", "Al buscar un nuevo proyecto se restableceran todos los valores ingresados, ¿Esta de acuerdo?", "", true, (respuesta) => {
        if (respuesta.value) {
          this.formGroup.reset();
          this.limpiarMatrizTramos();
          this.tramosAgregados = [];
          this.buscarInfoProyecto(codigoSnip);
          return;
        } else {
          this.formGroup.patchValue({
            codigo_snip: this.formGroup.get("proyectoGroup.cod_snip").value
          })
        }
      });
    }
    else {
      this.buscarInfoProyecto(codigoSnip);
    }
  }

  buscarInfoProyecto(codigoSnip) {
    let idproyecto = 0;
    let nomProyecto = "";
    let codProyecto = 0;

    if (codigoSnip != "") {
      this.conveniopost.BusquedaProyecto(codigoSnip, 0).subscribe(
        (data: any) => {
          if (data == "") {
            this.sosem.BuscarProyectoSosem(codigoSnip, "0").subscribe(
              (data: any) => {
                if (data != null) {
                  // if (data.InfoPorSNIP.Snip != null) {
                  //   nomProyecto = data.InfoPorSNIP.Snip.Nombre;
                  //   codProyecto = data.InfoPorSNIP.Siaf != null ? data.InfoPorSNIP.Siaf[0].CodigoSiaf : data.InfoPorSNIP.Snip.CodigoUnico;
                  //   this.tramos = [];

                  // } else if (data.InfoPorSNIP.Siaf != null) {
                  //   nomProyecto = data.InfoPorSNIP.Siaf[0].Nombre;
                  //   codProyecto = data.InfoPorSNIP.Siaf[0].CodigoSiaf;
                  //   this.tramos = [];
                  // } 
                  if (data != null) {
                    nomProyecto = data.Nombre;
                    codProyecto = data.CodigoSnip;
                    this.tramos = [];
                  }
                  else {
                    this.funciones.alertaSimple("info", "", "No se encontro ninguna  información de Proyecto con el Código Ingresado.", true);
                    this.formGroup.patchValue({
                      proyectoGroup: {
                        id_proyecto: null,
                        cod_snip: null,
                        cod_unificado: null,
                        nombre_proyecto: null,
                      }
                    })
                    return;
                  }
                  this.visible = false;
                  this.ocultar();
                  this.poblarDataProyecto(idproyecto, nomProyecto, codProyecto, codigoSnip);
                } else {
                  this.funciones.alertaSimple("info", "", "No se encontro ninguna  información de Proyecto con el Código Ingresado.", true);
                  this.formGroup.patchValue({
                    proyectoGroup: {
                      id_proyecto: null,
                      cod_snip: null,
                      cod_unificado: null,
                      nombre_proyecto: null,
                    }
                  })
                }
              }
            )
          }
          else {
            idproyecto = data.proyecto.id_proyecto;
            nomProyecto = data.proyecto.nombre_proyecto;
            codProyecto = data.proyecto.cod_unificado;
            this.tramos = data.proyecto.tramos;
            this.poblarDataProyecto(idproyecto, nomProyecto, codProyecto, codigoSnip);
            this.visible = false;
            this.ocultar();
          }
        }
      )
    }
  }

  poblarDataProyecto(idProyecto: number, nombre_proyecto: string, codProyecto, codigoSnip: string) {
    this.formGroup.patchValue({
      proyectoGroup: {
        id_proyecto: idProyecto,
        cod_snip: codigoSnip,
        cod_unificado: codProyecto,
        nombre_proyecto: nombre_proyecto,
        id_municipalidad: (this.entidadEditar != null ? this.entidadEditar.id_municipalidad : null),
        activo: true
      }
    })
  }

  limpiarMatrizTramos() {
    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");
    while (array.length !== 0) {
      array.removeAt(0)
    }
  }

  ejecutoras: any = [];
  visibleEjecutora: boolean;

  listarEjecutora_() {
    let idMunicipalidad = this.codigoMunicipalidad.value;

    if (this.tramosAgregados.length > 0) {
      this.funciones.alertaRetorno("question", "Al seleccionar una diferente Unidad Ejecutora se eliminaran los tramos, ¿Está de acuerdo?", "", true, (respuesta) => {
        if (respuesta.value) {
          this.tramosAgregados = [];
          this.limpiarMatrizTramos();
          this.formGroup.controls["id_municipalidad_anterior"].setValue(idMunicipalidad);
        } else {
          this.formGroup.controls["proyectoGroup"].patchValue({
            id_municipalidad: this.formGroup.get("id_municipalidad_anterior").value
          })
          return;
        }
      });
    } else {

      this.formGroup.controls["id_municipalidad_anterior"].setValue(idMunicipalidad);

      this.conveniopost.ListarEjecutora(idMunicipalidad).subscribe(
        response => {
          this.ejecutoras = response;
          if (this.ejecutoras == '{ \"data\":[{}]}') {
            this.visibleEjecutora = false;
            this.ejecutoras = null;
            this.formRegistrarTramo.patchValue({
              id_ejecutora: 0
            });
          }
          else {
            this.visibleEjecutora = true;
            this.formRegistrarTramo.controls["id_ejecutora"].setValidators(Validators.required);
          }
        }
      )

      this.formRegistrarTramo.updateValueAndValidity();
    }

  }
  listarEjecutora(e: any) {
    if (e != undefined) {
      let idMunicipalidad = this.codigoMunicipalidad.value;

      if (this.tramosAgregados.length > 0) {
        this.funciones.alertaRetorno("question", "Al seleccionar una diferente Unidad Ejecutora se eliminaran los tramos, ¿Está de acuerdo?", "", true, (respuesta) => {
          if (respuesta.value) {
            this.tramosAgregados = [];
            this.limpiarMatrizTramos();
            this.formGroup.controls["id_municipalidad_anterior"].setValue(idMunicipalidad);
          } else {
            this.formGroup.controls["proyectoGroup"].patchValue({
              id_municipalidad: this.formGroup.get("id_municipalidad_anterior").value
            })
            return;
          }
        });
      } else {

        this.formGroup.controls["id_municipalidad_anterior"].setValue(idMunicipalidad);

        this.conveniopost.ListarEjecutora(idMunicipalidad).subscribe(
          response => {
            this.ejecutoras = response;
            if (this.ejecutoras == '{ \"data\":[{}]}') {
              this.visibleEjecutora = false;
              this.ejecutoras = null;
              this.formRegistrarTramo.patchValue({
                id_ejecutora: 0
              });
            }
            else {
              this.visibleEjecutora = true;
              this.formRegistrarTramo.controls["id_ejecutora"].setValidators(Validators.required);
            }
          }
        )
        this.formRegistrarTramo.updateValueAndValidity();
      }
    }
  }

  modalRef: BsModalRef;
  agregarTramo(template: TemplateRef<any>) {
    this.visible = false;
    this.ocultar();
    this.modalRef = this.modalService.show(template);
  }

  ocultar() {
    this.formRegistrarTramo.reset();

    if (this.visible) {
      this.visible = false; // aqui se oculta el combo y se requiere el nombre

      this.formRegistrarTramo.controls["nombre_tramo"].setValidators(Validators.required);
      this.formRegistrarTramo.updateValueAndValidity();

      this.formRegistrarTramo.patchValue({
        id_tramo: 0,
        nombre_tramo: null
      });
    } else {
      this.visible = true; // aqui se muestra el combo
      this.formRegistrarTramo.controls["id_tramo"].setValidators(Validators.required);
      this.formRegistrarTramo.controls["nombre_tramo"].clearValidators();

      this.formRegistrarTramo.patchValue({
        id_tramo: null,
        nombre_tramo: ""
      });

    }

    if (this.visibleEjecutora) {
      this.formRegistrarTramo.controls["id_ejecutora"].setValidators(Validators.required);
    }
    else {
      this.formRegistrarTramo.controls["id_ejecutora"].clearValidators();
    }

    this.formRegistrarTramo.updateValueAndValidity();

  }

  closeModalGuardarTramo() {
    this.formRegistrarTramo.reset();
    this.modalRef.hide();
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRefPantallaGeneral.hide();
  }

  guardarTramo() {
    let tramoId = this.formRegistrarTramo.get("id_tramo").value;
    let nombre_tramo = this.formRegistrarTramo.get("nombre_tramo").value;

    // Validamos si el tramo ya existe en mi colección
    if (this.tramosAgregados.length > 0 && tramoId != 0) {
      let existeTramoAgregado = this.tramosAgregados.find(x => {
        return x.id_tramo == tramoId;
      })

      if (existeTramoAgregado) {
        this.funciones.alertaSimple("warning", "No puede registrar 2 veces el mismo Tramo.", "", true);
        return;
      }
    } else if (this.tramosAgregados.length > 0 && tramoId == 0) {
      let existeTramoAgregado = this.tramosAgregados.find(x => {
        return x.nombreTramo == nombre_tramo;
      })

      if (existeTramoAgregado) {
        this.funciones.alertaSimple("warning", "No puede registrar 2 veces el mismo Tramo con el mismo Nombre", "", true);
        return;
      }
    }

    let idTipoFase = this.formRegistrarTramo.get("id_tipo_fase").value;
    let id_ejecutora = this.formRegistrarTramo.get("id_ejecutora").value == null ? 0 : this.formRegistrarTramo.get("id_ejecutora").value;

    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    array.push(this.construirTramo(tramoId, idTipoFase, nombre_tramo, id_ejecutora, this.codigoMunicipalidad.value, nombre_tramo));

    this.visible = false;
    this.ocultar();

    let tramo = this.tramos.find(x => {
      return x.id_tramo == tramoId
    })

    let entidadfase = this.fases.find(x => {
      return x.id_tipo_fase == idTipoFase
    });

    let nombreEjecutora = "";
    if (id_ejecutora != 0) {
      let ejecutora = this.ejecutoras.find(x => {
        return x.id_ejecutora == id_ejecutora
      });

      nombreEjecutora = ejecutora.nombre_ejecutora;
    }

    this.tramosAgregados.push({
      id_tramo: tramoId,
      nombreTramo: (tramoId == 0 ? nombre_tramo : tramo.nombre_tramo),
      nombreFase: entidadfase.nombre_tipo_fase,
      nombreEjecutora: nombreEjecutora
    })

    this.formGroup.patchValue({
      numero_tramos: this.tramosAgregados.length
    });

  }

  construirTramo(idtramo, idTipoFase, nombreTramo, idEjecutora, idMunicipalidad, descripcionTramo): FormGroup {
    return this.fb.group({
      id_tramo: idtramo,
      nombre_tramo: nombreTramo,
      descripcion_tramo: descripcionTramo,
      activo: true,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      FaseGroup: this.fb.group({
        id_tipo_fase: idTipoFase,
        usuario_creacion: sessionStorage.getItem("Usuario"),
        FaseConvenioGroup: this.fb.group({
          id_municipalidad: idMunicipalidad,
          id_ejecutora: idEjecutora,
          usuario_creacion: sessionStorage.getItem("Usuario")
        })
      })
    });
  }

  administrarConvenioRegistrar() {

    let myConvenio: IConvenio = {
      id_convenio: this.formGroup.get("id_convenio").value,
      fecha_firma: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.formGroup.get("fecha_firma").value)),
      fecha_vigencia: this.funciones.ConvertStringtoDate(this.funciones.formatDate(this.formGroup.get("fecha_vigencia").value)),
      id_documento_compromiso: this.formGroup.get("id_documento_compromiso").value,
      id_fuente_financiamiento: this.formGroup.get("id_fuente_financiamiento").value,
      id_tipo_infraestructura: this.formGroup.get("id_tipo_infraestructura").value,
      id_tipo_via: this.formGroup.get("id_tipo_via").value,
      id_unidad_medida: this.formGroup.get("id_unidad_medida").value,
      longitud: Number.parseFloat(this.formGroup.get("longitud").value.toString().replace(/,/g, "")),
      monto: Number.parseFloat(this.formGroup.get("monto").value.toString().replace(/,/g, "")),
      nombre_archivo: this.formGroup.get("nombre_archivo").value,
      siglas: this.formGroup.get("siglas").value,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      _BE_Tm_Ssppvd_Proyecto: {
        id_proyecto: this.formGroup.get("proyectoGroup.id_proyecto").value,
        cod_snip: this.formGroup.get("proyectoGroup.cod_snip").value,
        nombre_proyecto: this.formGroup.get("proyectoGroup.nombre_proyecto").value,
        activo: true,
        cod_unificado: this.formGroup.get("proyectoGroup.cod_unificado").value,
        usuario_creacion: sessionStorage.getItem("Usuario"),
        ListBE_Tm_Ssppvd_Tramo: this.obtenerListaTramos()
      }
    }

    this.conveniopost.ValidarConvenio(myConvenio).subscribe(
      data => {

        if (data == "") {
          this.conveniopost.registrarConvenioSosem(myConvenio).subscribe
            (
              data => {
                if (data == 0) {
                  this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
                }
                else {
                  this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                  this.retornoValores.emit(0);
                  this.modalRefPantallaGeneral.hide();
                }
              }
            )
        } else {
          this.funciones.alertaSimple("warning", "La siglas del convenio ya se encuentra registrada.", "Debe de ingresar otra siglas para el convenio", true);
        }
      }
    )
  }

  obtenerListaTramos(): IListBETmSsppvdTramo[] {
    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    let tramos: IListBETmSsppvdTramo[] = []

    for (let index = 0; index < array.length; index++) {
      let element: FormGroup = <FormGroup>array.at(index);
      let faseGroup: FormGroup = <FormGroup>element.controls["FaseGroup"];
      let faseConvenio: FormGroup = <FormGroup>faseGroup.controls["FaseConvenioGroup"];

      let idTramo: number = element.get("id_tramo").value;

      let tramo = this.tramos.find(x => {
        return x.id_tramo == idTramo
      })

      let item: IListBETmSsppvdTramo = {
        id_tramo: idTramo,
        activo: true,
        descripcion_tramo: (idTramo == 0 ? "" : tramo.nombre_tramo),
        nombre_tramo: (idTramo == 0 ? element.get("nombre_tramo").value : tramo.nombre_tramo),
        usuario_creacion: sessionStorage.getItem("Usuario"),
        usuario_modificacion: sessionStorage.getItem("Usuario"),
        _BE_Tm_Ssppvd_Fase: {
          id_tipo_fase: element.get("FaseGroup.id_tipo_fase").value,
          usuario_creacion: sessionStorage.getItem("Usuario"),
          _BE_Td_Ssppvd_Fase_Convenio: {
            id_municipalidad: faseConvenio.get("id_municipalidad").value,
            id_ejecutora: faseConvenio.get("id_ejecutora").value == null ? 0 : faseConvenio.get("id_ejecutora").value,
            usuario_creacion: sessionStorage.getItem("Usuario")
          }
        }
      }
      tramos.push(item);
    }

    return tramos;
  }

  fileChangeEvent(evento: any) {
    if (evento.uploaded != null) {
      this.formGroup.patchValue({
        nombre_archivo: evento.uploaded._body
      })
    }
  }

  eliminarTramo(index: number) {
    this.tramosAgregados.splice(index, 1);
    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");
    array.removeAt(index);

    this.formGroup.patchValue({
      numero_tramos: this.tramosAgregados.length
    });

    if (this.tramosAgregados.length == 0) {
      this.tramosAgregados = [];
    }
  }


}