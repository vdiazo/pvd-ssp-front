export class DeductivoReduccion {
    public id_deductivo_reduccion_obra: number;
    public id_seguimiento_monitoreo_obra: number;
    public monto_presupuesto: number;
    public resolucion_aprobacion: string;
    public resolucion_fecha: Date;
    public incidencia: number;
    public concepto: string;
    public observacion: string;
    public nombre_archivo: string = "";
    public usuario_creacion: string = "";
    public usuario_modificacion: string = "";
    public usuario_eliminacion: string = "";
}
