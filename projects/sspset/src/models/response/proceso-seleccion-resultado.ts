export class ProcesoSeleccionResultado {
    public identificador: number;
    public entidad: string="";
    public descripcion_proceso: string="";
    public tipo_seleccion: string="";
    public modalidad: string="";
    public normativa: string="";
    public sistema_contratacion: string="";
    public normenclatura: string="";
    public fecha_publicacion: Date;
    public valor_referencial_item: number;
    public estado_item: string= "";
    public fecha_buena_pro: Date;
    public fecha_buena_pro_consentidad: Date;
    public valor_adjudicado_item: number;
    public moneda: string= "";
    public numero_contrato: string= "";
    public fecha_contrato: Date;
    public consorcio: string= "";
    public url_contrato: string = "";
    public nombre_proyecto: string = "";
    public ListBE_Proceso_Seleccion_Detalle: Array<{}>;
    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";

    constructor(

    ) { }
}
