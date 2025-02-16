import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../appSettings/settings';
import { IColaborador, IUsuarioTramo, IColaboradores, ITramo } from '../Interfaces';
import { Observable } from 'rxjs/Observable';
import { ElementInstructionMap } from '@angular/animations/browser/src/dsl/element_instruction_map';

@Injectable({
    providedIn: 'root'
})
export class ColaboradorService {

    constructor(private http: HttpClient) { }

    listarColaboradores(strUsuario: string = "", IdMunicipalidad: number, num_filas: number, numero_Pagina: number) : Observable<IColaboradores> {
        let url = Settings.API_ENDPOINT + `api/listarUsuarioColaborador/?strUsuario=${strUsuario}&intIdMunicipalidad=${IdMunicipalidad}&intTamanio=${num_filas}&intInicio=${numero_Pagina}`;
        return this.http.get<IColaboradores>(url);
    }

    procesarUsuarioColaborador(colaborador: IColaborador, usuarioTramos: IUsuarioTramo[]) {
        let entity = {
            data: JSON.stringify(
                {
                    _BE_Td_Ssppvd_Usuario: colaborador,
                    List_BE_Td_Ssppvd_Usuario_Tramo: usuarioTramos
                }
            )
        }

        let url = Settings.API_ENDPOINT + "api/procesarUsuarioColaborador";
        return this.http.post(url, entity);
    }

    listarTramosDeProyectos(idMunicipalidad: number) : Observable<ITramo[]>
    {
        let url = Settings.API_ENDPOINT + `api/listarUsuarioColaboradorTramo?intIdMunicipalidad=${idMunicipalidad}`
        return this.http.get<ITramo[]>(url);
    }

    listarUsuarioColaboradorTramo(idUsuario: number, idMunicipalidad: number): Observable<IColaborador[]>{
        let url = Settings.API_ENDPOINT + `api/obtenerUsuarioColaborador?intIdUsuario=${idUsuario}&intIdMunicipalidad=${idMunicipalidad}`
        return this.http.get<IColaborador[]>(url);
    }
}
