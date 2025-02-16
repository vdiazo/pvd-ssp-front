export class DeductivoExpediente {
  public id_deductivo_expediente: number;
  public id_seguimiento_ejecucion_expediente: number;
  public monto_presupuesto: number;
  public resolucion_aprobacion: string;
  public fecha_resolucion: Date;
  public observacion_deductivo: string;
  public documento_deductivo: string;
  public ruta_documento_deductivo: string;
  public usuario_creacion: string;
  public usuario_modificacion: string;
  public usuario_eliminacion: string;
}