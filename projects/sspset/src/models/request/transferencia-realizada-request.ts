import { TransferenciaMaestra } from "../response/transferencia-maestra";
import { TransferenciaConvenio } from "../response/transferencia-convenio";
import { TransferenciaArchivo } from "../response/transferencia-archivo";


export class TransferenciaRealizadaRequest {
    public _BE_Tm_Ssppvd_Transferencia: TransferenciaMaestra;
    public ListBE_Td_Ssppvd_Transferencia_Convenio: Array<TransferenciaConvenio> = [];
    public ListBE_Td_Ssppvd_Transferencia_Archivo: Array<TransferenciaArchivo> = [];
}