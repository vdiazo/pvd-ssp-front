export class AdelantoDirectoExpediente {
  id_adelanto_directo: number | null;
  id_seguimiento_monitoreo_expediente: number;
  nombre_adelanto_directo: string;
  fecha_inicio: Date | string;
  fecha_termino: Date | string;
  monto_garantia: number;
  monto_adelanto: number;
  entidad_financiera: string;
  nombre_archivo: string;
  ruta_archivo: string;
  usuario_creacion: string;
  usuario_modificacion: string;
  usuario_eliminacion: string;
}