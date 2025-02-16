import { IFase } from "./IFase";

export interface IProyecto {
    id_proyecto:          number;
    cod_snip:             number;
    cod_unificado:        number;
    nombre_proyecto:      string;
    numero_tramos:        number;
    id_tramo:             number;
    nombre_tramo:         string;
    id_municipalidad:     number;
    nombre_municipalidad: string;
    fases:                IFase[];
    costo_proyecto:       number;
    monto_convenio:       number;
    monto_transferencia:  number;
    fecha_inicio_obra:    string;
    fecha_termino_obra:   string;
    id_geo_tramo:         number;
}


