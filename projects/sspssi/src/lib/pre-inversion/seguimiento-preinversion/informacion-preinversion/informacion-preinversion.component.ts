import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrudAmpliacionPreComponent } from '../modals/modal-crud-ampliacion-pre/modal-crud-ampliacion-pre.component';
import { ModalCrudAdelantoDirectoPreComponent } from '../modals/modal-crud-adelanto-directo-pre/modal-crud-adelanto-directo-pre.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';
import { PreInversionComponent as MenuTabsComponent } from 'projects/sspssi/src/lib/pre-inversion/pre-inversion.component';

@Component({
  selector: 'ssi-informacion-preinversion',
  templateUrl: './informacion-preinversion.component.html',
  styleUrls: ['./informacion-preinversion.component.css']
})
export class InformacionPreinversionComponent implements OnInit {

  formRegistroSeguimiento: FormGroup;
  model: any = null;
  modelEmit: any = {
    id_seguimiento: 0,
    fecha_inicio_contractual: null,
  };
  divSegMonitoreo: boolean = false;
  idProyecto: any = 0;
  bMostrar: boolean = false;
  bTramo: boolean = false;
  monto_adelanto_directo: number = 0;
  UltimaActualizacionInfEstudio: string = '';
  bsModal: BsModalRef;
  @Input() idSeguimientoMonitoreoPreinversion: number = 0;
  @Input() idFase: number = 0;
  @Input() idTramo: number = 0;
  @Input() bEstado: boolean = true;
  @Output() eventInformacionEstudio = new EventEmitter();
  menuTabs: MenuTabsComponent;

  constructor(
    private fb: FormBuilder,
    private modalSvc: BsModalService,
    private route: ActivatedRoute,
    private seguimientoPreSvc: SeguimientoPreinversionService,
    private router: Router,
    private injector: Injector,
    public funciones: Functions
  ) { }

  ngOnInit() {
    this.createForm();
    this.idProyecto = this.route.snapshot.params.idProyecto;

    if (this.idFase === 0 && this.idSeguimientoMonitoreoPreinversion === 0) {
      this.bTramo = true;
    } else {
      this.listarSeguimientoMonitoreoPreinversion(this.idFase);
      this.bTramo = false;
    }
  }

  createForm() {
    this.formRegistroSeguimiento = this.fb.group({
      id_fase: this.idFase,
      id_seguimiento: this.idSeguimientoMonitoreoPreinversion,
      fecha_inicio_pre_inversion: [null, Validators.required],
      plazo_ejecucion: [null, Validators.required],
      fecha_termino_pre_inversion: null,
      ampliacion: null,
      fecha_termino_ampliacion: null,
      monto_adelanto_directo: 0,
    });
  }

  get f() { return this.formRegistroSeguimiento.controls; }

  listarSeguimientoMonitoreoPreinversion(idFase: any) {
    const param = { "id_fase": parseInt(idFase, 10) };
    this.seguimientoPreSvc.listarSeguimientoPreinversion(param).subscribe(
      (data: any) => {
        if (data.es_seguimiento) {
          this.setearInformacionSeguimiento(data);
          this.modelEmit.id_seguimiento = data.id_seguimiento;
          this.modelEmit.fecha_inicio_contractual = data.fecha_inicio_pre_inversion;
          this.eventInformacionEstudio.emit(this.modelEmit);
          this.UltimaActualizacionInfEstudio = this.obtenerDatosAuditoria('InformacionPreInversion');
        }
      }
    );

  }

  setearInformacionSeguimiento(dataSeguimiento: any) {
    this.model = dataSeguimiento;
    this.formRegistroSeguimiento.patchValue(this.model);
    this.formRegistroSeguimiento.patchValue({
      fecha_inicio_pre_inversion: (dataSeguimiento.fecha_inicio_pre_inversion != null) ? new Date(dataSeguimiento.fecha_inicio_pre_inversion) : null,
      fecha_termino_pre_inversion: (dataSeguimiento.fecha_termino_pre_inversion != null) ? new Date(dataSeguimiento.fecha_termino_pre_inversion) : null,
      fecha_termino_ampliacion: (dataSeguimiento.fecha_termino_ampliacion != null) ? this.funciones.ConvertStringtoDateDB(dataSeguimiento.fecha_termino_ampliacion) : null,
    });
    this.divSegMonitoreo = true;
    sessionStorage.setItem('idSeguimiento', this.model.id_seguimiento);
    sessionStorage.setItem('idSeguimiento_registro', this.model.id_seguimiento);
  }

  modificarSegMonitoreoPreinversion() {
    const paramEnvio = { ...{}, ...this.formRegistroSeguimiento.value };
    paramEnvio.plazo_ejecucion = parseInt(paramEnvio.plazo_ejecucion, 10);
    paramEnvio.usuario_creacion = this.usuario;
    this.bMostrar = true;

    if (this.divSegMonitoreo) {
      // actualizar
      this.funciones.alertaRetorno('question', '<strong>¿Está seguro de actualizar el registro?</strong>',
        '<div style="color: #E53935; font - weight: 400; "><strong>¡Importante!<br>Se eliminarán las Ampliaciones, Adelanto Directo, ' +
        'Cronograma y Valorizaciones relacionadas a este proyecto.</strong></div>', true,
        (respuesta) => {
          if (respuesta.value) {
            this.bMostrar = true;
            paramEnvio.usuario_modificacion = this.usuario;

            this.seguimientoPreSvc.modificarSeguimientoPreinversion(paramEnvio).subscribe(
              (rpta: any) => {
                if (rpta.id_seguimiento > 0) {
                  this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
                  this.consultaAuditoria('InformacionPreInversion');
                  this.listarSeguimientoMonitoreoPreinversion(this.idFase);
                  this.router.navigate(['/ssi/monitoreo']);
                  // this.eventInformacionEstudio.emit(paramEnvio);
                  this.bMostrar = false;
                } else {
                  this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
                }
              },
              error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
            );
          }
        });
    } else {
      // insertar
      this.bMostrar = true;

      if (!this.bTramo) {
        this.seguimientoPreSvc.definirSeguimientoPreinversion(paramEnvio).subscribe(
          (respuesta: any) => {
            if (respuesta.resultado > 0) {
              this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
              this.consultaAuditoria('InformacionPreInversion');
              this.listarSeguimientoMonitoreoPreinversion(this.idFase);
              this.getMenuTabsComponents.habilitarRecepcionLiquidacion(false);
              // this.eventInformacionEstudio.emit(paramEnvio);
              this.bMostrar = false;
            } else {
              this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
            }
          },
          error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
        );

      } else {

      }
    }
  }

  opnModRegAmpliacion() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        fecha_inicio_contractual: this.model.fecha_inicio_pre_inversion,
        bEstado: this.bEstado
      },
      class: 'modal-ampliacion-plazo'
    };

    this.bsModal = this.modalSvc.show(ModalCrudAmpliacionPreComponent, config);
    this.bsModal.content.retornoValorAmpliacion.subscribe(
      () => {
        this.listarSeguimientoMonitoreoPreinversion(this.idFase);
        this.consultaAuditoria('Ampliacion');
      }
    );
  }

  opnModAdelantoDirecto() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id_seguimientoMonitoreoPreinversion: this.idSeguimientoMonitoreoPreinversion,
        fecha_inicio_contractual: this.model.fecha_inicio_pre_inversion,
        bEstado: this.bEstado
      },
      class: 'modal-adelanto-directo-expediente'
    };
    this.bsModal = this.modalSvc.show(ModalCrudAdelantoDirectoPreComponent, config);
    this.bsModal.content.retornoValorAdelanto.subscribe(
      () => {
        this.listarSeguimientoMonitoreoPreinversion(this.idFase);
        this.consultaAuditoria('AdelantoDirecto');
      }
    );
  }

  get usuario(): string { return sessionStorage.getItem('Usuario') };

  public get getMenuTabsComponents(): MenuTabsComponent {
    this.menuTabs = this.injector.get(MenuTabsComponent);
    return this.menuTabs;
  }

  obtenerDatosAuditoria(pNombreAuditoria) {
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem('DatosAuditoria'));
    if (dAuditoria != '') {
      let infoAuditoria = dAuditoria.find(c => c.opcion == pNombreAuditoria);
      if (infoAuditoria != undefined) {
        return ` ${(infoAuditoria.nombre_usuario == null ? '' : infoAuditoria.nombre_usuario)} - ${(infoAuditoria.fecha == null ? '' : this.funciones.formatFullDate(infoAuditoria.fecha))}`;
      } else {
        return '';
      }
    }
  }

  consultaAuditoria(pNombreTipoAuditoria) {
    const param = { id_fase: this.idFase };
    this.seguimientoPreSvc.listarAuditoriaPreinversion(param).subscribe(
      (respuesta: any) => {
        sessionStorage.setItem('DatosAuditoria', JSON.stringify(respuesta));
        if (pNombreTipoAuditoria == 'InformacionPreInversion') {
          this.UltimaActualizacionInfEstudio = this.obtenerDatosAuditoria('InformacionPreInversion');
        } else if (pNombreTipoAuditoria == 'AdelantoDirecto') {
          this.UltimaActualizacionInfEstudio = this.obtenerDatosAuditoria('AdelantoDirecto');
        } else if (pNombreTipoAuditoria == 'Ampliacion') {
          this.UltimaActualizacionInfEstudio = this.obtenerDatosAuditoria('Ampliacion');
        }
      }
    );
  }
}
