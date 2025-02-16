export interface Sesion {
    usuario: string;
    municipalidad: string;
    idmunicipalidad:number;
    
 }
 export class AppUserAuth {
    menu:any;
    id_detalle_usuario:any;
    componente: AppUserClaim[] = [];
    coalesce: AppUserClaim[] = [];
  }
  
  export class AppUserClaim  {
    habilitado:boolean
    id_componente:number;
    id_menu:number;
    id_usuario:number;
    nombre_componente:string;
    visible:boolean;
  }
 