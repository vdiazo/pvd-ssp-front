export class TransferenciaRealizadaRequest {
    public fecha_publicacion_desde: Date | string;
    public fecha_publicacion_hasta: Date | string;
    public dispositivo:string="";
    public num_filas:number=10;
    public num_pagina:number=1;
}