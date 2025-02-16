export interface IConvenio {
    id_convenio:              number;
    fecha_firma:              Date;
    fecha_vigencia:           Date;
    id_documento_compromiso:  number;
    id_fuente_financiamiento: number;
    id_tipo_infraestructura:  number;
    id_tipo_via:              number;
    id_unidad_medida:         number;
    longitud:                 number;
    monto:                    number;
    siglas:                   string;
    usuario_creacion:         string;
    nombre_archivo:           string;
    _BE_Tm_Ssppvd_Proyecto:   IBETmSsppvdProyecto;
}

export interface IBETmSsppvdProyecto {
    id_proyecto:            number;
    cod_snip:               number;
    cod_unificado:          number;
    nombre_proyecto:        string;
    activo:                 boolean;
    usuario_creacion:       string;
    ListBE_Tm_Ssppvd_Tramo: IListBETmSsppvdTramo[];
}

export interface IListBETmSsppvdTramo {
    id_tramo:             number;
    nombre_tramo:         string;
    descripcion_tramo:    string;
    activo:               boolean;
    usuario_creacion:     string;
    usuario_modificacion: string;
    _BE_Tm_Ssppvd_Fase:   IBETmSsppvdFase;
}

export interface IBETmSsppvdFase {
    id_tipo_fase:                number;
    usuario_creacion:            string;
    _BE_Td_Ssppvd_Fase_Convenio: BETdSsppvdFaseConvenio;
}

export interface BETdSsppvdFaseConvenio {
    id_municipalidad: number;
    id_ejecutora:     number;
    usuario_creacion: string;
}

export interface IConvenioListado {
    cantidad_registro: number;
    convenios:         IConvenioData[];
}

export interface IConvenioData {
    id_proyecto:                 number;
    nombre_proyecto:             string;
    id_tramo:                    number;
    nombre_tramo:                string;
    id_fase:                     number;
    id_tipo_fase:                number; 
    nombre_tipo_fase:            string;
    id_convenio:                  number;
    id_municipalidad:            number;
    nombre_municipalidad:        string;
    id_documento_compromiso:     number;
    nombre_documento_compromiso: string;
    id_tipo_infraestructura:     number;
    nombre_tipo_infraestructura: string;
    id_tipo_via:                 number;
    nombre_tipo_via:             string;
    id_unidad_medida:            number;
    nombre_unidad_medida:        string;
    id_fuente_financiamiento:    number;
    nombre_fuente:               string;
    monto:                       number;
    fecha_firma:                 string;
    fecha_vigencia:              string;
    siglas:                      string;
    longitud:                    number;
    cod_snip:                    number;
    cod_unificado:               number;
    id_ejecutora:                number;
    nombre_archivo:              string;
    archivo_convenio:            string;
    proyecto:                    IProyectoData[];
}

export interface IProyectoData {
    id_proyecto:      number;
    nombre_proyecto:  string;
    id_tramo:         number;
    nombre_tramo:     string;
    id_fase:          number;
    id_tipo_fase:     number;
    nombre_tipo_fase: string;
    cod_snip:         number;
    cod_unificado:    number;
    activo:           boolean;
    id_fase_convenio: number;
    id_municipalidad: number;
    id_ejecutora:     number;
    ejecutora: string;
}
