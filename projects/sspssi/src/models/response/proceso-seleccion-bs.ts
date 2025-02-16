
export class ProcesoSeleccionBienesServicios {
    public id_fase: number;
    public tipo_seleccion: number;
    public nomenclatura: string="";
    public fecha_publicacion: Date;
    public descripcion: string;
    public estado_proceso: string;
    public fecha: Date;
    public valor_referencial: number;
    public comentario: string;
    public accion: string;
    public correspondeproyecto: boolean;
    public seleccion: boolean;
    public mostrar_control: string;
    public id_municipalidad: number;
    public id_proyecto: number;
    public id_proceso_seleccion_obra: number;
    public fecha_modificacion: Date;
    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";


    constructor(

    ) { }
}
