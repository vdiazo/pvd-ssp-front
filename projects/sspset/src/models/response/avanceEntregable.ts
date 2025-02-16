export class AvanceEntregable{
    public id_avance_entregable:number;
    public id_entregable_detalle_expediente:number;
    public tipo_seguimiento_actividad:string;
    public fecha_presentacion: Date = new Date();
    public fecha_conformidad: Date = new Date();
    public descripcion:string;
    public monto_pagado:number;
    public nombre_archivo:string;
    public usuario_creacion:string="";
    public usuario_eliminacion:string="";
    public nro_etregable:string ="";

}