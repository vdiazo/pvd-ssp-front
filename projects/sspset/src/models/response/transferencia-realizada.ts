import { TransferenciaConvenio } from "./transferencia-convenio";
import { TransferenciaMaestra } from "./transferencia-maestra";
import { TransferenciaArchivo } from "./transferencia-archivo";

export class TransferenciaRealizada {
    public id_transferencia: number;
    public fecha_publicacion: Date | string;
    public fecha: Date | string;
    public dispositivo: string;
    public numero_proyectos: string;
    public monto_transferido: number | string;

    public _BE_Tm_Ssppvd_Transferencia: TransferenciaMaestra;
    public ListBE_Td_Ssppvd_Transferencia_Convenio: Array<TransferenciaConvenio> = [];
    public ListBE_Td_Ssppvd_Transferencia_Archivo: Array<TransferenciaArchivo> = [];

    public usuario_creacion: string="";
    public usuario_modificacion: string="";
    public usuario_eliminacion: string="";
}