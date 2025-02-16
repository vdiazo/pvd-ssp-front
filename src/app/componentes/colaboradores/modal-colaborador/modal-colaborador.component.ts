import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { sessionStorageItems, Functions } from 'src/app/appSettings';
import { ITramo, IColaborador, IUsuarioTramo } from 'src/app/Interfaces';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-colaborador',
  templateUrl: './modal-colaborador.component.html',
  styleUrls: ['./modal-colaborador.component.css']
})
export class ModalColaboradorComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  @Input() idColaborador: number
  formGroup: FormGroup
  tramos: ITramo[];
  idMunicipalidad: number = Number.parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_MUNICIPALIDAD));
  tieneSeleccionTramos: boolean = false

  constructor(private fs: FacadeService, private fb: FormBuilder, private funciones: Functions, private modalRef: BsModalRef, ) { }

  ngOnInit() {
    this.construirForm();
    this.listarTramos();
  }

  listarTramos(): any {

    if (this.idColaborador === 0) {
      this.fs.colaboradoresService.listarTramosDeProyectos(this.idMunicipalidad).subscribe(
        data => {
          data.forEach(value => {
            value.id_usuario_tramo = 0;
            value.seleccionado = 0;
          })

          this.tramos = data;
          this.construirTramos();
        }
      )
    } else {
      this.fs.colaboradoresService.listarUsuarioColaboradorTramo(this.idColaborador, this.idMunicipalidad).subscribe(
        data => {
          this.formGroup.get("colaboradorGroup").patchValue(
            {
              "usuario": data[0].usuario,
              "contrasenia": "RN$B15021984",
              "nombre_usuario": data[0].nombre_usuario,
              "correo_electronico": data[0].correo_electronico,
              "celular": data[0].celular,
              "dni_usuario": data[0].dni_usuario
            }
          );

          (<any>document.getElementById("txtUsuario")).readOnly = true;
          this.formGroup.get("colaboradorGroup.contrasenia").disable();

          this.tramos = data[0].tramos;
          this.construirTramos();
        }
      )
    }
  }

  construirForm() {
    this.formGroup = this.fb.group(
      {
        colaboradorGroup: this.fb.group(
          {
            "id_usuario": this.idColaborador,
            "usuario": [null, Validators.compose([Validators.required, Validators.minLength(8)])],
            "contrasenia": [null, Validators.compose([Validators.required, Validators.minLength(8)])],
            "nombre_usuario": [null, Validators.compose([Validators.required, Validators.minLength(10)])],
            "correo_electronico": [null, Validators.compose([Validators.required, Validators.email])],
            "celular": [null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
            "dni_usuario": [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
            "usuario_creacion": sessionStorage.getItem(sessionStorageItems.SS_USUARIO),
            "usuario_modificacion": sessionStorage.getItem(sessionStorageItems.SS_USUARIO)
          }
        ),
        TramoGroup: new FormArray([])
      }
    );
  }

  construirTramos() {
    let tramos = <FormArray>this.formGroup.get("TramoGroup");
    this.tramos.forEach((a, b, c) => {

      if (!this.tieneSeleccionTramos) {
        this.tieneSeleccionTramos = a.seleccionado == 1;
      }

      tramos.push(
        this.fb.group(
          {
            id_usuario_tramo: (a.id_usuario_tramo == null ? 0 : a.id_usuario_tramo),
            id_tramo: a.id_tramo,
            activo: a.seleccionado == 1,
            usuario_creacion: sessionStorage.getItem(sessionStorageItems.SS_USUARIO),
            usuario_modificacion: sessionStorage.getItem(sessionStorageItems.SS_USUARIO),
            usuario_eliminacion: sessionStorage.getItem(sessionStorageItems.SS_USUARIO)
          }));
    });
  }

  AddOrRemoveTramoToColaborador(row: ITramo, chk) {
    let tramos = <FormArray>this.formGroup.get("TramoGroup");
    let index = tramos.controls.findIndex(x => x.value.id_tramo == row.id_tramo);

    tramos.at(index).value.activo = chk.target.checked;

    this.tieneSeleccionTramos = tramos.controls.findIndex(x=> x.value.activo == true) != -1;

    // otra forma de asignar un valor
    // tramos.at(index).patchValue({
    //   activo: chk.target.checked
    // })

  }

  procesarUsuarioColaborador() {
    let colaborador: IColaborador
    let usuarioTramos: IUsuarioTramo[]

    colaborador = Object.assign(this.formGroup.get("colaboradorGroup").value, colaborador)
    usuarioTramos = Object.assign(this.formGroup.get("TramoGroup").value, usuarioTramos)
    
    let msg = this.formGroup.get("colaboradorGroup.id_usuario").value == 0 ? "insertar" : "actualizar";

    if (msg == "insertar") {
      this.fs.usuarioService.ObtenerUsuario(this.formGroup.get("colaboradorGroup.usuario").value).subscribe(
        data=>{
          if(data != ""){
            this.funciones.mensaje("warning","El usuario ya existe");
          }else{
            this.procesarUsuario(colaborador, usuarioTramos, msg);
          }
        }
      )  
    }else{
      this.procesarUsuario(colaborador, usuarioTramos, msg);
    }

  }

  private procesarUsuario(colaborador: IColaborador, usuarioTramos: IUsuarioTramo[], msg: string) {
    this.fs.colaboradoresService.procesarUsuarioColaborador(colaborador, usuarioTramos).subscribe(data => {
      if (data == 0) {
        this.funciones.mensaje("danger", this.funciones.mostrarMensaje("error", ""));
      }
      else {
        this.funciones.mensaje("success", this.funciones.mostrarMensaje(msg, ""));
        this.retornoValores.emit(data);
        this.modalRef.hide();
      }
    });
  }

  closeModal() {
    this.retornoValores.emit({});
    this.modalRef.hide();
  }

}