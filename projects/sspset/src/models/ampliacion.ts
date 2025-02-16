export class Ampliacion {
    //public id_ampliacion_obra: number = 0;
    public id_ampliacion_seguimiento_ejecucion_expediente:number=0;
    public id_actividad_ejecucion_expediente:number=0;
    //public id_seguimiento_monitoreo_obra: number;
    public id_seguimiento_ejecucion_expediente:number;

    public fecha_inicio: Date;
    public fecha_fin: Date;
    public plazo_dias: number;
    public resolucion_aprobacion: string;
    //public resolucion_fecha: Date;
    public fecha_aprobacion: Date;
    public observacion: string;
    public usuario_creacion: string = "";
    public usuario_modificacion: string = "";
    public usuario_eliminacion: string = "";
    public file?: any;
    //otros atributos 
    public nombre_archivo: string = "";
    public ruta_archivo: string ="";
    public id_fase: number;
    public fecha_inicio_contractual: Date;
    public fecha_termino_contractual: Date;
    public fecha_termino: Date;
    public plazo_ejecucion: number;
    public archivo_convenio: string = "";

    //public id_causal_ampliacion: number;
    public id_causal_ampliacion_expediente:number;
    public resultado: string;
    public id_resultado_pedido_ampliacion: number

    constructor() {

    }
}