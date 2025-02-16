export interface IReporteUnidadEjecutora {
    detalle_usuario: IDetalleUsuario[];
    cantidad:        number;
}

export interface IDetalleUsuario {
    nombre_usuario:       string;
    correo_electronico:   string;
    celular:              string;
    nombre_area:          string;
    nombre_municipalidad: string;
    departamento:         string;
}