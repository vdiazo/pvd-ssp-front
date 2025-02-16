export class AccionSeguimientoMonitoreo {
    public indice: number;
    //public id_accion_seguimiento_monitoreo_obra: number;
    public id_valorizacion_ejecucion_expediente:number; //nuevo
    //public id_seguimiento_monitoreo_obra: number;
    public id_seguimiento_ejecucion_expediente : number; //nuevo
    public fecha_valorizacion: Date;
    public monto: number | string;
    public avance_fisico_real: number;
    public avance_fisico_programado: number;
    public avance_financiero_real: number | string;
    public avance_financiero_programado: number | string;
    public id_estado_situacional: number;
    public observacion: string;
    public usuario_creacion: string;
    public usuario_modificacion: string;
    public usuario_eliminacion: string;
    public periodo: string;
    public periodo_texto: string;
    public tipo_avance: string;
    //otros atributos
    public nombre_monto:string;
    public nombre_estado_situacional: string;
    public nombre_archivo: string = "";
    constructor(

    ) { }
}