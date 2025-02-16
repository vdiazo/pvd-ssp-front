export class SeguimientoMonitoreo {
    public id_seguimiento_monitoreo_obra: number;
    public id_fase: number;
    public fecha_inicio_contractual: Date;
    public fecha_termino_contractual: Date;
    public fecha_termino: Date;
    public plazo_ejecucion: number;
    public usuario_creacion: string = "";
    public usuario_modificacion: string = "";
    public usuario_eliminacion: string = "";
    //atributos externos
    public ampliacion: number;
    public paralizacion: number;
    public fecha_term_cont_ampl_paral: Date;
    public fecha_term_cont_ampl: Date;
    public monto_garantia_materiales: number;
    public monto_garantia_directo: number;

    constructor(

    ) { }
}

export class Fase {
    public id_tipo_fase: number
    public id_tramo: number
    public id_municipalidad: number
    public usuario_creacion: string = ""
    public usuario_modificacion: string = ""
    public usuario_eliminacion: string = ""
}

export class _SeguimientoMonitoreo {
    public _BE_Tm_Ssppvd_Fase: Fase;
    public _BE_Td_Ssppvd_Seguimiento_Monitoreo_Obra: SeguimientoMonitoreo;
}