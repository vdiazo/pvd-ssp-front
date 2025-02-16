export class Entregable{
    public id_entregable_expediente:number;
    public id_seguimiento_actividad:number;
    public  num_entregable:number;
    public monto_total:number;
    public fecha_aprobacion: Date = new Date();
    public nombre_archivo:string;
    public plan_archivo:string;
    public tipo_entregable:number;

    public usuario_eliminacion:string="";

    public _List_BE_Entregable_Detalle:DetalleEntregable;

}

export class DetalleEntregable{

}