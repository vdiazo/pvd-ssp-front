export enum tipoArchivoExpTecnico {
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
    ResolucionLiquidacionSupervicion  = 11,
    accionSeguimientoMonitoreo = 12,
    PresupuestoAdicionalObra = 13,
    DeductivoAdicionalObra = 14,
    AdelantoDirecto = 15,
    AdelantoMateriales = 16,
    ResolucionContrato = 17,
    ResolucionContratoExp = 39
}
export enum tipoArchivo {
    convenio = 2,
    paralizacion = 3,
    paralizacionAccion = 4,
    valorizaciones = 5,
    transferido = 6,
    cronograma = 7,
    //recepcionObra = 8,    
    //liquidacion = 9,
    //ResolucionLiquidacionObra = 10,
    //ResolucionLiquidacionSupervicion  = 11,
    accionSeguimientoMonitoreo = 12,
    PresupuestoAdicionalObra = 13,
    DeductivoAdicionalObra = 14,
    AdelantoDirecto = 15,
    AdelantoMateriales = 16,
    ResolucionContrato = 17,
    ResolucionContratoExp = 39,
    liquidacion = 21,
    recepcionObra=22,
    ResolucionLiquidacionObra=23,
    ResolucionLiquidacionSupervicion=24,
    documento_entregable=27,
    plan_entregable=28,
    documento_avance_entregable=29,
    ampliacion_exp_tec = 30,
    expedienteTecnico =32,
    IdTipoArchivoInformeAprobacion =33,
    IdTipoArchivoAprobacionResolucion =34,

}

export enum TipoFase {
    PERFIL = 1,
    FACTIBILIDAD = 2,
    EXPEDIENTE_TECNICO = 3,
    OBRA = 4
};

export enum TipoObjeto {
    OBRA = 1,
    BIENES_SERVICIOS = 2,
    CONSULTORIA_OBRA = 3
};

export enum AplicarTipoControl{
    Visible = 1,
    Ocultar = 2,
    Deshabilitar = 3
}