export class ParalizacionAccion {
    public id_paralizacion_accion_obra: number;
    public id_paralizacion_obra: number;
    public id_tipo_documento: number;
    public id_tipo_paralizacion_accion_obra: number;
    public fecha: Date;
    public observaciones: string;
    public usuario_creacion: string = "";
    public usuario_modificacion: string = "";
    public usuario_eliminacion: string = "";
    //atributos externos
    public nombre_tipo_documento: string;
    public nombre_accion: string;
    public nombre_archivo: string ="";
    constructor(

    ) { }
}