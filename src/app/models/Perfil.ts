export class Perfiles{
    public id_perfil : number
	public nombre_perfil : string
    public estado : boolean
    public filtro_general : boolean = false
    public usuario_creacion:string
    public usuario_modificacion:string
    public usuario_anulacion:string
}

export class ModalPerfiles{
    public id_perfil : number
	public nombre_perfil : string
    public estado : boolean
    public filtro_general : boolean = false
}

export class ModalAsignacion{
    public id_perfil : number
	public id_menu : number
}

export class Asignacion{
    public id_detalle_perfil_menu : number
    public id_perfil : number
    public id_menu : number
    public estado : boolean
    public usuario_creacion:string
    public usuario_modificacion:string
    public usuario_anulacion:string
}

export class AsignacionComponente{
    public id_detalle_perfil_menu_componente : number
    public id_componente : number
    public id_detalle_perfil_menu : number
    public visible : boolean
    public usuario_creacion:string
    public usuario_modificacion:string
    public usuario_anulacion:string
}

export class ModalAsignacionComponente{
    public id_componente : number
    public id_detalle_perfil_menu : number
    public visible : boolean
    public usuario_creacion : string
}