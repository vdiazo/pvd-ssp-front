export class ValorizacionObra {
   public id_accion_seguimiento_monitoreo_obra: number
   public id_seguimiento_monitoreo_obra: number
   public id_estado_situacional: number
   public periodo: string
   public avance_financiero_programado: number
   public avance_financiero_real: number
   public avance_fisico_programado: number
   public avance_fisico_real: number
   public fecha_valorizacion: Date
   public monto: number
   public nombre_archivo: string
   public observacion: string
   public usuario_creacion: string
   public usuario_modificacion: string
   public usuario_eliminacion: string
}