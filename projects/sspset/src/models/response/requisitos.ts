export interface Documento {
    id_proyecto_detalle_doc: number;
    nombre_archivo: string;
    nombre_original: string;
    es_correcto?: boolean;
    observacion: string;
    tamanio: string;
    orden?: number;
    observacion_destino?: any;
    es_correcto_destino?: any;
    fecha_creacion: Date;

}

export interface Requisito {
    id_proyecto_detalle: number;
    id_contenido_exptec: number;
    expediente_tecnico: string;
    nivel: number;
    orden: number;
    id_padre?: number;
    flag_archivo: boolean;
    cantidad_archivos:number;
    es_obligatorio:boolean;
    es_observado:boolean;
    observacion?:string;
    es_correcto?:boolean;
    no_corresponde?: boolean;
    observacion_destino?: string;
    es_correcto_destino?: any;
    flag_formulario:boolean;
    revisado_evaluador:boolean;
    observado_evaluador:boolean;

    documentos: Documento[];
    llenado:boolean;
}