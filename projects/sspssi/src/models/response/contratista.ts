export class Contratista {
    public id_contratista_seguimiento_obra: number
    public id_seguimiento_monitoreo_obra: number
    public ruc: string = ""
    public razon_social: string = ""
    public apellido_representante_legal: string = ""
    public nombre_representante_legal: string = ""
    public dni_representante_legal: string = ""
    public telefono: string = ""
    public email: string = ""
    public tipo_contratista: boolean
    //public direccion: string = ""
    public usuario_creacion: string = ""
    public usuario_modificacion: string = ""
    public usuario_eliminacion: string = ""
    //otros atributos
    public ListDetalleContratista: Array<any>
}

/* export class Contratistas {
    public id_contratista_seguimiento_obra: number
    public ruc_detalle: string
    public razon_social_detalle: string
    public nombre_porcentaje_participacion: number
    
} */