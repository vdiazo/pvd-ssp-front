export class Paralizacion {
    public id_paralizacion_obra: number;
    public id_seguimiento_monitoreo_obra: number;
    public motivo_paralizacion: string;
    public fecha_inicio: Date;
    public fecha_termino_sugerido: Date;
    public fecha_termino: Date;
    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";
    public nombre_archivo: string="";
    public perfil: string = "";
    
    constructor(

    ) { }
}
