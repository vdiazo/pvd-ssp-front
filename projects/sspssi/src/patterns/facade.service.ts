import { Injectable, Injector } from '@angular/core';
import { ConvenioService } from '../servicios/convenio.service';
import { MaestraSsiService } from '../servicios/maestra-ssi.service';
import { WsConsultaPrincipalService } from '../servicios/ws-consulta-principal.service';
import { AccionSeguimientoMonitoreoService } from '../servicios/accionseguimientomonitoreo.service';
import { InspectorService } from '../servicios/inspector.service';
import { SupervisorService } from '../servicios/supervisor.service';
import { ResidenteService } from '../servicios/residente.service';
import { ContratistaService } from '../servicios/contratista.service';
import { CronogramaService } from '../servicios/cronograma.service';
import { SeguimientoMonitoreoService } from '../servicios/seguimiento-monitoreo.service';
import { AmpliacionService } from '../servicios/ampliacion.service';
import { ParalizacionService } from '../servicios/paralizacion.service';
import { ParalizacionAccionService } from '../servicios/paralizacion-accion.service';
import { ValorizacionesService } from '../servicios/valorizaciones.service';
import { ResolucionContratoService } from '../servicios/recepcion-liquidacion/resolucion-contrato.service';
import { DeductivoReduccionService } from '../servicios/deductivo-reduccion.service';
import { PresupuestoService } from '../servicios/presupuesto.service';
import { CierreProyectoService } from '../servicios/recepcion-liquidacion/cierre-proyecto.service';
import { ProcesoLiquidacionService } from '../servicios/recepcion-liquidacion/proceso-liquidacion.service';
import { InformacionFinancieraSigatService } from '../servicios/informacion-financiera-sigat.service';
import { DataExternaSsiService } from '../servicios/data-externa-ssi.service';
import { ProcesoSeleccionService } from '../servicios/proceso-seleccion.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  private _convenioService: ConvenioService;
  private _maestraSsiService: MaestraSsiService;
  private _wsConsultaPrincipalService: WsConsultaPrincipalService;
  private _accionSeguimientoMonitoreoService: AccionSeguimientoMonitoreoService;
  private _inspectorService: InspectorService;
  private _supervisorService: SupervisorService;
  private _residenteService: ResidenteService;
  private _contratistaService: ContratistaService;
  private _cronogramaService: CronogramaService;
  private _seguimientoMonitoreoService: SeguimientoMonitoreoService;
  private _ampliacionService: AmpliacionService;
  private _paralizacionService: ParalizacionService;
  private _paralizacionAccionService: ParalizacionAccionService;
  private _valorizacionService: ValorizacionesService
  private _resolucionContratoService: ResolucionContratoService;
  private _deductivoReduccionService: DeductivoReduccionService;
  private _presupuestoAdicionalService: PresupuestoService;
  private _cierreProyectoService: CierreProyectoService;
  private _procesoLiquidacionService: ProcesoLiquidacionService;
  private _informacionFinancieraSigatService: InformacionFinancieraSigatService;
  private _dataExternaSsiService: DataExternaSsiService;
  private _procesoSeleccionService: ProcesoSeleccionService;

  constructor(private injector: Injector) {

  }

  public get convenioService(): ConvenioService {
    if (!this._convenioService) {
      this._convenioService = this.injector.get(ConvenioService);
    }

    return this._convenioService;
  }
  public get maestraService(): MaestraSsiService {
    if (!this._maestraSsiService) {
      this._maestraSsiService = this.injector.get(MaestraSsiService);
    }

    return this._maestraSsiService;
  }

  public get wsConsultaPrincipalService(): WsConsultaPrincipalService {
    if (!this._wsConsultaPrincipalService) {
      this._wsConsultaPrincipalService = this.injector.get(WsConsultaPrincipalService);
    }

    return this._wsConsultaPrincipalService;
  }
  public get accionSeguimientoMonitoreoService(): AccionSeguimientoMonitoreoService {
    if (!this._accionSeguimientoMonitoreoService) {
      this._accionSeguimientoMonitoreoService = this.injector.get(AccionSeguimientoMonitoreoService);
    }

    return this._accionSeguimientoMonitoreoService;
  }
  public get inspectorService(): InspectorService {
    if (!this._inspectorService) {
      this._inspectorService = this.injector.get(InspectorService);
    }

    return this._inspectorService;
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

  public get contratistaService(): ContratistaService {
    if (!this._contratistaService) {
      this._contratistaService = this.injector.get(ContratistaService);
    }

    return this._contratistaService;
  }

  public get cronogramaService(): CronogramaService {
    if (!this._cronogramaService) {
      this._cronogramaService = this.injector.get(CronogramaService);
    }

    return this._cronogramaService;
  }
  public get seguimientoMonitoreoService(): SeguimientoMonitoreoService {
    if (!this._seguimientoMonitoreoService) {
      this._seguimientoMonitoreoService = this.injector.get(SeguimientoMonitoreoService);
    }

    return this._seguimientoMonitoreoService;
  }
  public get ampliacionService(): AmpliacionService {
    if (!this._ampliacionService) {
      this._ampliacionService = this.injector.get(AmpliacionService);
    }

    return this._ampliacionService;
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
  public get valorizacionService(): ValorizacionesService {
    if (!this._valorizacionService) {
      this._valorizacionService = this.injector.get(ValorizacionesService);
    }

    return this._valorizacionService;
  }
  public get resolucionContratoService(): ResolucionContratoService {
    if (!this._resolucionContratoService) {
      this._resolucionContratoService = this.injector.get(ResolucionContratoService);
    }

    return this._resolucionContratoService;
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
  public get cierreProyectoService(): CierreProyectoService {
    if (!this._cierreProyectoService) {
      this._cierreProyectoService = this.injector.get(CierreProyectoService);
    }

    return this._cierreProyectoService;
  }
  public get procesoLiquidacionService(): ProcesoLiquidacionService {
    if (!this._procesoLiquidacionService) {
      this._procesoLiquidacionService = this.injector.get(ProcesoLiquidacionService);
    }

    return this._procesoLiquidacionService;
  }
  public get informacionFinancieraSigatService(): InformacionFinancieraSigatService {
    if (!this._informacionFinancieraSigatService) {
      this._informacionFinancieraSigatService = this.injector.get(InformacionFinancieraSigatService);
    }

    return this._informacionFinancieraSigatService;
  }

  public get dataExternaService(): DataExternaSsiService {
    if (!this._dataExternaSsiService) {
      this._dataExternaSsiService = this.injector.get(DataExternaSsiService);
    }
    return this._dataExternaSsiService;
  }

  public get procesoSeleccionService(): ProcesoSeleccionService {
    if (!this._procesoSeleccionService) {
      this._procesoSeleccionService = this.injector.get(ProcesoSeleccionService);
    }

    return this._procesoSeleccionService;
  }
}