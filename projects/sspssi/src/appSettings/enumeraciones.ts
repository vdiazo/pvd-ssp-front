export enum tipoArchivo {
    ampliacion = 1,
    convenio = 2,
    paralizacion = 3,
    paralizacionAccion = 4,
    valorizaciones = 5,
    transferido = 6,
    cronograma = 7,
    recepcionObra = 8,
    liquidacion = 9,
    ResolucionLiquidacionObra = 10,
    ResolucionLiquidacionSupervicion = 11,
    accionSeguimientoMonitoreo = 12,
    PresupuestoAdicionalObra = 13,
    DeductivoAdicionalObra = 14,
    AdelantoDirecto = 15,
    AdelantoMateriales = 16,
    ResolucionContrato = 17,
    CierreTransfFisica = 18,
    CierreTransfContable = 19,
    ConvenioActaCompromiso = 20,
    responsableInspector = 41,
    responsableResidente = 42,
    responsableSupervisor = 43,

    // Expediente Tecnico
    ampliacionExpediente = 21,
    adelantoDirectoExpediente = 22,
    administradorProyecto = 23,
    plan_trabajo = 24,
    cronogramaEntregables = 25,
    presentacionEntregables = 26,
    aprobacionEntregables = 27,
    accionSeguimientoMonitoreoExpediente = 28,
    paralizacionExpediente = 29,
    AccionParalizacionExpediente = 30,
    adicionalExpediente = 31,
    deductivoExpediente = 32,
    aprobacionExpediente = 33,
    cronogramaObraExpediente = 34,
    archivoLiquidacionExpediente = 35,
    resolucionAprobacionLiquidacionContratoExpediente = 36,
    resolucionContratoExpediente = 37,
    actaEntregaTerrenoExpediente = 38,

    // preinversion
    adelantoDirectoPreinversion = 44,
    ampliacionPreinversion = 45,
    aprobacionEntregablesPreinversion = 46,
    accionSeguimientoMonitoreoPreinversion = 47,
    informeAprobacionPreinversion = 48,
    informeAprobacionDireccionPreinversion = 49,
    resolucionAprobacionLiquidacionContratoPreinversion = 50,
    administradorProyectoPreinversion = 51,


}

export enum TipoFase {
    PREINVERSION = 1,
    PERFIL = 2,
    FACTIBILIDAD = 3,
    EXPEDIENTE_TECNICO = 4,
    OBRA = 5
};

export enum TipoObjeto {
    OBRA = 1,
    BIENES_SERVICIOS = 2,
    CONSULTORIA_OBRA = 3
};

export enum AplicarTipoControl {
    Visible = 1,
    Ocultar = 2,
    Deshabilitar = 3
}
