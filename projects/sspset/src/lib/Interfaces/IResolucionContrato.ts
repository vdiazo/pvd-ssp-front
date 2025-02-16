export interface IResolucionContrato {
    id_resolucion_contrato: number | null;
    id_seguimiento_ejecucion_expediente: number;
    id_fase: number;
    id_tipo_documento: number;
    fecha_emision_documento: Date;
    descripcion: string;
    nombre_archivo: string;
    ruta_archivo: string;
    usuario_creacion: string;
    usuario_modificacion: string;
    usuario_eliminacion: string;
}