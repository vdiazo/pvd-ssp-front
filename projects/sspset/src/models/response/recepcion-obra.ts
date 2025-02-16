export class RecepcionObra {
    //public id_seguimiento_monitoreo_obra: number;
    public id_seguimiento_ejecucion_expediente: number;

    //public id_liquidacion_recepcion_obra: number;
    public id_liquidacion_recepcion_expediente: number;
    
    public id_estado_recepcion_expediente: number;
    public fecha: Date;
    //public id_tipo_documento_recepcion: number;
    public id_tipo_documento_recepcion_expediente
    public observacion: string="";
    public nombre_archivo: string="";
    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";
    public id_recepcion_obra :number;
    
    constructor(

    ) { }
}