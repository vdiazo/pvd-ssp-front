export interface IAccionSeguimientoMonitoreo {
    cantidad_registro:        number;
    valorizacion_ejecucion_expediente:       IAccionSegMonitoreo[];
    total_valorizacion_ejecucion_expediente: ITotalAccionSeguimientoMonitoreo;
}

export interface IAccionSegMonitoreo {
    indice:                               number;
    //id_accion_seguimiento_monitoreo_obra: number;
    id_valorizacion_ejecucion_expediente: number; //nuevo
    //id_seguimiento_monitoreo_obra:        number;
    id_seguimiento_ejecucion_expediente : number; //nuevo
    fecha_valorizacion:                   string;
    monto:                                number;
    avance_fisico_real:                   number;
    avance_fisico_programado:             number;
    avance_financiero_real:               number;
    avance_financiero_programado:         number;
    //id_estado_situacional:                number;
    id_estado_situacional_valorizacion_expediente: number;
    nombre_estado_situacional:            string;
    observacion:                          string;
    periodo:                              string;
    periodo_texto:                        string;
    ruta_archivo:                         string;
    nombre_archivo:                       string;
    periodo_adicional:                    string;
    periodo_adicional_texto:              string;
    lista_archivos:                       IListaArchivo[];
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
