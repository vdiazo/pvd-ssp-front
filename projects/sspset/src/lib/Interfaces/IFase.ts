export interface IFase {
    id_fase: number | null;
    id_tipo_fase: number | null;
    nombre_tipo_fase: string;
    id_municipalidad: number | null;
    id_seguimiento_monitoreo_obra: number | null;
    porcentaje_avance: number;
    estado_tramo: string;
}