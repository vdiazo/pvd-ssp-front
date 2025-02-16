export class Suspension {
    public id_suspension_obra: number;
    public id_seguimiento_monitoreo_obra: number;
    public motivo_suspension: string;
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