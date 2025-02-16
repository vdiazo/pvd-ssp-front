import { OnInit, Component, ViewEncapsulation, TemplateRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConvenioRegistrar } from "../../../models/Convenio";
import { tipoArchivo } from "../../../appSettings/enumeraciones";
import { MaestraSsiService } from "../../../servicios/maestra-ssi.service";
import { Functions } from "../../../appSettings/functions";
import { ConvenioService } from "../../../servicios/convenio.service";
import { SosemService } from "../../../servicios/sosem.service";
import { IConvenioData, IConvenio, IListBETmSsppvdTramo } from "../../../interfaces/IConvenio";
import { ModalRegistroTramoComponent } from "../modal-registro-tramo/modal-registro-tramo.component";

@Component({
  selector: 'ssi-modal-registro-convenio',
  templateUrl: './modal-registro-convenio.component.html',
  styleUrls: ['./modal-registro-convenio.component.css']
})
export class ModalRegistroConvenioComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  @Output() toggle = new EventEmitter<any[]>();
  entidadEditar: IConvenioData
  formGroup: FormGroup
  formRegistrarTramo: FormGroup
  documentos: any = [];
  denominacion: any = [];
  maxDate = new Date();
  entidadModal: ConvenioRegistrar;
  IdTipoArchivo: number = tipoArchivo.convenio;
  IdTipoArchivoCompromiso: number = tipoArchivo.ConvenioActaCompromiso;
  activo: boolean = false;
  mostrarAdjuntarArchivoCompromiso: boolean = true;
  nombre_archivo_compromiso: string = "";

  infraestructuras: any = [];
  vias: any = [];
  estadoVias: any = [];
  medidas: any = [];
  municipalidades: any = [];
  fases: any = [];
  tramos: any = [];
  tramosAgregados: any[] = [];
  tramosVer: any[] = [];

  tipoInversion: any = [];
  programas: any = [];
  brechas: any = [];
  compromisos: any = [];
  lstCodigoRuta: any = [];
  strCodigoRuta: string = "";
  lstFuenteFinanciamiento: any = [];
  lstFuenteFinanciamientoEditar: any = [];
  fuentesAgregadas: any[] = [];
  MinFechaVigencia: Date;
  vActualizeActa: string = "";
  bOtroCompromiso = false;
  bSnip: boolean = false;

  constructor(private fb: FormBuilder,
    private maestraService: MaestraSsiService,
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
    this.listarEstadoTipoVias();
    this.listarMunicipalidades();
    this.listarFases();
    this.listarTipoMedidas();
    this.listarCompromisos();
    this.listarBrechas();
    this.listarProgramas();
    this.listarTipoInversion();

    this.formGroup.markAsUntouched();
    this.formGroup.markAsPristine();

    if (this.entidadEditar != null) {
      this.poblarInformacionConvenioEdicion();
    }
  }

  poblarInformacionConvenioEdicion(): any {
    this.formGroup.controls["codigo_snip"].setValue(this.entidadEditar.cod_snip.toString());
    this.ExtraerInfo();

    //let arrFinanciamientoObtener = new Array<IFinanciamientoObtener>();
    if (this.entidadEditar.fuente_financiamiento != null) {
      this.entidadEditar.fuente_financiamiento.forEach(element => {
        this.lstFuenteFinanciamiento.push(element.id_fuente_financiamiento);
        this.lstFuenteFinanciamientoEditar.push({ "id_convenio_financiamiento": element.id_convenio_financiamiento, "id_fuente_financiamiento": element.id_fuente_financiamiento })
      });
    }

    if (this.entidadEditar.nombre_archivo_acta_compromiso != "") {
      this.mostrarAdjuntarArchivoCompromiso = false;
      this.activo = true;
      this.formGroup.patchValue({
        checkCompromiso: this.activo
      });

    } else {
      this.mostrarAdjuntarArchivoCompromiso = true;
      this.activo = false;
      this.formGroup.patchValue({
        checkCompromiso: this.activo
      });

    }
    this.nombre_archivo_compromiso = this.entidadEditar.acta_compromiso;
    this.formGroup.patchValue({
      id_convenio: this.entidadEditar.id_convenio,
      fecha_firma: this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_firma),
      fecha_vigencia: this.funciones.ConvertStringtoDate(this.entidadEditar.fecha_vigencia),
      plazo_vigencia: this.calcularDiferencia(this.entidadEditar.fecha_firma, this.entidadEditar.fecha_vigencia),
      id_documento_compromiso: this.entidadEditar.id_documento_compromiso,
      id_fuente_financiamiento: this.entidadEditar.fuente_financiamiento,
      id_tipo_infraestructura: this.entidadEditar.id_tipo_infraestructura,
      id_tipo_via: parseInt(this.entidadEditar.id_tipo_via.toString()),
      id_estado_tipo_via: this.entidadEditar.id_estado_tipo_via,
      id_unidad_medida: this.entidadEditar.id_unidad_medida,
      longitud: this.entidadEditar.longitud,
      //monto: this.entidadEditar.monto,
      siglas: this.entidadEditar.siglas,
      nombre_archivo: this.entidadEditar.archivo_convenio,
      nombre_archivo_acta_compromiso: this.entidadEditar.nombre_archivo_acta_compromiso,
      //formGroup.
      numero_tramos: 1,
      id_municipalidad_anterior: this.entidadEditar.id_municipalidad,
      proyectoGroup: this.fb.group({
        activo: true,
        id_municipalidad: this.formGroup.get("id_municipalidad_anterior").value,// this.entidadEditar.id_municipalidad,
        id_ejecutora: this.entidadEditar.id_ejecutora,
        TramoGroupList: this.fb.array([])
      })
      , id_tipo_inversion: this.entidadEditar.id_tipo_inversion
      , id_programa: this.entidadEditar.id_programa
      , id_brecha: this.entidadEditar.id_brecha
      , id_compromiso: this.entidadEditar.id_compromiso
    })


    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    for (let index = 0; index < this.entidadEditar.proyecto.length; index++) {
      const element = this.entidadEditar.proyecto[index];
      array.push(this.construirTramo(element.id_tramo, element.id_fase, element.id_tipo_fase, element.nombre_tramo, element.id_ejecutora, element.id_fase_convenio, element.id_municipalidad, element.nombre_tramo, element.codigo_ruta));
      //array.push(this.construirTramo(element.id_tramo, element.id_fase, element.nombre_tramo, element.id_ejecutora, element.id_municipalidad, element.nombre_tramo));

      this.tramosAgregados.push({
        id_tramo: element.id_tramo,
        nombreTramo: element.nombre_tramo,
        idFase: element.id_fase,
        idTipoFase: element.id_tipo_fase,
        nombreFase: element.nombre_tipo_fase,
        idEjecutora: element.id_ejecutora,
        nombreEjecutora: element.ejecutora,
        codigo_ruta: element.codigo_ruta
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
        fecha_firma: ['01-01-2005 00:00:00'],
        fecha_vigencia: [null],
        plazo_vigencia: [null],
        id_documento_compromiso: [null, Validators.required],
        id_fuente_financiamiento: [null],
        id_tipo_infraestructura: [null, Validators.required],
        id_tipo_via: [null, Validators.required],
        id_estado_tipo_via: [null, Validators.required],
        id_unidad_medida: [null, Validators.required],
        longitud: [null, Validators.required],
        //monto: [null, Validators.required],
        siglas: ['-MTC/21', Validators.required],
        nombre_archivo: [null],
        nombre_archivo_acta_compromiso: [null],
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
        , id_tipo_inversion: [null, Validators.required]
        , id_programa: [null, Validators.required]
        , id_brecha: [null, Validators.required]
        , id_compromiso: [null, Validators.required]
        , checkCompromiso: false
      }
    )

    this.formRegistrarTramo = this.fb.group({
      id_tramo: [null, Validators.required],
      nombre_tramo: [null, Validators.required],
      id_tipo_fase: [null, Validators.required],
      id_ejecutora: [null, Validators.required],
      codigo_ruta: ""
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

          if (documento != undefined) {
            if (documento.nombre_documento_compromiso.toString().toUpperCase() == "CONVENIO") {
              this.boldConvenio = true;
            } else if (documento.nombre_documento_compromiso.toString().toUpperCase() == "ADENDA") {
              this.boldAdenda = true;
            } else {
              this.boldDecretoUrgencia = true;
            }
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

  listarEstadoTipoVias() {
    this.maestraService.listarEstadoTipoVia().subscribe(
      data => {
        this.estadoVias = data;
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

  listarCompromisos() {
    this.conveniopost.ListarCompromisos().subscribe(
      data => {
        this.compromisos = data;
      }
    )
  }
  listarBrechas() {
    this.conveniopost.ListarBrecha().subscribe(
      data => {
        this.brechas = data;
      }
    )
  }

  listarProgramas() {
    this.conveniopost.ListarPrograma().subscribe(
      data => {
        this.programas = data;
      }
    )
  }

  listarTipoInversion() {
    this.conveniopost.ListarTipoInversion().subscribe(
      data => {
        this.tipoInversion = data;
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

          this.mostrarAdjuntarArchivoCompromiso = true;
          this.formGroup.patchValue({
            nombre_archivo_acta_compromiso: ""
          });

          this.nombre_archivo_compromiso = "";
          this.limpiarMatrizTramos();
          this.tramosAgregados = [];
          this.buscarInfoProyecto(codigoSnip);
          this.lstFuenteFinanciamiento = [];
          this.formGroup.patchValue({
            codigo_snip: codigoSnip
          })
          this.listarDenominacion();
          this.activo = false;
          this.formGroup.patchValue({
            checkCompromiso: this.activo
          });

          this.formGroup.patchValue({
            proyectoGroup: {
              id_ejecutora: 0
            }
          })
          this.formGroup.patchValue({
            id_convenio: 0
          });
          this.formRegistrarTramo.updateValueAndValidity();
          this.tramosVer = [];
          return;
        } else {
          this.formGroup.patchValue({
            codigo_snip: parseInt(this.formGroup.get("proyectoGroup.cod_snip").value.toString())
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
            if (codigoSnip.length > 6) {
              let codigoSnipCiu;
              let CIU = codigoSnip;
              this.sosem.BuscarProyectoSosem("0", CIU).subscribe(
                (data: any) => {
                  if (data != null) {
                    // alert("Si data !=null ");
                
                    // if (data.InfoPorSIAF.Snip != null) {
                    //  // alert("Si data.InfoPorSIAF.Snip !=null ");
                    //   nomProyecto = data.InfoPorSIAF.Snip.Nombre;
                    //   codProyecto = data.InfoPorSIAF.Siaf != null ? data.InfoPorSIAF.Siaf[0].CodigoSiaf : data.InfoPorSIAF.Snip.CodigoUnico;
                    //   codigoSnipCiu = data.InfoPorSIAF.Snip.CodigoSnip;
                    //   this.tramos = [];
                    //   this.tramosVer.push({
                    //     id_tramo: 0,
                    //     nombre_tramo: nomProyecto
                    //   });
                    // } else if (data.InfoPorSIAF.Siaf != null) {
                    //   // alert("Si data.InfoPorSIAF.Snip ==null ");
                    //   nomProyecto = data.InfoPorSIAF.Siaf[0].Nombre;
                    //   codProyecto = data.InfoPorSIAF.Siaf[0].CodigoSiaf;
                    //   codigoSnipCiu = data.InfoPorSIAF.Snip.CodigoSnip;
                    //   this.tramos = [];
                    //   this.tramosVer.push({
                    //     id_tramo: 0,
                    //     nombre_tramo: nomProyecto
                    //   });
                    // } 
                    if(data != null){
                      nomProyecto = data.Nombre;
                      codProyecto = data.CodigoUnico;
                      codigoSnipCiu = data.CodigoSnip;
                      this.tramos = [];
                      this.tramosVer.push({
                        id_tramo: 0,
                        nombre_tramo: nomProyecto
                      });
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
                    this.poblarDataProyecto(idproyecto, nomProyecto, codProyecto, codigoSnipCiu);
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
              );
            } else {
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
                    if(data != null){
                      nomProyecto = data.Nombre;
                      codProyecto = data.CodigoUnico;
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
          }
          else {
            idproyecto = data.proyecto.id_proyecto;
            nomProyecto = data.proyecto.nombre_proyecto;
            codProyecto = data.proyecto.cod_unificado;
            this.tramos = data.proyecto.tramos;
            this.tramosVer.push({
              id_tramo: 0,
              nombre_tramo: nomProyecto
            });
            this.poblarDataProyecto(idproyecto, nomProyecto, codProyecto, codigoSnip);
            this.visible = false;
            this.ocultar();
          }
        }
      )
    }
  }

  poblarDataProyecto(idProyecto: number, nombre_proyecto: string, codProyecto, codigoSnip: string) {
    // console.log(idProyecto);
    // console.log(nombre_proyecto);
    // console.log(codProyecto);
    // console.log(codigoSnip);
    // alert("xD");
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
  modalRefEdicion: BsModalRef;
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

    if (nombre_tramo == null || nombre_tramo == "") {
      nombre_tramo = this.tramosVer[0].nombre_tramo;
    }

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

    let id_fase = 0;
    let id_fase_convenio = 0;
    let idTipoFase = this.formRegistrarTramo.get("id_tipo_fase").value;
    let id_ejecutora = this.formRegistrarTramo.get("id_ejecutora").value == null ? 0 : this.formRegistrarTramo.get("id_ejecutora").value;

    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    array.push(this.construirTramo(tramoId, id_fase, idTipoFase, nombre_tramo, id_ejecutora, id_fase_convenio, this.codigoMunicipalidad.value, nombre_tramo, this.strCodigoRuta));
    //array.push(this.construirTramo(tramoId, idTipoFase, nombre_tramo, id_ejecutora, this.codigoMunicipalidad.value, nombre_tramo));

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
      idTipoFase: entidadfase.id_tipo_fase,
      nombreFase: entidadfase.nombre_tipo_fase,
      idEjecutora: id_ejecutora,
      nombreEjecutora: nombreEjecutora,
      codigo_ruta: this.strCodigoRuta
    })

    this.formGroup.patchValue({
      numero_tramos: this.tramosAgregados.length
    });
    this.lstCodigoRuta = [];

  }

  construirTramo(idtramo, idFase, idTipoFase, nombreTramo, idEjecutora, idFaseConvenio, idMunicipalidad, descripcionTramo, strCodigoRuta): FormGroup {
    //construirTramo(idtramo, idTipoFase, nombreTramo, idEjecutora, idMunicipalidad, descripcionTramo): FormGroup {
    return this.fb.group({
      id_tramo: idtramo,
      nombre_tramo: nombreTramo,
      descripcion_tramo: descripcionTramo,
      activo: true,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion: sessionStorage.getItem("Usuario"),
      FaseGroup: this.fb.group({
        id_fase: idFase,
        id_tipo_fase: idTipoFase,
        usuario_creacion: sessionStorage.getItem("Usuario"),
        FaseConvenioGroup: this.fb.group({
          id_fase_convenio: idFaseConvenio,
          id_municipalidad: idMunicipalidad,
          id_ejecutora: idEjecutora,
          usuario_creacion: sessionStorage.getItem("Usuario")
        })
      })
      , codigo_ruta: strCodigoRuta
    });
  }

  administrarConvenioRegistrar() {
    let arrFinanciamiento = [];
    if (this.formGroup.get("id_fuente_financiamiento").value != null) {
      let cont = 0;
      this.formGroup.get("id_fuente_financiamiento").value.forEach(element => {
        cont = 0;
        this.lstFuenteFinanciamientoEditar.forEach(s => {
          if (s.id_fuente_financiamiento == element) {
            arrFinanciamiento.push({
              "id_convenio_financiamiento": s.id_convenio_financiamiento,
              "id_fuente_financiamiento": s.id_fuente_financiamiento,
              "activo": true,
              "usuario_modificacion": sessionStorage.getItem("Usuario")
            });
            cont++;
          }
        });
        if (cont == 0) {
          arrFinanciamiento.push({
            "id_convenio_financiamiento": 0,
            "id_fuente_financiamiento": element,
            "activo": true,
            "usuario_creacion": sessionStorage.getItem("Usuario")
          });
        }
      });

      this.lstFuenteFinanciamientoEditar.forEach(s => {
        if (this.formGroup.get("id_fuente_financiamiento").value.indexOf(s.id_fuente_financiamiento) == -1) {
          arrFinanciamiento.push({
            "id_convenio_financiamiento": s.id_convenio_financiamiento,
            "id_fuente_financiamiento": s.id_fuente_financiamiento,
            "activo": false,
            "usuario_eliminacion": sessionStorage.getItem("Usuario")
          });
        }
      });

    }

    let myConvenio: IConvenio = {
      id_convenio: this.formGroup.get("id_convenio").value,
      fecha_firma: this.funciones.formatFullDateIso(this.formGroup.get("fecha_firma").value),
      fecha_vigencia: this.funciones.SumDaytoDate(this.formGroup.get("fecha_firma").value, this.formGroup.get("plazo_vigencia").value),
      id_documento_compromiso: this.formGroup.get("id_documento_compromiso").value,
      //id_fuente_financiamiento: this.formGroup.get("id_fuente_financiamiento").value,
      id_tipo_infraestructura: this.formGroup.get("id_tipo_infraestructura").value,
      id_tipo_via: parseInt(this.formGroup.get("id_tipo_via").value.toString()),
      id_estado_tipo_via: this.formGroup.get("id_estado_tipo_via").value,
      id_programa: this.formGroup.get("id_programa").value,
      id_brecha: this.formGroup.get("id_brecha").value,
      id_compromiso: this.formGroup.get("id_compromiso").value,
      id_tipo_inversion: this.formGroup.get("id_tipo_inversion").value,
      id_unidad_medida: this.formGroup.get("id_unidad_medida").value,
      longitud: Number.parseFloat(this.formGroup.get("longitud").value.toString().replace(/,/g, "")),
      //monto: Number.parseFloat(this.formGroup.get("monto").value.toString().replace(/,/g, "")),
      nombre_archivo: this.formGroup.get("nombre_archivo").value,
      nombre_acta_compromiso: (this.vActualizeActa == "Si" ? this.nombre_archivo_compromiso : ""),
      nombre_archivo_acta_compromiso: (this.vActualizeActa == "Si" ? this.formGroup.get("nombre_archivo_acta_compromiso").value : ""),
      siglas: this.formGroup.get("siglas").value,
      usuario_creacion: sessionStorage.getItem("Usuario"),
      usuario_modificacion: '',
      _BE_Tm_Ssppvd_Proyecto: {
        id_proyecto: this.formGroup.get("proyectoGroup.id_proyecto").value,
        cod_snip: parseInt(this.formGroup.get("proyectoGroup.cod_snip").value.toString()),
        nombre_proyecto: this.formGroup.get("proyectoGroup.nombre_proyecto").value,
        activo: true,
        cod_unificado: this.formGroup.get("proyectoGroup.cod_unificado").value,
        usuario_creacion: sessionStorage.getItem("Usuario"),
        ListBE_Tm_Ssppvd_Tramo: this.obtenerListaTramos()
      },
      ListFinanciamiento: arrFinanciamiento
    };

    if (this.entidadEditar != null) {
      // editar
      myConvenio.usuario_modificacion = sessionStorage.getItem("Usuario");
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
    );
  }

  obtenerListaTramos(): IListBETmSsppvdTramo[] {
    let array: FormArray = <FormArray>this.formGroup.get("proyectoGroup").get("TramoGroupList");

    let tramos: IListBETmSsppvdTramo[] = []

    for (let index = 0; index < array.length; index++) {
      let element: FormGroup = <FormGroup>array.at(index);
      let faseGroup: FormGroup = <FormGroup>element.controls["FaseGroup"];
      let faseConvenio: FormGroup = <FormGroup>faseGroup.controls["FaseConvenioGroup"];

      let idTramo: number = element.get("id_tramo").value;

      let tramo = this.tramosAgregados.find(x => {
        return x.id_tramo == idTramo
      })

      let item: IListBETmSsppvdTramo = {
        id_tramo: idTramo,
        activo: true,
        descripcion_tramo: (idTramo == 0 ? "" : tramo.nombreTramo),
        nombre_tramo: (idTramo == 0 ? element.get("nombre_tramo").value : tramo.nombreTramo),
        codigo_ruta: (this.strCodigoRuta == "" ? tramo.codigo_ruta : this.strCodigoRuta),
        usuario_creacion: sessionStorage.getItem("Usuario"),
        usuario_modificacion: sessionStorage.getItem("Usuario"),
        _BE_Tm_Ssppvd_Fase: {
          id_fase: element.get("FaseGroup.id_fase").value,
          id_tipo_fase: element.get("FaseGroup.id_tipo_fase").value,
          usuario_creacion: sessionStorage.getItem("Usuario"),
          _BE_Td_Ssppvd_Fase_Convenio: {
            id_fase_convenio: faseConvenio.get("id_fase_convenio").value,
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

  fileChangeEventActaCompromiso(evento: any) {
    if (evento.uploaded != null) {
      this.formGroup.patchValue({
        nombre_archivo_acta_compromiso: evento.uploaded._body
      });

      this.nombre_archivo_compromiso = evento.target.files[0].name;
      this.vActualizeActa = "Si";
    }
  }

  config: any;
  editarTramo(tramo, index) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: tramo,
        idMunicipalidad: this.codigoMunicipalidad.value,
        fases: this.fases
      }
    };
    this.modalRefEdicion = this.modalService.show(ModalRegistroTramoComponent, this.config);
    this.modalRefEdicion.content.emiteRespuesta.subscribe(
      (data: any) => {
        this.tramosAgregados[index].nombreTramo = data.nombre_tramo;
        this.tramosAgregados[index].idTipoFase = data.id_tipo_fase;
        this.tramosAgregados[index].nombreFase = data.nombre_fase;
        this.tramosAgregados[index].idEjecutora = data.id_ejecutora;
        this.tramosAgregados[index].nombreEjecutora = data.nombre_ejecutora;
        this.tramosAgregados[index].codigo_ruta = data.codigo_ruta;
      }
    );
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
      //} else {
      //  telefono.value[index].id_usuario_telefono == 0 ? telefono.removeAt(index) : telefono.value[index].estado = false;
      //}
    }
  }

  onFuenteChange(idFuente: number, $e) {
    if ($e.target.checked) {
      this.denominacion.forEach(element => {
        if (idFuente == element.id_fuente_financiamiento) {
          this.fuentesAgregadas.push(element);
        }
      });
    } else {
      this.fuentesAgregadas.forEach(element => {
        if (idFuente == element.id_fuente_financiamiento) {
          let index = this.fuentesAgregadas.indexOf(element);
          this.fuentesAgregadas.splice(index, 1);
        }
      });
    }
  }

  onChangeCompromiso(event: any) {
    if (event.srcElement.value[0] == 6) {
      this.bOtroCompromiso = true;
    } else {
      this.bOtroCompromiso = false;
    }
  }

  activarCargaActaCompromiso(evento) {
    if (evento) {
      this.mostrarAdjuntarArchivoCompromiso = false;
    } else {
      this.mostrarAdjuntarArchivoCompromiso = true;
      this.formGroup.patchValue({
        nombre_archivo_acta_compromiso: ""
      });
      this.nombre_archivo_compromiso = "";
    }
  }

  setearFechaMinima(e) {
    this.MinFechaVigencia = e;
  }

  asignarTipoEstadoVia(tipo: number | string) {
    if (tipo == 3) {
      this.formGroup.patchValue({
        id_estado_tipo_via: 2 //no pavimentado
      });
      this.formGroup.controls['id_estado_tipo_via'].disable();
    } else {
      this.formGroup.controls['id_estado_tipo_via'].enable();
      this.formGroup.patchValue({
        id_estado_tipo_via: null //no pavimentado
      });
    }
  }

  calcularDiferencia(fecha_firma, fecha_vigencia) {
    var aFecha1 = fecha_firma.split('/');
    var aFecha2 = fecha_vigencia.split('/');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
  }
}