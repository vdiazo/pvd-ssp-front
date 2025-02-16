export class Capacitacion{
    public id_capacitacion:number;
    public id_tipo_capacitacion:number;
    public denominacion:string;
    public nombre_archivo:string;
    public _List_BE_Td_Ssppvd_Detalle_Capacitacion:Array<detalleCapacitacion>;
    public usuario_creacion:string;
    public usuario_modificacion:string;
    public usuario_eliminacion:string;
    

}

export class CapacitacionModal{
    public id_capacitacion:number;
    public id_tipo_capacitacion:number;
    public denominacion:string;
    public nombre_archivo:string;
    public _List_BE_Td_Ssppvd_Detalle_Capacitacion:Array<detalleCapacitacion>;
    public usuario_creacion:string;
}

export class detalleCapacitacion{
    public id_detalle_capacitacion:number;
    public nombre_archivo:string;
    public activo:boolean;
    public denominacion:string;
    //public usuario_creacion: string;
}