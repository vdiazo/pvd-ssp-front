export interface IPeriodosValorizaciones {
    valorizacion: IValorizaciones[];
    adicionales:  IAdicionales[];
}

export interface IAdicionales {
    periodo_texto: string;
    periodo:       string;
}

export interface IValorizaciones {
    periodo_texto: string;
    periodo:       string;
}