
export class Usuario {
    id_seguimiento_ejecucion_expediente:number =0;
    //id_usuario: number = 0;
    //dni: string;
    nro_dni: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    id_municipalidad: number;
    doc_designacion: string;
    usuario: string;
    usuario_creacion: string;
    usuario_modificacion: string;
    //cip: string;
    nro_colegiatura: string;
    id_perfil: number;
    foto: string;
    id_padre: number;
    es_colegiado: boolean;
    no_colegiado: boolean;
    no_corresponde: boolean;
    //id_colegio_profesional: null;
    id_tipo_colegiatura: null;
    correos: Correo[];
    telefonos: Telefono[];
    activo: string;
    //id_resp_expd_tecn_funcion: number;
    id_funcion_responsable:number;
    id_resp_expd_tecn: number;
    id_proyecto_detalle : number
}

export class Correo {
    id_resp_expd_tecn_correo?: number;
    //correo_electronico: string;
    email: string;
    usuario_creacion: string;
    usuario_modificacion?: string;
    usuario_anulacion?: string;
    //id_usuario_correo?: number;
    id_responsable_seguimiento_expediente?:number;
    estado?: boolean;
}

export class Telefono {
    id_resp_expd_tecn_telef?: number;
    telefono: string;
    usuario_creacion: string;
    usuario_modificacion?: string;
    usuario_anulacion?: string;
    //id_usuario_telefono?: number;
    id_responsable_seguimiento_expediente?:number;
    estado?: boolean;
}