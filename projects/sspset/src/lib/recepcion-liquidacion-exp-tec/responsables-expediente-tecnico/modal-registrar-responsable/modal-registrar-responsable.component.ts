import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from '../../../../appSettings/funciones';
import { FacadeService } from '../../../patterns/facade.service';
import { Usuario, Correo, Telefono } from '../../../../models/response/usuario';



@Component({
  selector: 'set-modal-registrar-responsable',
  templateUrl: './modal-registrar-responsable.component.html',
  styleUrls: ['./modal-registrar-responsable.component.css']
})
export class ModalRegistrarResponsableComponent implements OnInit {
  lstPerfiles=[];

  formUsuario: FormGroup;
  lstColegio = [];
  lstTelefonos = [];
  lstCorreos = [];
  @Output() retornoValores = new EventEmitter();
  registrado: EventEmitter<any> = new EventEmitter();

  nombre_usuario: string = "";

  foto: string = "";
  beUsuario: Usuario;
  bRegistro: boolean = true;

  idSeguimientoEXpediente:number=0;

  lstResponsables =[];

  constructor(public modalRef: BsModalRef, private formBuilder: FormBuilder, public funciones: Funciones, private fs: FacadeService) { }

  ngOnInit() {
    this.nombre_usuario = sessionStorage.getItem("Usuario");
    if (this.beUsuario == null) {
      this.bRegistro = true
    } else {
      this.bRegistro = false
    }
                    
    this.cargarCombos();            
    this.cargarForm();
  }

  cargarCombos() {
    this.fs.responsableElaboracionExpedienteService.listarCombosResponsable().subscribe(
      (data: any) => {
        if (data != null && data != "") {
          this.lstPerfiles = data.funcion_responsable;
          this.lstColegio = data.tipo_colegiatura;
        }
      }
    );
  }

  cargarForm() {
    if (this.bRegistro) {
      this.formUsuario = this.formBuilder.group({
        nro_dni: [null, Validators.required],
        nombres: [null, Validators.required],
        apellido_paterno: [null, Validators.required],
        apellido_materno: [null, Validators.required],
        id_tipo_colegiatura: [null],
        nro_colegiatura: [null],
        valCorreo: [null, Validators.compose([Validators.required, Validators.email])],
        valTelefono: [null, Validators.compose([Validators.required, Validators.minLength(7)])],
        correos: new FormArray([]),
        telefonos: new FormArray([]),
        id_funcion_responsable: [null, Validators.required],
        //id_padre: sessionStorage.IUsuario,
        //id_municipalidad: null,
        //doc_designacion: null,
        //id_usuario: 0,
        //usuario: null,
        usuario_creacion: this.nombre_usuario,
        foto: null,
        estado_profesional: [null, Validators.required],
        es_colegiado: false,
        no_colegiado: false,
        //no_corresponde: false,
        //activo: true,
      });
    } else {
      this.formUsuario = this.formBuilder.group({
        nro_dni: this.beUsuario.nro_dni,
        nombres: this.beUsuario.nombres,
        apellido_paterno: this.beUsuario.apellido_paterno,
        apellido_materno: this.beUsuario.apellido_materno,
        id_tipo_colegiatura: this.beUsuario.id_tipo_colegiatura,
        nro_colegiatura: this.beUsuario.nro_colegiatura,
        valCorreo: [null, Validators.compose([Validators.required, Validators.email])],
        valTelefono: [null, Validators.compose([Validators.required, Validators.minLength(7)])],
        correos: new FormArray([]),
        telefonos: new FormArray([]),
        id_funcion_responsable: this.beUsuario.id_funcion_responsable,
        id_resp_expd_tecn: this.beUsuario.id_resp_expd_tecn,
        //id_padre: this.beUsuario.id_padre,
        //id_municipalidad: this.beUsuario.id_municipalidad,
        //doc_designacion: this.beUsuario.doc_designacion,
        //id_usuario: this.beUsuario.id_usuario,
        //usuario: this.beUsuario.usuario,
        usuario_modificacion: this.nombre_usuario,
        foto: this.beUsuario.foto,
        estado_profesional: this.updateEstadoProfesional(),
        es_colegiado: this.beUsuario.es_colegiado,
        no_colegiado: this.beUsuario.no_colegiado,
        //no_corresponde: this.beUsuario.no_corresponde,
        //activo: this.beUsuario.activo
      });
      this.foto = this.beUsuario.foto;
      let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
      //imagen.src = "data:image/jpg;base64," + this.beUsuario.foto;
      imagen.src = this.beUsuario.foto;

      if (this.beUsuario.correos != null) {
        this.beUsuario.correos.forEach(element => {
          this.lstCorreos.push(element.email);
        });
      }

      if (this.beUsuario.telefonos != null) {
        this.beUsuario.telefonos.forEach(element => {
          this.lstTelefonos.push(element.telefono);
        });
      }

      this.updateListaCorreos();
      this.updateListaTelefonos();
    };
  }

  closeModal() {
    this.retornoValores.emit(true);
    this.modalRef.hide();
  }

  updateEstadoProfesional() {
    if (this.beUsuario.es_colegiado == true) {
      return 1;
    }
    if (this.beUsuario.no_colegiado == true) {
      return 2;
    }
    if (this.beUsuario.no_corresponde == true) {
      return 3;
    }
  }

  updateListaCorreos() {
    let correo: FormArray = <FormArray>this.formUsuario.get("correos");
    if (this.beUsuario.correos != null) {
      for (let i = 0; i < this.beUsuario.correos.length; i++) {
        correo.push(this.formBuilder.group({
          id_resp_expd_tecn_correo: this.beUsuario.correos[i].id_resp_expd_tecn_correo,
          email: this.beUsuario.correos[i].email,
          id_responsable_seguimiento_expediente: this.beUsuario.correos[i].id_responsable_seguimiento_expediente,
          usuario_modificacion: this.nombre_usuario,
          estado: true
        }
        ));
      }
    }
    return correo;
  }

  updateListaTelefonos() {
    let telefono: FormArray = <FormArray>this.formUsuario.get("telefonos");
    if (this.beUsuario.telefonos != null) {
      for (let i = 0; i < this.beUsuario.telefonos.length; i++) {
        telefono.push(this.formBuilder.group({
          id_resp_expd_tecn_telef: this.beUsuario.telefonos[i].id_resp_expd_tecn_telef,
          telefono: this.beUsuario.telefonos[i].telefono,
          id_responsable_seguimiento_expediente: this.beUsuario.telefonos[i].id_responsable_seguimiento_expediente,
          usuario_modificacion: this.nombre_usuario,
          estado: true
        }
        ));
      }
    }
    return telefono;
  }

  eliminarCorreo(index) {
    if (this.lstCorreos != null) {
      this.lstCorreos.splice(index, 1);
      let correo: FormArray = <FormArray>this.formUsuario.get("correos");
      if (this.bRegistro) {
        correo.removeAt(index);
      } else {
        correo.value[index].id_resp_expd_tecn_correo == 0 ? correo.removeAt(index) : correo.value[index].estado = false;
      }
    }
  }

  agregarCorreo() {
    let valCorreo = this.formUsuario.get("valCorreo").value;
    if (valCorreo.trim() == "" || valCorreo == null) {
      document.getElementById("txtCorreo").focus();
      this.funciones.mensaje("info", "Debe ingresar un correo.");
    } else {

      if (this.lstCorreos.find(x => x == valCorreo) != null) {
        this.funciones.mensaje("info", "El correo electrónico ya fue ingresado.");
        return;
      }

      this.lstCorreos.push(valCorreo);
      this.construirListadoCorreo();
      this.formUsuario.patchValue({ valCorreo: null });
    }
  }

  construirListadoCorreo(): void {
    let correo: FormArray = <FormArray>this.formUsuario.get("correos");
    if (this.bRegistro) {
      while (correo.length !== 0) {
        correo.removeAt(0)
      }
      if (this.lstCorreos != null) {
        for (let i = 0; i < this.lstCorreos.length; i++) {
          correo.push(this.formBuilder.group({
            id_resp_expd_tecn_correo: 0,
            email: this.lstCorreos[i],
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          }
          ));
        }
      }
    } else {
      correo.push(this.formBuilder.group({
        id_resp_expd_tecn_correo: 0,
        email: this.formUsuario.get("valCorreo").value,
        id_responsable_seguimiento_expediente: 0,
        usuario_creacion: this.nombre_usuario,
        estado: true
      }
      ));
    }
  }

  agregarTelefono() {
    let valTelefono = this.formUsuario.get("valTelefono").value;
    if (valTelefono.trim() == "" || valTelefono == null) {
      document.getElementById("txtTelefono").focus();
      this.funciones.mensaje("info", "Debe ingresar el número de teléfono.");
    } else {

      if (this.lstTelefonos.find(x => x == valTelefono.trim()) != null) {
        this.funciones.mensaje("info", "El número de Teléfono ya fue ingresado.");
        return;
      }

      this.lstTelefonos.push(valTelefono);
      this.construirListadoTelefono();
      this.formUsuario.patchValue({ valTelefono: null });
    }
  }

  construirListadoTelefono(): void {
    let telefono: FormArray = <FormArray>this.formUsuario.get("telefonos");
    if (this.bRegistro) {
      while (telefono.length !== 0) {
        telefono.removeAt(0)
      }
      if (this.lstTelefonos != null) {
        for (let i = 0; i < this.lstTelefonos.length; i++) {
          telefono.push(this.formBuilder.group({
            id_resp_expd_tecn_telef: 0,
            telefono: this.lstTelefonos[i],
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          }));
        }
      }
    } else {
      telefono.push(this.formBuilder.group({
        id_resp_expd_tecn_telef: 0,
        telefono: this.formUsuario.get("valTelefono").value,
        id_responsable_seguimiento_expediente: 0,
        usuario_creacion: this.nombre_usuario,
        estado: true
      }
      ));
    }
  }

  eliminarTelefono(index) {
    if (this.lstTelefonos != null) {
      this.lstTelefonos.splice(index, 1);
      let telefono: FormArray = <FormArray>this.formUsuario.get("telefonos");
      if (this.bRegistro) {
        telefono.removeAt(index);
      } else {
        telefono.value[index].id_resp_expd_tecn_telef == 0 ? telefono.removeAt(index) : telefono.value[index].estado = false;
      }
    }
  }

  guardar() {
    if (this.bRegistro) {
      this.setearParametrosEnvioInformacion(this.formUsuario.value);
      if (this.validarControles()) {
        this.beUsuario.id_seguimiento_ejecucion_expediente=this.idSeguimientoEXpediente;
        this.fs.responsableElaboracionExpedienteService.insertarResponsableSeguimientoExpediente(this.beUsuario).subscribe(
          data => {
            let respuesta = data as any;
            if (respuesta != null) {
              if (respuesta > 0) {
                this.funciones.mensaje("success", "El proceso de registro de Responsable se realizó satisfactoriamente.");
                this.modalRef.hide();
                this.retornoValores.emit(true);
              } else {
                this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
              }
            }
          }
        );
      }
    } else {
      if (this.validarControles()) {
        this.setearParametrosEnvioInformacion(this.formUsuario.value);
        this.fs.responsableElaboracionExpedienteService.modificarResponsableExpedienteTecnico(this.beUsuario).subscribe(
          data => {
            let respuesta = data as any;
            if (respuesta != null) {
              if (respuesta > 0) {
                this.funciones.mensaje("success", "Los datos del responsable fueron actualizados satisfactoriamente");
                this.modalRef.hide();
                this.retornoValores.emit(true);
              } else {
                this.funciones.mensaje("error", this.funciones.mostrarMensaje("error", ""));
              }
            }
          }
        );
      }
    }
  }



  validarControles() {
    if (this.beUsuario.id_funcion_responsable == null) {
      this.funciones.mensaje("info", "Debe ingresar su función como responsable.");
      return false
    }

    if (this.beUsuario.nro_dni == null) {
      this.funciones.mensaje("info", "Debe ingresar DNI.");
      return false
    }

    if (this.beUsuario.nombres == null) {
      this.funciones.mensaje("info", "Debe ingresar un DNI válido");
      return false
    }

    if ((this.formUsuario.get("valCorreo").value != null && this.formUsuario.get("valCorreo").value != '')) {
      if (!this.validarEmail(this.formUsuario.get("valCorreo").value)) {
        this.funciones.mensaje("info", "Debe ingresar un correo eléctronico valido.");
        return false;
      }
    }
    if ((this.formUsuario.get("valTelefono").value != null && this.formUsuario.get("valTelefono").value != '')) {
      let telefono : string = this.formUsuario.get("valTelefono").value;
      if (telefono.length < 7) {
        this.funciones.mensaje("info", "El Nro de Teléfono debe contener al menos 7 Dígitos.");  
        return false;
      }
    }

    return true;
  }


  setearParametrosEnvioInformacion(pFormulario) {
    this.beUsuario = new Usuario();
    this.beUsuario.nro_dni = pFormulario.nro_dni;
    this.beUsuario.apellido_paterno = pFormulario.apellido_paterno;
    this.beUsuario.apellido_materno = pFormulario.apellido_materno;
    this.beUsuario.nombres = pFormulario.nombres;
    //this.beUsuario.id_municipalidad = pFormulario.id_municipalidad;
    //this.beUsuario.doc_designacion = pFormulario.doc_designacion;
    //this.beUsuario.usuario = pFormulario.usuario;
    this.beUsuario.usuario_creacion = this.nombre_usuario;
    this.beUsuario.usuario_modificacion = this.nombre_usuario;
    //this.beUsuario.id_usuario = pFormulario.id_usuario;
    this.beUsuario.nro_colegiatura = pFormulario.nro_colegiatura;
    this.beUsuario.id_perfil = pFormulario.id_perfil; 
    this.beUsuario.foto = "@foto1"; 
    //this.beUsuario.activo = pFormulario.activo;
    this.beUsuario.es_colegiado = pFormulario.es_colegiado;
    this.beUsuario.no_colegiado = pFormulario.no_colegiado;
    //this.beUsuario.no_corresponde = pFormulario.no_corresponde;
    this.beUsuario.id_tipo_colegiatura = pFormulario.id_tipo_colegiatura;
    this.beUsuario.correos = new Array<Correo>();
    this.beUsuario.telefonos = new Array<Telefono>();
    this.beUsuario.id_funcion_responsable = pFormulario.id_funcion_responsable; //Perfil
    this.beUsuario.id_resp_expd_tecn = pFormulario.id_resp_expd_tecn;

    if (this.bRegistro) {
      if (pFormulario.correos == null) {
        let correo = pFormulario.valCorreo;
        if (correo != null && correo != "") {
          this.beUsuario.correos.push({
            email: correo,
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      } else {
        if (pFormulario.correos.length == 0) {
          let correo = pFormulario.valCorreo;
          if (correo != null && correo != "") {
            this.beUsuario.correos.push({
              email: correo,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            });
          }
        } else {

          let correo = pFormulario.valCorreo;
          if (correo != null && correo != "") {
            this.beUsuario.correos.push({
              email: correo,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            });
          }

          pFormulario.correos.forEach(element => {
            this.beUsuario.correos.push({
              email: element.email,
              id_responsable_seguimiento_expediente: element.id_responsable_seguimiento_expediente,
              usuario_creacion: this.nombre_usuario,
              estado: element.estado
            })
          });
        }
      }

      if (pFormulario.telefonos == null) {
        let telefono = pFormulario.valTelefono;
        if (telefono != null && telefono != "") {
          this.beUsuario.telefonos.push({
            telefono: telefono,
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          })
        }
      } else {
        if (pFormulario.telefonos.length == 0) {
          let telefono = pFormulario.valTelefono;
          if (telefono != null && telefono != "") {
            this.beUsuario.telefonos.push({
              telefono: telefono,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }
        } else {

          let telefono = pFormulario.valTelefono;
          if (telefono != null && telefono != "") {
            this.beUsuario.telefonos.push({
              telefono: telefono,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }

          pFormulario.telefonos.forEach(element => {
            this.beUsuario.telefonos.push({
              telefono: element.telefono,
              id_responsable_seguimiento_expediente: element.id_responsable_seguimiento_expediente,
              usuario_creacion: this.nombre_usuario,
              estado: element.estado
            })
          });
        }
      }

    } else {
      pFormulario.correos.forEach(element => {
        this.beUsuario.correos.push({
          id_resp_expd_tecn_correo: element.id_resp_expd_tecn_correo,
          email: element.email,
          id_responsable_seguimiento_expediente: element.id_responsable_seguimiento_expediente,
          usuario_creacion: this.nombre_usuario,
          estado: element.estado
        })
      });

      if (this.lstCorreos.length == 0) {
        let correo = pFormulario.valCorreo;
        if (correo != null && correo != "") {
          this.beUsuario.correos.push({
            id_resp_expd_tecn_correo: 0,
            email: correo,
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      }

      let correo = pFormulario.valCorreo;
      if (correo != null && correo != "") {
        if (this.beUsuario.correos.find(x => x.email == correo) == null) {
          this.beUsuario.correos.push({
            id_resp_expd_tecn_correo: 0,
            email: correo,
            id_responsable_seguimiento_expediente: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      }

      if (pFormulario.telefonos != null) {
        pFormulario.telefonos.forEach(element => {
          this.beUsuario.telefonos.push({
            id_resp_expd_tecn_telef: element.id_resp_expd_tecn_telef,
            telefono: element.telefono,
            id_responsable_seguimiento_expediente: element.id_responsable_seguimiento_expediente,
            usuario_creacion: this.nombre_usuario,
            estado: element.estado
          })
        });

        if (this.lstTelefonos.length == 0) {
          let telefono = pFormulario.valTelefono;
          if (telefono != null && telefono != "") {
            this.beUsuario.telefonos.push({
              id_resp_expd_tecn_telef: 0,
              telefono: telefono,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }
        }

        let telefono = pFormulario.valTelefono;
        if (telefono != null && telefono != "") {
          if (this.beUsuario.telefonos.find(x => x.telefono == telefono) == null) {
            this.beUsuario.telefonos.push({
              id_resp_expd_tecn_telef: 0,
              telefono: telefono,
              id_responsable_seguimiento_expediente: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }
        }
      }
    }
  }

  validarDNI() {
    let valDni = this.formUsuario.get("nro_dni").value;
    if (valDni.length == 8) {
      this.ValidarInformacionReniec();
    } else {
      this.formUsuario.patchValue({
        nombres: null,
        apellido_paterno: null,
        apellido_materno: null,
        //usuario: null
      });
      let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
      imagen.src = "";
    }
  }



  ValidarInformacionReniec() {
    let valDni = this.formUsuario.get("nro_dni").value;
    let cant=0;
    if (valDni == "" || valDni == null) {
      document.getElementById("nro_dni").focus();
      this.funciones.mensaje("info", "Debe ingresar el N° de Dni a validar.");
    } else {
      if(cant==0){
        this.fs.dataexternaService.consultarInformacionReniec(valDni).subscribe(
          data => {
            let response = data as any;
            if (data != null && data != "") {
              this.formUsuario.patchValue({
                nombres: response.strnombres,
                apellido_paterno: response.strapellidopaterno,
                apellido_materno: response.strapellidomaterno,
                //usuario: this.formUsuario.value.nro_dni
              });
              this.foto = response.strfoto;
              let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
              imagen.src = response.strfoto;
            } else {
              this.funciones.mensaje("info", "No se encontró información del Dni ingresado.");
              this.formUsuario.patchValue({
                nombres: null,
                apellido_paterno: null,
                apellido_materno: null,
                //usuario: null
              });
              let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
              imagen.src = "";
            }
          }
        );
      }else{
        this.funciones.mensaje("info", "El DNI ingresado ya se encuentra registrado en el sistema.");
      }

     /* this.fs.responsableElaboracionExpedienteService.listarResponsableSeguimientoExpediente(this.idSeguimientoEXpediente,0,5).subscribe(
        (data: any) => {
          this.lstResponsables = data.responsable;
          if(this.lstResponsables!=null){
            for(let i=0;i<this.lstResponsables.length;i++){
              if(this.lstResponsables[i].dni==valDni){
                cant++;
              }
            }
          }*/
          
          /**inicio cant */

          /*fin cant*/
        //}
      //)
    }
  }

  /*setEstadoProfesional() {
    switch (this.formUsuario.value.estado_profesional) {
      case 1: {
        this.formUsuario.patchValue({ es_colegiado: true, no_colegiado: false, no_corresponde: false, id_colegio_profesional: null, nro_colegiatura: null })
        break;
      }
      case 2: {
        this.formUsuario.patchValue({ no_colegiado: true, es_colegiado: false, no_corresponde: false, id_colegio_profesional: null, nro_colegiatura: null })
        break;
      }
      case 3: {
        this.formUsuario.patchValue({ no_corresponde: true, es_colegiado: false, no_colegiado: false, id_colegio_profesional: null, nro_colegiatura: null })
        break;
      }
    }
  }*/

   setEstadoProfesional() {
    switch (this.formUsuario.value.estado_profesional) {
      case 1: {
        this.formUsuario.patchValue({ es_colegiado: true, no_colegiado: false, id_tipo_colegiatura: null, nro_colegiatura: null })
        break;
      }
      case 2: {
        this.formUsuario.patchValue({ no_colegiado: true, es_colegiado: false, id_tipo_colegiatura: null, nro_colegiatura: null })
        break;
      }
      case 3: {
        this.formUsuario.patchValue({ es_colegiado: false, no_colegiado: false, id_tipo_colegiatura: null, nro_colegiatura: null })
        break;
      }
    }
  }

  validarEmail(telefono: string): boolean {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (emailRegex.test(telefono)) {
      return true;
    } else {
      return false;
    }
  }

  cerrar() {
    this.modalRef.hide();
    this.registrado.emit(true);
  }


}
