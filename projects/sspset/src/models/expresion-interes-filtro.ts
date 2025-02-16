export class FiltroExpresionInteres{
    //public identificador : number
    public anio : number
    public des_expresion_interes: string = ""
    public fecha_publicacion_desde: Date | string
    public fecha_publicacion_hasta: Date | string
    public num_filas: number = 10;
    public num_pagina: number = 0;

    public id_paquete: number = 0;
}
