export interface IAccionSeguimientoMonitoreo {
    cantidad_registro:        number;
    accion_seguimiento:       IAccionSegMonitoreo[];
    total_accion_seguimiento: ITotalAccionSeguimientoMonitoreo;
}

export interface IAccionSegMonitoreo {
    indice:                               number;
    id_accion_seguimiento_monitoreo_obra: number;
    id_seguimiento_monitoreo_obra:        number;
    fecha_valorizacion:                   string;
    monto:                                number;
    avance_fisico_real:                   number;
    avance_fisico_programado:             number;
    avance_financiero_real:               number;
    avance_financiero_programado:         number;
    id_estado_situacional:                number;
    nombre_estado_situacional:            string;
    observacion:                          string;
    periodo:                              string;
    periodo_texto:                        string;
    ruta_archivo:                         string;
    nombre_archivo:                       string;
    periodo_adicional:                    string;
    periodo_adicional_texto:              string;
    lista_archivos:                       IListaArchivo[];
    id_presupuesto_adicional_obra:        number;
}

export interface IListaArchivo {
    id_accion_seguimiento_monitoreo_obra_archivo: number;
    ruta_archivo:                                 string;
    nombre_archivo:                               string;
    selecciona_foto:                              boolean;
}

export interface ITotalAccionSeguimientoMonitoreo {
    id_seguimiento_monitoreo_obra: number;
    monto:                         number;
    avance_fisico_real:            number;
    avance_fisico_programado:      number;
    avance_financiero_real:        number;
    avance_financiero_programado:  number;
}
