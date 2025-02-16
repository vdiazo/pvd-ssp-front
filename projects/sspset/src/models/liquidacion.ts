export class LiquidacionModal{
    //public estadoLiquidacion : number
    public id_estado_liquidacion_expediente : number;

    
    public nombreEstadoLiquidacion : string
	public fecha: Date
	public tipoDocumento: number
    public observaciones:string
    public nombreArchivo : string
    public nombreLiquidacionObra : string
    public montoLiquidacionObra : number
    public textoMontoObra : string
    public fechaLiquidacionObra : Date
    public archivoLiquidacionObra : string
    public nombreLiquidacionSupervision : string
    public montoLiquidacionSupervision : number
    public textoMontoSupervision : string
    public fechaLiquidacionSupervision : Date

    public archivoLiquidacionSupervision : string
    public fechaInformeAprobacion : Date
    public archivoInformeAprobacion : string
    public fechaAprobacionResolucion : Date
    public archivoAprobacionResoluion: string
}

export class Liquidacion{
    /*inicio campos nuevos expediente tecnico */
    public id_liquidacion_seguimiento_expediente : number;
    public id_seguimiento_ejecucion_expediente : number;
    public id_estado_liquidacion_expediente : number;
    public id_tipo_documento_liquidacion_expediente : number;
    public fecha_seguimiento_expediente  : Date;
    public nombre_archivo_seguimiento_expediente : string;
    public resolucion_liquidacion_expediente :string;

    public fecha_liquidacion_expediente : Date;
    public monto_liquidacion_expediente : number;
    public nombre_archivo_liquidacion_expediente : string;
    public resolucion_liquidacion_supervicion_expediente : string;
    public fecha_liquidacion_supervicion_expediente : Date;
    public monto_liquidacion_supervicion_expediente : number;
    public nombre_archivo_liquidacion_supervicion_expediente : string;

    public fecha_informe_aprobacion : Date;
    public nombre_archivo_informe : string;

    public fecha_aprobacion_expediente : Date;
    public nombre_archivo_aprobacion :string;


    /**fin de los nuevos campos */

    //public id_liquidacion_seguimiento : number
    //public id_seguimiento_monitoreo_obra : number
    //public id_estado_liquidacion : number
    //public fecha_seguimiento : Date
    //public id_tipo_documento_liquidacion : number
    public observaciones : string
    //public nombre_archivo_seguimiento : string
    //public resolucion_liquidacion_obra : string
    //public fecha_liquidacion_obra : Date
    //public monto_liquidacion_obra : number
    //public nombre_archivo_liquidacion_obra : string
    //ublic resolucion_liquidacion_supervicion : string
    //public fecha_liquidacion_supervicion : Date
    //public monto_liquidacion_supervicion : number
    //public nombre_archivo_liquidacion_supervicion : string

    public usuario_creacion : string
    public usuario_modificacion : string
    public usuario_eliminacion : string
}