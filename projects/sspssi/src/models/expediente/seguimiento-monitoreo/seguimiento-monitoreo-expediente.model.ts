export class SeguimientoMonitoreoExpediente {
  public id_seguimiento_monitoreo_expediente: number;
  public id_fase: number;
  public fecha_inicio_contractual: Date | string;
  public fecha_termino_contractual: Date | string;
  public fecha_inicio_servicio: Date | string;
  public fecha_termino_servicio: Date | string;
  public fecha_termino: Date;
  public monto_contrato: number;
  public fecha_entrega_terreno: Date | string;
  public plazo_ejecucion: number;
  public usuario_creacion: string = "";
  public usuario_modificacion: string = "";
  public usuario_eliminacion: string = "";
  //atributos externos
  public ampliacion: number;
  public paralizacion: number;
  public fecha_term_cont_ampl_paral: Date;
  public fecha_term_cont_ampl: Date;
  public monto_adelanto_directo: number;

  constructor(

  ) { }
}
