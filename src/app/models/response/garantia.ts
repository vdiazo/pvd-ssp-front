export class Garantia {
    public id_garantia: number;
    public id_proyecto: number;
    public numero_garantia: number;
    public url: string;
    public fecha_inicio: Date | string = "";;
    public fecha_termino: Date | string = "";
    public monto_garantia: number | string = "";
    //public monto_garantia_texto: string;
    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";
    
    constructor(

    ) { }
}
