export class SupervisorEstudio {
    public id_supervisor_estudio:number;
    public id_supervisor_seguimiento_obra: number;
    public id_supervisor_seguimiento_expediente:number;
    public id_seguimiento_ejecucion_expediente : number;
    public id_tipo_colegiatura_expediente: number;
    public dni: string = "";
    public apellidos: string = "";
    public nombres: string = "";
    public nro_colegiatura: string = "";
    public fecha_designacion: Date;
    public telefono: string = "";
    public email: string = "";
    public usuario_creacion: string = "";
    public nombre_archivo: string ="";
}