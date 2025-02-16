export class Inspector {
    public id_inspector_seguimiento_obra: number;
    public id_seguimiento_monitoreo_obra: number;
    public id_tipo_colegiatura: number;
    public dni: string = "";
    public apellidos: string = "";
    public nombres: string = "";
    public nro_colegiatura: string = "";
    public fecha_designacion: Date;
    public telefono: string = "";
    public email: string = "";
    public usuario_creacion: string = "";
    public usuario_modificacion: string = "";
    public usuario_eliminacion: string = "";
    public nombre_archivo:string='';
    //otros atributos
    public nombre_tipo_colegiatura: string = "";
}