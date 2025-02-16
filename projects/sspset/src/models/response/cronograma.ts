export class Cronograma  

{
    //public id_cronograma_ejecucion_financiera_obra : number = 0
    //public id_programa_ejecucion_financiera_obra : number = 0
    //public id_seguimiento_monitoreo_obra : number = 0
    public enero : number | string = ""
    public febrero : number | string = ""
    public marzo : number | string = ""
    public abril : number | string = ""
    public mayo : number | string = ""
    public junio : number | string = ""
    public julio : number | string = ""
    public agosto : number | string = ""
    public setiembre : number | string = ""
    public octubre : number | string = ""
    public noviembre : number | string = ""
    public diciembre : number | string = ""
    public total : number | string
    //public id_documento_aprobacion_obra : number = 0
    public id_documento_aprobacion_expediente : number=0;
    public id_actividad_padre : number;
    public id_actividad_ejecucion_expediente : number = 0;
    public id_seguimiento_ejecucion_expediente : number =0;
    public id_programa_ejecucion_expediente : number = 0;
    public id_tipo_actividad_expediente : number =0;

    //

    public fecha_aprobacion : Date = new Date()
    public archivo_convenio : string = ""
    public nombre_archivo : string = ""
    public usuario_creacion : string = ""
    public usuario_modificacion : string = ""
    public usuario_eliminacion: string = "";
    public id_ampliacion_obra : number;
    public definicion_cronograma_obra: string;
    public tipo_actividad: string;
   // public documento_aprobacion_expediente: string;
    
    constructor() {        
    }

    /**
    * La función validarMontosCronograma() devuelve un valor booleano que si retorna false es porque no se ha ingresado
    ningun monto en los meses del cronograma
    * @param No contiene parametros
    * @returns returns a boolean True|False
    */
    validarMontosCronograma() : boolean {
        if (this.enero  != 0) return true;
        if (this.febrero  != 0) return true;
        if (this.marzo  != 0) return true;
        if (this.abril  != 0) return true;
        if (this.mayo  != 0) return true;
        if (this.junio != 0) return true;
        if (this.julio  != 0) return true;
        if (this.agosto  != 0) return true;
        if (this.setiembre  != 0) return true;
        if (this.octubre  != 0) return true;
        if (this.noviembre  != 0) return true;
        if (this.diciembre  != 0) return true;

        return false;
    }

    /**
    * La función validarSeleccionesCronograma() devuelve un valor string con la descripción
    de la propiedad que es obligatoria y se encuentre con valor 0
    * @param No contiene parametros
    * @returns returns a string
    */
    validarSeleccionesCronograma() : string {
        if (this.id_programa_ejecucion_expediente == 0 ) return "Debe seleccionar el Programa de ejecución financiera.";
        if (this.id_documento_aprobacion_expediente == 0 ) return "Debe seleccionar el Documento de aprobación de obra.";
        return "";
    }

}