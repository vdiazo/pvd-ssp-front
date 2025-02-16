export class _proyecto {
  public id_proyecto: number
  public cod_snip: number
  public cod_unificado: number
  public nombre_proyecto: string
  public activo: boolean
  public usuario_creacion: string
}

export class _tramo {
  public id_proyecto: number;
  public id_tramo: number;
  public nombre_tramo: string;
  public descripcion_tramo: string;
  public codigo_ruta: string;
  public activo: boolean;
  public usuario_creacion: string;
  public usuario_modificacion: string;
  public usuario_eliminacion: string;


  //Datos Nuevos
  public id_municipalidad: number
  public id_ejecutora: number
}

export class _Tipofase {
  public id_tipo_fase: number
  public usuario_creacion: string
}

export class _convenio {
  public id_convenio: number
  public id_municipalidad: number
  public id_documento_compromiso: number
  public id_tipo_infraestructura: number
  public id_tipo_via: number
  public id_unidad_medida: number
  public id_fuente_financiamiento: number
  public monto: number
  public fecha_firma: Date
  public fecha_vigencia: Date
  public siglas: string
  public longitud: number
  public usuario_modificacion: string
  public usuario_creacion: string
  public usuario_eliminacion: string
  public nombre_archivo: string
  public id_ejecutora: number

  //atributos externos
  public nombre_documento_compromiso: string;
  public nombre_municipalidad: string;
  public nombre_tipo_fase: string;
}

export class Convenio {
  public _BE_Tm_Ssppvd_Proyecto: _proyecto
  public _BE_Tm_Ssppvd_Tramo: _tramo
  public _BE_Tm_Ssppvd_Fase: _Tipofase
  public _BE_Tm_Ssppvd_Convenio: _convenio
  public proyecto: Array<Proyecto>
}

export class Proyecto {
  public id_fase_convenio: number;
  public id_fase: number;
  public id_municipalidad: number;
  public id_ejecutora: number;
  public activo: boolean;
}

export class Busqueda {
  public id_fase: number;
  public siglas: string;
  public tramo: string;
  public proyecto: string;
  public cod_Proyecto: number;
  public cod_Snip: number;
  public estado_convenio: string;
}

export class TramoModal {
  public codProyecto: number;
  public nombreProyecto: string;
  public nombreTramo: string;
  public codigoRuta: string;
}

export class ConvenioValidar {
  public id_fase: number;
  public siglas: string;
}
export class ConvenioRegistrar {
  public idejecutora: number;
  public idproyecto: number;
  public idfase: number;
  public codSnip: number;
  public codProyecto: number;
  public nomProyecto: string;
  public nomUniEjecutora: number;
  public nomTramo: string;
  public codTramo: number;
  public nomFase: number;
  public nomDocumento: number;
  public nomDenomConvenio: number;
  public numMonto: number;
  public numMonto_texto: string;
  public fecFechaConvenio: Date;
  public fecFechaVigencia: Date;
  public nomSiglas: string;
  public nomConvenio: string;
  public nomInfraestructura: number;
  public nomVia: number;
  public nomUniMedida: number;
  public numLongitud: number;
  public numLongitud_texto: string;
  constructor(

  ) { }
}