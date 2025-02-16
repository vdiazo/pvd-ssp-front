import { Injectable, Injector } from '@angular/core';
import { AmpliacionService } from '../services/ampliacion.service';
import { InfoGeneralProyectoExpTecService } from '../services/info-general-proyecto-exp-tec.service';
import { MaestraService } from '../services/maestra.service';
import { SupervisorService } from '../services/supervisor.service';
import { InspectorService } from '../services/inspector.service';
import { SeguimientoMonitoreoExpTecService } from '../services/seguimiento-monitoreo-exp-tec.service';
import { CronogramaExpTecService } from '../services/cronograma-exp-tec.service';
import { ValorizacionesService } from '../services/valorizaciones.service';
import { AccionSeguimientoMonitoreoExpTecService } from '../services/accion-seguimiento-monitoreo-exp-tec.service';
import { ParalizacionService } from '../services/paralizacion.service';
import { ParalizacionAccionService } from '../services/paralizacion-accion.service';
import { RecepcionObraService } from '../services/recepcion-obra.service';
import { EntregableExpTecService } from '../services/entregable-exp-tec.service';
import { AvanceEntregableExpTecService } from '../services/avance-entregable-exp-tec.service';
import { ProcesoLiquidacionService } from '../services/proceso-liquidacion.service';
import { ResponsableElaboracionExpedienteService } from '../services/responsable-elaboracion-expediente.service';
import { DataexternaService } from '../services/dataexterna.service';
import { ProcesoSeleccionService } from '../services/proceso-seleccion.service';
import { ResolucionContratoService } from '../services/resolucion-contrato.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {
  private _ampliacionService: AmpliacionService;
  private _infoGeneralProyectoExpTecService: InfoGeneralProyectoExpTecService;
  private _maestraService:MaestraService;
  private _supervisorService:SupervisorService;
  private _inspectorService:InspectorService;
  private _seguimientoMonitoreoExpTecService:SeguimientoMonitoreoExpTecService;
  private _cronogramaExpTecService:CronogramaExpTecService;
  private _valorizacionesService:ValorizacionesService;
  private _accionSeguimientoMonitoreoExpTecService:AccionSeguimientoMonitoreoExpTecService;
  private _paralizacionService:ParalizacionService;
  private _paralizacionAccionService:ParalizacionAccionService;
  private _recepcionObraService:RecepcionObraService;
  private _entregableExpTecService:EntregableExpTecService;
  private _avanceEntregableExpTecService:AvanceEntregableExpTecService;
  private _procesoLiquidacionService:ProcesoLiquidacionService;
  private _responsableElaboracionExpedienteService:ResponsableElaboracionExpedienteService;
  private _dataexternaService:DataexternaService;
  private _procesoSeleccionService:ProcesoSeleccionService;
  private _resolucionContratoService: ResolucionContratoService;

  constructor(
    private injector: Injector
  ) { }

  public get ampliacionService(): AmpliacionService {
    if (!this._ampliacionService) {
      this._ampliacionService = this.injector.get(AmpliacionService);
    }
    return this._ampliacionService;
  }

  public get infoGeneralProyectoExpTecService(): InfoGeneralProyectoExpTecService {
    if (!this._infoGeneralProyectoExpTecService) {
      this._infoGeneralProyectoExpTecService = this.injector.get(InfoGeneralProyectoExpTecService);
    }
    return this._infoGeneralProyectoExpTecService;
  }

  public get maestraService(): MaestraService {
    if (!this._maestraService) {
      this._maestraService = this.injector.get(MaestraService);
    }
    return this._maestraService;
  }

  public get supervisorService(): SupervisorService {
    if (!this._supervisorService) {
      this._supervisorService = this.injector.get(SupervisorService);
    }
    return this._supervisorService;
  }

  public get inspectorService(): InspectorService {
    if (!this._inspectorService) {
      this._inspectorService = this.injector.get(InspectorService);
    }
    return this._inspectorService;
  }

  public get seguimientoMonitoreoExpTecService(): SeguimientoMonitoreoExpTecService{
    if (!this._seguimientoMonitoreoExpTecService) {
      this._seguimientoMonitoreoExpTecService = this.injector.get(SeguimientoMonitoreoExpTecService);
    }
    return this._seguimientoMonitoreoExpTecService;
  }

  public get cronogramaExpTecService(): CronogramaExpTecService{
    if (!this._cronogramaExpTecService) {
      this._cronogramaExpTecService = this.injector.get(CronogramaExpTecService);
    }
    return this._cronogramaExpTecService;
  }

  public get valorizacionesService(): ValorizacionesService{
    if (!this._valorizacionesService) {
      this._valorizacionesService = this.injector.get(ValorizacionesService);
    }
    return this._valorizacionesService;
  }

  public get accionSeguimientoMonitoreoExpTecService(): AccionSeguimientoMonitoreoExpTecService{
    if (!this._accionSeguimientoMonitoreoExpTecService) {
      this._accionSeguimientoMonitoreoExpTecService = this.injector.get(AccionSeguimientoMonitoreoExpTecService);
    }
    return this._accionSeguimientoMonitoreoExpTecService;
  }

  public get paralizacionService(): ParalizacionService{
    if (!this._paralizacionService) {
      this._paralizacionService = this.injector.get(ParalizacionService);
    }
    return this._paralizacionService;
  }

  public get paralizacionAccionService(): ParalizacionAccionService{
    if (!this._paralizacionAccionService) {
      this._paralizacionAccionService = this.injector.get(ParalizacionAccionService);
    }
    return this._paralizacionAccionService;
  }

  public get recepcionObraService(): RecepcionObraService{
    if (!this._recepcionObraService) {
      this._recepcionObraService = this.injector.get(RecepcionObraService);
    }
    return this._recepcionObraService;
  }

  
  public get entregableExpTecService(): EntregableExpTecService{
    if (!this._entregableExpTecService) {
      this._entregableExpTecService = this.injector.get(EntregableExpTecService);
    }
    return this._entregableExpTecService;
  }

  public get avanceEntregableExpTecService(): AvanceEntregableExpTecService{
    if (!this._avanceEntregableExpTecService) {
      this._avanceEntregableExpTecService = this.injector.get(AvanceEntregableExpTecService);
    }
    return this._avanceEntregableExpTecService;
  }

  public get procesoLiquidacionService(): ProcesoLiquidacionService{
    if (!this._procesoLiquidacionService) {
      this._procesoLiquidacionService = this.injector.get(ProcesoLiquidacionService);
    }
    return this._procesoLiquidacionService;
  }

  public get responsableElaboracionExpedienteService(): ResponsableElaboracionExpedienteService{
    if (!this._responsableElaboracionExpedienteService) {
      this._responsableElaboracionExpedienteService = this.injector.get(ResponsableElaboracionExpedienteService);
    }
    return this._responsableElaboracionExpedienteService;
  }

  public get dataexternaService(): DataexternaService{
    if (!this._dataexternaService) {
      this._dataexternaService = this.injector.get(DataexternaService);
    }
    return this._dataexternaService;
  }
  public get procesoSeleccionService(): ProcesoSeleccionService {
    if (!this._procesoSeleccionService) {
      this._procesoSeleccionService = this.injector.get(ProcesoSeleccionService);
    }

    return this._procesoSeleccionService;
  }

  public get resolucionContratoService(): ResolucionContratoService {
    if (!this._resolucionContratoService) {
      this._resolucionContratoService = this.injector.get(ResolucionContratoService);
    }

    return this._resolucionContratoService;
  }


}
