export interface IColaboradores {
    data:              IColaborador[];
    cantidad_registro: number;
}

export interface IColaborador {
    id_usuario:           number;
    usuario:              string;
    nombre_usuario:       string;
    contrasenia:          string;
    correo_electronico:   string;
    dni_usuario:          string;
    id_area:              number;
    nombre_area:          string;
    celular:              string;
    estado:               boolean;
    usuario_creacion:     string;
    usuario_modificacion: string;
    tramos: ITramo[] | null
}

export interface IUsuarioTramo {
    id_usuario_tramo:     number;
    id_tramo:             string;
    activo:               boolean;
    usuario_creacion:     string;
    usuario_modificacion: string;
    usuario_eliminacion:  string;
}

export interface ITramo {
    seleccionado:     number;
    id_usuario_tramo: number | null;
    id_tramo:         number;
    cod_snip:         number;
    cod_unificado:    number;
    nombre_proyecto:  string;
    nombre_tramo:     string;
    id_municipalidad: number;
    activo:           boolean | null;
}