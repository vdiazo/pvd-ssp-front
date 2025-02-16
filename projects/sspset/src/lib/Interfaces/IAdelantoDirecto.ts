export interface IAdelantoDirecto {
    id_adelanto_directo:           number | null;
    id_seguimiento_monitoreo_obra: number;
    nombre_adelanto_directo:       string;
    fecha_inicio:                  Date;
    fecha_termino:                 Date;
    monto_garantia:                number;
    monto_adelanto:                number;
    entidad_financiera:            string;
    nombre_archivo:                string;
    ruta_archivo:                  string;
    usuario_creacion:              string;    
    usuario_modificacion:          string;
    usuario_eliminacion:           string;
}

