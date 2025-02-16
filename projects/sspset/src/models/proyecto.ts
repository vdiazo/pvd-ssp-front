export class Proyecto {
    public id_proyecto: number = 0;
    public cod_snip: number = 0;
    public cod_snip_texto: string = "";
    public id_municipalidad: number = 0;
    public nombre_municipalidad: string = "";
    public cod_depa: string = "";
    public id_zona: number = 0;
    public nombre_perfil: string = "";
    public id_detalle_usuario: number = 0;
    public id_usuario: number = 0;
    public id_perfil: number = 0;

    public nombre_proyecto: string = "";
    public id_estado: number = 0;
    public num_filas: number = 10;
    public num_pagina: number = 1;
    public page: number = 1;

    //atributos externos
    public codigo_estado: string = "";
    public coddepa: string = "";
    public id_unidad_ejecutora: number;
    public id_region: number;
    public intSkip: number = 10;
    public intTake: number = 0;
    public coddepartamento: string = ""
}