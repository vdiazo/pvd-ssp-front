export class SuspensionAccion {
    public id_suspension_accion_obra: number;
    public id_suspension_obra: number;
    public id_tipo_documento: number;
    public id_tipo_suspension_accion_obra: number;
    public fecha: Date;
    public observacion: string;
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