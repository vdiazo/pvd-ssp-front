import { IPerfil } from "./IPerfil";

export interface IUserInfo {
    id_usuario:         string;
    usuario:            string;
    nombre_usuario:     string;
    correo_electronico: string;
    dni_usuario:        string;
    id_area:            number;
    nombre_area:        string;
    valido:             boolean;
    fecha_modificacion: string;
    perfil:             IPerfil[];
    token:              string;
    modulo:             string;
}