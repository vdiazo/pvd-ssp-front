import { Injectable, Injector } from '@angular/core';
import { CronogramaService } from '../services/cronograma.service';
import { ValorizacionesService } from '../services/valorizaciones.service';
import { MaestraService } from '../services/maestra.service';
import { ParalizacionService } from '../services/paralizacion.service';
import { ParalizacionAccionService } from '../services/paralizacion-accion.service';
import { AmpliacionService } from '../services/ampliacion.service';
import { AccesoService } from '../services/acceso.service';
import { ConvenioService } from '../services/convenio.service';
import { WsConsultaPrincipalService } from '../services/ws-consulta-principal.service';
import { UsuarioService } from '../services/usuario.service';
import { TransferenciaRealizadaService } from '../services/transferencia-realizada';
import { SupervisorService } from '../services/supervisor.service';
import { ResidenteService } from '../services/residente.service';
import { InspectorService } from '../services/inspector.service';
import { AccionSeguimientoMonitoreoService } from '../services/accionseguimientomonitoreo.service';
import { DeductivoReduccionService } from '../services/deductivo-reduccion.service';
import { PresupuestoService } from '../services/presupuesto.service';
import { SeguimientoMonitoreoService } from '../services/seguimiento-monitoreo.service';
import { ResolucionContratoService } from '../services/recepcion-liquidacion/resolucion-contrato.service';
import { ColaboradorService } from '../services/colaborador.service';
import { SuspensionService } from '../services/suspension.service';
import { SuspensionAccionService } from '../services/suspension-accion.service';
import { ProcesoSeleccionService } from '../services/proceso-seleccion.service';
import { AutoCapacitacionService } from '../services/auto-capacitacion.service';
import { MetasService } from '../services/metas.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  private _cronogramaService: CronogramaService
  private _valorizacionService: ValorizacionesService
  private _maestraService: MaestraService;
  private _paralizacionService: ParalizacionService;
  private _paralizacionAccionService: ParalizacionAccionService;
  private _ampliacionService: AmpliacionService;
  private _accesoService: AccesoService;
  private _convenioService: ConvenioService;
  private _wsConsultaPrincipalService: WsConsultaPrincipalService;
  private _usuarioService: UsuarioService;
  private _transferenciaRealizadaService: TransferenciaRealizadaService;
  private _supervisorService: SupervisorService;
  private _residenteService: ResidenteService;
  private _inspectorService: InspectorService;
  private _accionSeguimientoMonitoreoService: AccionSeguimientoMonitoreoService;
  private _deductivoReduccionService: DeductivoReduccionService;
  private _presupuestoAdicionalService: PresupuestoService;
  private _seguimientoMonitoreoService: SeguimientoMonitoreoService;
  private _resolucionContratoService: ResolucionContratoService;
  private _colaboradoresService: ColaboradorService;
  private _suspensionService:SuspensionService;
  private _suspensionAccionService:SuspensionAccionService;
  private _procesoSeleccionService:ProcesoSeleccionService;
  private _autoCapacitacionService:AutoCapacitacionService;

  constructor(private injector: Injector) {

  }

  public get cronogramaService(): CronogramaService {
    if (!this._cronogramaService) {
      this._cronogramaService = this.injector.get(CronogramaService);
    }

    return this._cronogramaService;
  }

  public get valorizacionService(): ValorizacionesService {
    if (!this._valorizacionService) {
      this._valorizacionService = this.injector.get(ValorizacionesService);
    }

    return this._valorizacionService;
  }

  public get maestraService(): MaestraService {
    if (!this._maestraService) {
      this._maestraService = this.injector.get(MaestraService);
    }

    return this._maestraService;
  }

  public get paralizacionService(): ParalizacionService {
    if (!this._paralizacionService) {
      this._paralizacionService = this.injector.get(ParalizacionService);
    }

    return this._paralizacionService;
  }

  public get paralizacionAccionService(): ParalizacionAccionService {
    if (!this._paralizacionAccionService) {
      this._paralizacionAccionService = this.injector.get(ParalizacionAccionService);
    }

    return this._paralizacionAccionService;
  }

  public get ampliacionService(): AmpliacionService {
    if (!this._ampliacionService) {
      this._ampliacionService = this.injector.get(AmpliacionService);
    }

    return this._ampliacionService;
  }

  public get accesoService(): AccesoService {
    if (!this._accesoService) {
      this._accesoService = this.injector.get(AccesoService);
    }

    return this._accesoService;
  }

  public get convenioService(): ConvenioService {
    if (!this._convenioService) {
      this._convenioService = this.injector.get(ConvenioService);
    }

    return this._convenioService;
  }

  public get wsConsultaPrincipalService(): WsConsultaPrincipalService {
    if (!this._wsConsultaPrincipalService) {
      this._wsConsultaPrincipalService = this.injector.get(WsConsultaPrincipalService);
    }

    return this._wsConsultaPrincipalService;
  }

  public get usuarioService(): UsuarioService {
    if (!this._usuarioService) {
      this._usuarioService = this.injector.get(UsuarioService);
    }

    return this._usuarioService;
  }

  public get transferenciaRealizadaService(): TransferenciaRealizadaService {
    if (!this._transferenciaRealizadaService) {
      this._transferenciaRealizadaService = this.injector.get(TransferenciaRealizadaService);
    }

    return this._transferenciaRealizadaService;
  }

  public get supervisorService(): SupervisorService {
    if (!this._supervisorService) {
      this._supervisorService = this.injector.get(SupervisorService);
    }

    return this._supervisorService;
  }

  public get residenteService(): ResidenteService {
    if (!this._residenteService) {
      this._residenteService = this.injector.get(ResidenteService);
    }

    return this._residenteService;
  }

  public get inspectorService(): InspectorService {
    if (!this._inspectorService) {
      this._inspectorService = this.injector.get(InspectorService);
    }

    return this._inspectorService;
  }

  public get accionSeguimientoMonitoreoService(): AccionSeguimientoMonitoreoService {
    if (!this._accionSeguimientoMonitoreoService) {
      this._accionSeguimientoMonitoreoService = this.injector.get(AccionSeguimientoMonitoreoService);
    }

    return this._accionSeguimientoMonitoreoService;
  }

  public get deductivoReduccionService(): DeductivoReduccionService {
    if (!this._deductivoReduccionService) {
      this._deductivoReduccionService = this.injector.get(DeductivoReduccionService);
    }

    return this._deductivoReduccionService;
  }
  
  public get presupuestoAdicionalService(): PresupuestoService {
    if (!this._presupuestoAdicionalService) {
      this._presupuestoAdicionalService = this.injector.get(PresupuestoService);
    }

    return this._presupuestoAdicionalService;
  }

  public get seguimientoMonitoreoService(): SeguimientoMonitoreoService {
    if (!this._seguimientoMonitoreoService) {
      this._seguimientoMonitoreoService = this.injector.get(SeguimientoMonitoreoService);
    }

    return this._seguimientoMonitoreoService;
  }

  public get colaboradoresService(): ColaboradorService {
    if (!this._colaboradoresService) {
      this._colaboradoresService = this.injector.get(ColaboradorService);
    }

    return this._colaboradoresService;
  }
  
  public get resolucionContratoService(): ResolucionContratoService {
    if (!this._resolucionContratoService) {
      this._resolucionContratoService = this.injector.get(ResolucionContratoService);
    }

    return this._resolucionContratoService;
  }

  public get suspensionService(): SuspensionService {
    if (!this._suspensionService) {
      this._suspensionService = this.injector.get(SuspensionService);
    }

    return this._suspensionService;
  }

  public get suspensionAccionService(): SuspensionAccionService {
    if (!this._suspensionAccionService) {
      this._suspensionAccionService = this.injector.get(SuspensionAccionService);
    }

    return this._suspensionAccionService;
  }

  public get procesoSeleccionService(): ProcesoSeleccionService {
    if (!this._procesoSeleccionService) {
      this._procesoSeleccionService = this.injector.get(ProcesoSeleccionService);
    }

    return this._procesoSeleccionService;
  }

  public get autoCapacitacionService(): AutoCapacitacionService {
    if (!this._autoCapacitacionService) {
      this._autoCapacitacionService = this.injector.get(AutoCapacitacionService);
    }

    return this._autoCapacitacionService;
  }
  
}