import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccesoModal, Acceso } from '../../../models/Usuario';
import { Functions } from '../../../appSettings/functions';
import { FacadeService } from '../../../patterns/facade.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { take } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-modal-acceso',
  templateUrl: './modal-acceso.component.html',
  styleUrls: ['./modal-acceso.component.css']
})
export class ModalAccesoComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal: AccesoModal;
  entidadEditar;
  municipalidades;
  usuarios;
  perfiles=[];
  departamentos;
  zonales;
  cambiarEditar: boolean = true;
  respuesta;
  //deshabilitar
  desZonal: boolean = true;
  desDepartamento: boolean = false;
  desMuni: boolean = false;

  desCheck: boolean = false;
  ListadoSistemas: any = [];
  id_modulo: number = null;
  @ViewChild('buscarCombosistema') buscarCombosistema: NgSelectComponent;
  @ViewChild('editarCombosistema') editarCombosistema: NgSelectComponent;
  @ViewChild('comboPerfiles') comboPerfiles: NgSelectComponent;
  
  esSSP: boolean = false;
  constructor(public modalRef: BsModalRef,
    private fs: FacadeService,
    public funciones: Functions) { }

  ngOnInit() {

    this.entidadModal = new AccesoModal();
    this.listarUsuarios();
    this.listarZonas();
    this.listarDepartamentos();

    if (this.entidadEditar != null) {
      this.cambiarEditar = false;
      this.validarPerfiles(this.entidadEditar);
      //this.setearCamposEditar();

      this.Configurar(2,sessionStorage.getItem("Nombre_Perfil"));

    }
    else {
      this.CargarPerfiles(this.ListadoSistemas[0]);
      this.Configurar(1,sessionStorage.getItem("Nombre_Perfil"));
    }
  }

  validarMuni(evento) {

    this.desZonal = true;
    this.desDepartamento = true;
    this.entidadModal.codZonal = null;
    this.entidadModal.codDepartamento = null;
    this.entidadModal.codMunicipalidad=null;
    this.entidadModal.codPerfil = null;
    this.entidadModal.nombrePerfil =null;
    this.entidadModal.codDepaArray=[];
    if (evento) {
      let asignar = this.perfiles.find(x => x.nombre_perfil == "RESPONSABLE");
      if(asignar!=null){
        this.entidadModal.codPerfil = asignar.id_perfil;
        this.entidadModal.nombrePerfil = asignar.nombre_perfil;
      }
      this.desMuni = false;
    }
    else{
      this.desMuni = true;
    }
  }
  validarPerfiles(evento) {
    if (evento == null) {
      this.entidadModal.nombrePerfil = null;
      this.desZonal = true;
      this.entidadModal.codZonal = null;
      this.desDepartamento = false;
      this.desMuni = false;
      return;
    }
    if (evento.nombre_perfil == "COORDINADOR" || evento.nombre_perfil == "ESPECIALISTA") {
      this.entidadModal.nombrePerfil = evento.nombre_perfil;
      this.desZonal = true;
      this.entidadModal.codZonal = null;
      this.desDepartamento = false;
      this.desMuni = true;
      this.entidadModal.codMunicipalidad = null;
    }
    else if (evento.nombre_perfil == "MONITOR MACROZONAL") {
      this.entidadModal.nombrePerfil = evento.nombre_perfil;
      this.desZonal = false;
      this.desDepartamento = true;
      this.entidadModal.codDepartamento = null;
      this.desMuni = true;
      this.entidadModal.codMunicipalidad = null;
    }
    else if (evento.nombre_perfil == "ADMINISTRADOR" || evento.nombre_perfil == "CONSULTA") {
      this.entidadModal.nombrePerfil = evento.nombre_perfil;
      this.desZonal = true;
      this.entidadModal.codZonal = null;
      this.desDepartamento = false;
      this.desMuni = true;
      this.entidadModal.codMunicipalidad = null;
    }
    else if (evento.nombre_perfil == "RESPONSABLE") {
      this.entidadModal.nombrePerfil = evento.nombre_perfil;
      this.desZonal = true;
      this.entidadModal.codZonal = null;
      this.desDepartamento = true;
      this.desMuni=false;
      this.entidadModal.codDepartamento=null;
      this.entidadModal.bolMunicipalidad=true;
    }
    else if (evento.nombre_perfil == "ESPECIALISTA") {
      this.entidadModal.nombrePerfil = evento.nombre_perfil;
      this.desZonal = true;
      this.entidadModal.codZonal = null;
      this.desDepartamento = false;
      this.desMuni=true;
      this.entidadModal.bolMunicipalidad=false;
    }
  }
  administrarTramo() {
    if (this.entidadEditar == null) {
      this.guardarUsuario();
    } else {
      this.editarUsuario();
    }
  }
  setearCamposEditar() {
    this.entidadModal.codUsuario = this.entidadEditar.id_usuario;
    this.entidadModal.bolMunicipalidad = this.entidadEditar.es_municipalidad;
    this.entidadModal.codPerfil = this.entidadEditar.id_perfil;
    this.entidadModal.codMunicipalidad = this.entidadEditar.id_municipalidad == 0 ? null : this.entidadEditar.id_municipalidad;
    if (this.entidadEditar.coddepa == "") {
      this.entidadModal.codDepaArray = [];
    } else {
      let arreglo = [];
      arreglo = this.entidadEditar.coddepa.split(',');
      this.entidadModal.codDepaArray = arreglo;
    }
    this.entidadModal.codZonal = this.entidadEditar.id_zona == 0 ? null : this.entidadEditar.id_zona;

    this.entidadModal.id_modulo = this.entidadEditar.id_modulo;
    this.editarCombosistema.disabled = true;
    this.CargarPerfiles(this.entidadModal, this.entidadEditar.codigo_modulo);



  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  listarMunicipalidades():Promise<any>{
    let promise = new Promise( (resolve, reject) => {
      this.fs.maestraService.listarMunicipalidad().subscribe(
        (data:any) => {
          resolve(true);
          this.municipalidades = data;
        },
        ()=>{resolve(false);}
      )
    });
    return promise;

  }
  listarMunicipalidadesDepa():Promise<any> {
    let promise = new Promise( (resolve, reject) => {
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.fs.accesoService.listarMunicipalidadDepatarmento(usuario, perfil).pipe(take(1)).subscribe(
      (data:any) => {
        this.municipalidades = data;
        resolve(true);
        },
        ()=>{resolve(false);}
      );
    });
    return promise;
  }
  //

  // listarPerfilesCoordinador() {
  //   this.fs.maestraService.listarPerfiles().subscribe(
  //     (data:any) => {
  //       console.log("lsitar perfiles coordinador");
  //       this.perfiles = data;
  //       let asignar = this.perfiles.find(x => x.nombre_perfil == "RESPONSABLE");
  //       this.entidadModal.codPerfil = asignar.id_perfil;
  //       this.entidadModal.nombrePerfil = asignar.nombre_perfil;
  //       this.desZonal = true;
  //       this.entidadModal.codZonal = null;
  //       this.desMuni = false;
  //       this.desDepartamento = true;
  //       this.entidadModal.codDepartamento = null;
  //     }
  //   )
  // }

  // listarPerfiles() {
  //   this.fs.maestraService.listarPerfiles().subscribe(
  //     (data:any) => {
  //       console.log("lsitar perfiles");

  //       this.perfiles = data;
  //     }
  //   )
  // }

  listarUsuarios() {
    let usuario = sessionStorage.getItem("IdUsuario");
    let perfil = sessionStorage.getItem("Id_Perfil");
    this.fs.accesoService.listarUsuarioCombo(usuario, perfil).subscribe(
      data => {
        this.respuesta = data;
        this.usuarios = this.respuesta;
      }
    )
  }

  listarZonas():Promise<any> {
    let promise = new Promise( (resolve, reject) => {

      this.fs.maestraService.listarZona().subscribe(
        (data:any) => {
          resolve(true);

          this.zonales = data;
        },
        ()=>{resolve(false);}
      );
    });
    return promise;
  }

  listarDepartamentos():Promise<any> {
    let promise = new Promise( (resolve, reject) => {
      this.fs.maestraService.listarDepartamentoUsuario(sessionStorage.getItem("IdUsuario")).subscribe(
        (data:any) => {
          resolve(true);
          this.departamentos = data;
        },
        ()=>{resolve(false);}
      );
    });
    return promise;
  }

  editarUsuario() {
    if (this.entidadModal.bolMunicipalidad) {
      if (this.entidadModal.codMunicipalidad == null) {
        this.funciones.mensaje("warning", "Debe de seleccionar una Municipalidad");
        return;
      }
    } else {
      if (this.entidadModal.nombrePerfil == "RESPONSABLE") {
        this.funciones.mensaje("warning", "El usuario no puede tener perfil responsable.");
        return;
      }
      if (this.entidadModal.nombrePerfil == "COORDINADOR" || this.entidadModal.nombrePerfil == "ESPECIALISTA") {
        if (this.entidadModal.codDepaArray.length == 0) {
          this.funciones.mensaje("warning", "Debe de seleccionar un departamento");
          return;
        }
      }
      if (this.entidadModal.nombrePerfil == "MONITOR MACROZONAL") {
        if (this.entidadModal.codZonal == null) {
          this.funciones.mensaje("warning", "Debe de seleccionar una Zona");
          return;
        }
      }
    }
    let entidadEdicion = new Acceso();
    entidadEdicion.id_detalle_usuario = this.entidadEditar.id_detalle_usuario;
    entidadEdicion.id_usuario = this.entidadEditar.id_usuario;
    entidadEdicion.es_municipalidad = this.entidadModal.bolMunicipalidad;
    entidadEdicion.id_perfil = this.entidadModal.codPerfil;
    entidadEdicion.id_municipalidad = this.entidadModal.codMunicipalidad == null ? null : this.entidadModal.codMunicipalidad;
    entidadEdicion.coddepa = this.entidadModal.codDepaArray.length == 0 ? null : this.entidadModal.codDepaArray.toString();
    entidadEdicion.id_zona = this.entidadModal.codZonal;
    entidadEdicion.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.fs.accesoService.editarAcceso(entidadEdicion).subscribe(
      data => {
        if (data == 0) {
          this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
        }
        else {
          this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }

  guardarUsuario() {
    if (this.entidadModal.bolMunicipalidad) {
      if (this.entidadModal.codMunicipalidad == null) {
        this.funciones.mensaje("warning", "Debe de seleccionar una Municipalidad");
        return;
      }
    } else {
      if (this.entidadModal.nombrePerfil == "RESPONSABLE") {
        this.funciones.mensaje("warning", "El usuario no puede tener perfil responsable.");
        return;
      }
      if (this.entidadModal.nombrePerfil == "COORDINADOR" || this.entidadModal.nombrePerfil == "ESPECIALISTA") {
        if (this.entidadModal.codDepartamento == null) {
          this.funciones.mensaje("warning", "Debe de seleccionar un departamento");
          return;
        }
      }
      if (this.entidadModal.nombrePerfil == "MONITOR MACROZONAL") {
        if (this.entidadModal.codZonal == null) {
          this.funciones.mensaje("warning", "Debe de seleccionar una Zona");
          return;
        }
      }
    }
    let entidadRegistrar = new Acceso();
    entidadRegistrar.id_detalle_usuario = 0;
    entidadRegistrar.id_usuario = this.entidadModal.codUsuario;
    entidadRegistrar.es_municipalidad = this.entidadModal.bolMunicipalidad == null ? false : this.entidadModal.bolMunicipalidad;
    entidadRegistrar.id_perfil = this.entidadModal.codPerfil;
    entidadRegistrar.id_municipalidad = this.entidadModal.codMunicipalidad == null ? null : this.entidadModal.codMunicipalidad;
    entidadRegistrar.id_zona = this.entidadModal.codZonal;
    entidadRegistrar.coddepa = this.entidadModal.codDepartamento == null ? null : this.entidadModal.codDepartamento.toString();
    entidadRegistrar.usuario_creacion = sessionStorage.getItem("Usuario");
    let existe;
    this.fs.accesoService.obtenerAccesoExistente(this.entidadModal.codUsuario, this.entidadModal.codPerfil).subscribe(
      user => {
        existe = user;
        if (existe == "") {
          this.fs.accesoService.registrarAcceso(entidadRegistrar).subscribe(
            (data:any) => {
              if (data == 0) {
                this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
              }
              else {
                this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
                this.retornoValores.emit(0);
                this.modalRef.hide();
              }
            }
          );
        } else {
          this.funciones.mensaje("info", "El usuario ya esta registrado con el mismo perfil.");
        }
      }
    )

  }

  CargarPerfiles(item: any, codigo_modulo?: string): void {
    if (item != undefined) {
      this.entidadModal.codPerfil = null;

      this.perfiles = this.ListadoSistemas.find(x => x.id_modulo == item.id_modulo).perfiles;
      this.perfiles.forEach(element => {
        element.disabled=false;
      });
      if (this.perfiles.length == 1) {
        this.entidadModal.codPerfil = this.perfiles[0].id_perfil;
      }
      // SI ES EDITAR
      if (this.entidadEditar != null) {
        this.entidadModal.codPerfil = this.entidadEditar.id_perfil;
        this.esSSP = (codigo_modulo.toLowerCase() === "ssp") ? true : false;

  
        if(this.entidadEditar.nombre_perfil== "ESPECIALISTA"){
          this.entidadModal.codMunicipalidad = null;
          this.entidadModal.bolMunicipalidad=false;

          this.desZonal = true;
          this.desMuni = true;
          this.desDepartamento = false;
          
          this.entidadModal.codPerfil=this.entidadEditar.id_perfil;

          // let entidadEdicion = new Acceso();
          // entidadEdicion.id_detalle_usuario = this.entidadEditar.id_detalle_usuario;
          // entidadEdicion.id_usuario = this.entidadEditar.id_usuario;
          // entidadEdicion.es_municipalidad = this.entidadModal.bolMunicipalidad;
          // entidadEdicion.id_perfil = this.entidadModal.codPerfil;
          // entidadEdicion.id_municipalidad = this.entidadModal.codMunicipalidad == null ? null : this.entidadModal.codMunicipalidad;
          // entidadEdicion.coddepa = this.entidadModal.codDepaArray.length == 0 ? null : this.entidadModal.codDepaArray.toString();
          // entidadEdicion.id_zona = this.entidadModal.codZonal;
          // entidadEdicion.usuario_modificacion = sessionStorage.getItem("Usuario");
        }



      }
      else {
        this.esSSP = (item.codigo_modulo.toLowerCase() === "ssp") ? true : false;
      }

      if (this.perfiles == null) {
        this.entidadModal.codPerfil = null
      };
    }
    else {
      this.entidadModal.codPerfil = null;
      this.id_modulo = null;
      this.perfiles = [];
    }
  }
  Configurar(accion:number,usuario_actual:string){
    if(accion==1){ //NUEVO
      if (sessionStorage.getItem("Nombre_Perfil").toString() == "COORDINADOR") {
        this.listarMunicipalidadesDepa().then((rpta)=>{
          if(rpta){
            this.desCheck=false;
            this.entidadModal.bolMunicipalidad=true;
            let asignar = this.perfiles.find(x => x.nombre_perfil == "RESPONSABLE");
            if(asignar!=null){
              this.entidadModal.codPerfil = asignar.id_perfil;
              this.entidadModal.nombrePerfil = asignar.nombre_perfil;
              this.desDepartamento = true;
              this.entidadModal.codDepartamento=null;
            }
          }
        });
      } else {
        this.listarMunicipalidades();
      }
      if (this.ListadoSistemas.length == 1) {
        this.entidadModal.id_modulo = this.ListadoSistemas[0].id_modulo;
        this.buscarCombosistema.disabled = true;
        //this.CargarPerfiles(this.ListadoSistemas[0]);
      }
    }
    if(accion==2){ //EDITAR
      if (sessionStorage.getItem("Nombre_Perfil").toString() == "COORDINADOR") {
        this.listarMunicipalidadesDepa().then((rpta)=>{
          if(rpta){
            this.setearCamposEditar();
          }
        });
      } else {
        this.listarMunicipalidades().then((rpta)=>{
          if(rpta){
            this.setearCamposEditar();
          }
        });
      }
      if (this.ListadoSistemas.length == 1) {
        this.entidadModal.id_modulo = this.ListadoSistemas[0].id_modulo;
        this.buscarCombosistema.disabled = true;
        //this.CargarPerfiles(this.ListadoSistemas[0]);
      }
    }
  }
}