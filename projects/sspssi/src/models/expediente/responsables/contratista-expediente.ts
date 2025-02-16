export class ContratistaExpediente {
  public id_contratista_seguimiento_expediente: number;
  public id_seguimiento_monitoreo_expediente: number;
  public ruc: string;
  public razon_social: string;
  public dni_representante: string;
  public apellidos_representante: string;
  public nombres_representante: string;
  public telefono: string;
  public email: string;
  public usuario_creacion: string;
  public usuario_modificacion: string;
  public usuario_eliminacion: string;
  public listDetalleContratista: Array<any>;
}
