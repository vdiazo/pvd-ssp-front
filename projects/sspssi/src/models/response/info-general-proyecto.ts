export class InfoGeneralProyecto {
  general: InfoDetalleGeneralProyecto;
  estudio: InfoEstudioProyecto;
  expediente: InfoExpedienteProyecto;

  constructor() {
    this.general = null;
    this.estudio = null;
    this.expediente = null;
  }
}

export class InfoDetalleGeneralProyecto {

  codigo_unico: number;
  nombre: string;
  beneficiario: number;
  cadena: string;
  sector: string;
  ubicacion: UbigeoProyecto[];
  entidad: string;
  unidadformuladora: string;
  evaluadora: string;

  constructor() {
    this.codigo_unico = 0;
    this.nombre = '';
    this.beneficiario = 0;
    this.cadena = '';
    this.sector = '';
    this.ubicacion = [];
    this.entidad = '';
    this.unidadformuladora = '';
    this.evaluadora = '';
  }
}

export class InfoEstudioProyecto {
  estado: string;
  fechaviabilidad: string;
  montoviable: number;
  nivelestudio: string;

  constructor() {
    this.estado = '';
    this.fechaviabilidad = '';
    this.montoviable = 0;
    this.nivelestudio = '';
  }
}

export class InfoExpedienteProyecto {
  montof15: number;
  montoreformulado: number;
  montototalinversion: number;
  montototalregistro: number;

  constructor() {
    this.montof15 = 0;
    this.montoreformulado = 0;
    this.montototalinversion = 0;
    this.montototalregistro = 0;
  }
}

export class UbigeoProyecto {
  departamento: string;
  provincia: string;
  distrito: string;

  constructor() {
    this.departamento = '';
    this.provincia = '';
    this.distrito = '';
  }
}