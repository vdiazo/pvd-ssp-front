export class Usuario {
	public id_usuario : number
	public usuario: string
	public contrasenia: string
	public nombre_usuario: string
	public correo_electronico:string
    public celular:string
    public dni_usuario:string
    public usuario_creacion:string
    public usuario_modificacion:string
    public usuario_anulacion:string
    public estado:boolean
    public id_area:number
    public ger_ofi_res_ejecucion_proyecto : string = ""
}

export class UsuarioModal{
    public codUsuario : number
	public usuario: string
	public nombre: string
	public correo:string
    public celular:string
    public dni:string
    public codArea:number
}

export class UsuarioClaveModal{
    public nombreUsuario : string
    public nuevaClave : string
	public repetirClave: string
	public correo:string
    public celular:string
    public gerencia:string
}

export class UsuarioPerfil{
    public nombreUsuario : string
	public correo: string
	public celular:string
    public dni:string
    public municipalidad : string
    public gerencia : string
}
export class Acceso{
    public id_detalle_usuario : number
	public id_usuario : number
    public id_perfil:number
    public id_municipalidad:number
    public es_municipalidad:boolean
    public id_zona : number
    public coddepa : string
    public usuario_creacion:string
    public usuario_modificacion:string
    public usuario_anulacion:string
    public id_modulo:number
}

export class AccesoModal{
    public codUsuario : number
    public codPerfil:number
    public nombrePerfil : string
    public codMunicipalidad:number
    public bolMunicipalidad:boolean
    public codZonal:number
    public codDepartamento:number
    public codDepaArray = []
    public nombreDepartamento:string
    public id_modulo:number
}