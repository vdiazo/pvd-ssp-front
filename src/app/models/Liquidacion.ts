export class LiquidacionModal{
    public estadoLiquidacion : number
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
}

export class Liquidacion{
    public id_liquidacion_seguimiento : number
    public id_seguimiento_monitoreo_obra : number
    public id_estado_liquidacion : number
    public fecha_seguimiento : Date
    public id_tipo_documento_liquidacion : number
    public observaciones : string
    public nombre_archivo_seguimiento : string
    public resolucion_liquidacion_obra : string
    public fecha_liquidacion_obra : Date
    public monto_liquidacion_obra : number
    public nombre_archivo_liquidacion_obra : string
    public resolucion_liquidacion_supervicion : string
    public fecha_liquidacion_supervicion : Date
    public monto_liquidacion_supervicion : number
    public nombre_archivo_liquidacion_supervicion : string
    public usuario_creacion : string
    public usuario_modificacion : string
    public usuario_eliminacion : string
}